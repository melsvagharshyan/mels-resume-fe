import type { HrContactDto } from '@/app/store/hr-emails/types';
import { CONCURRENCY } from '@/app/api/djinni-hr-emails/utils/constants';
import {
  fetchDjinniJobs,
  groupJobsByCompany,
  mapWithConcurrency,
  resolveCompanyContacts,
} from '@/app/api/djinni-hr-emails/utils/helpers';
import { finalizeContacts } from './filters';

export async function fetchDjinniHrContacts(): Promise<HrContactDto[]> {
  const jobs = await fetchDjinniJobs();
  const companies = groupJobsByCompany(jobs);
  const contacts = await mapWithConcurrency(companies, CONCURRENCY, resolveCompanyContacts);
  return finalizeContacts(contacts.flat());
}
