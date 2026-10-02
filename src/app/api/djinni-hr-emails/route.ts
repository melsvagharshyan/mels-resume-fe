import { NextResponse } from 'next/server';
import type { HrContactsResponse } from '@/app/store/hr-emails/types';
import { CONCURRENCY } from './utils/constants';
import {
  fetchDjinniJobs,
  groupJobsByCompany,
  mapWithConcurrency,
  resolveCompanyContacts,
} from './utils/helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET() {
  try {
    const jobs = await fetchDjinniJobs();
    const companies = groupJobsByCompany(jobs);
    const contacts = await mapWithConcurrency(companies, CONCURRENCY, resolveCompanyContacts);

    const seen = new Set<string>();
    const data = contacts.flat().filter((contact) => {
      if (seen.has(contact.email)) return false;
      seen.add(contact.email);
      return true;
    });

    return NextResponse.json<HrContactsResponse>({ data });
  } catch (error) {
    console.error('Failed to fetch Djinni HR emails', error);
    return NextResponse.json({ message: 'Failed to fetch Djinni HR emails' }, { status: 500 });
  }
}
