import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { sendApplication } from '@/app/job-apply/utils/helpers';
import { coverLetterTexts, cvUrls, tabTitles } from '@/app/job-apply/utils/constants';
import type { ApplyTab } from '@/app/job-apply/utils/types';
import { useLazyGetHrContactsQuery } from '@/app/store/hr-emails/hr-emails.api';
import { isBlockedCompany } from './blocked';
import { loadStoredContacts, saveStoredContacts } from './helpers';
import type { HrCompany } from './types';

export function useHrContacts() {
  const [contacts, setContacts] = useState<HrCompany[]>([]);
  const [fetchContacts, { isFetching }] = useLazyGetHrContactsQuery();

  useEffect(() => {
    setContacts(loadStoredContacts().filter((contact) => !isBlockedCompany(contact.company)));
  }, []);

  const updateContacts = async () => {
    try {
      const data = await fetchContacts().unwrap();
      const filtered = data.filter((contact) => !isBlockedCompany(contact.company));
      setContacts(filtered);
      saveStoredContacts(filtered);
      toast.success(`Found ${filtered.length} emails (Djinni, hh.ru, Habr, DOU)`, {
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to update HR emails', error);
      toast.error('Failed to fetch emails from professional sources', { duration: 2500 });
    }
  };

  return { contacts, isUpdating: isFetching, updateContacts };
}

export function useSendAllHrEmails(companies: HrCompany[]) {
  const [selectedTab, setSelectedTab] = useState<ApplyTab>('frontend');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendable = companies.filter((company) => !isBlockedCompany(company.company));

  const sendAll = async () => {
    if (sendable.length === 0) return;

    setIsSending(true);
    setProgress(0);

    let sent = 0;
    let failed = 0;

    for (const [index, company] of sendable.entries()) {
      try {
        await sendApplication({
          toEmail: company.email,
          coverLetter: coverLetterTexts[selectedTab],
          jobTitle: tabTitles[selectedTab],
          cvUrl: cvUrls[selectedTab],
        });
        sent += 1;
      } catch (error) {
        console.error(`Failed to send to ${company.email}`, error);
        failed += 1;
      }

      setProgress(index + 1);
    }

    setIsSending(false);

    if (failed === 0) {
      toast.success(`Sent ${sent} applications`, { duration: 2000 });
      return;
    }

    toast.error(`Sent ${sent}, failed ${failed}`, { duration: 2500 });
  };

  return {
    selectedTab,
    setSelectedTab,
    isSending,
    progress,
    total: sendable.length,
    sendAll,
  };
}
