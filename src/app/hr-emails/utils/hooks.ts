import { useState } from 'react';
import { toast } from 'sonner';
import { sendApplication } from '@/app/job-apply/utils/helpers';
import { coverLetterTexts, cvUrls, tabTitles } from '@/app/job-apply/utils/constants';
import type { ApplyTab } from '@/app/job-apply/utils/types';
import { hrCompanies } from './constants';

export function useSendAllHrEmails() {
  const [selectedTab, setSelectedTab] = useState<ApplyTab>('frontend');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendAll = async () => {
    setIsSending(true);
    setProgress(0);

    let sent = 0;
    let failed = 0;

    for (const [index, company] of hrCompanies.entries()) {
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
    total: hrCompanies.length,
    sendAll,
  };
}
