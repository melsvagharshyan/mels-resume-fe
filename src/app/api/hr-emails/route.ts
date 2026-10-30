import { NextResponse } from 'next/server';
import type { HrContactsResponse } from '@/app/store/hr-emails/types';
import { fetchDjinniHrContacts } from './utils/djinni';
import { fetchDouHrContacts } from './utils/dou';
import { mergeContacts } from './utils/filters';
import { fetchHabrHrContacts } from './utils/habr';
import { fetchHhHrContacts } from './utils/hh';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function GET() {
  try {
    const results = await Promise.allSettled([
      fetchDjinniHrContacts(),
      fetchHhHrContacts(),
      fetchHabrHrContacts(),
      fetchDouHrContacts(),
    ]);

    const groups = results.map((result, index) => {
      if (result.status === 'fulfilled') return result.value;
      console.error(`HR source ${index} failed`, result.reason);
      return [];
    });

    const data = mergeContacts(groups);
    return NextResponse.json<HrContactsResponse>({ data });
  } catch (error) {
    console.error('Failed to fetch HR emails from professional sources', error);
    return NextResponse.json(
      { message: 'Failed to fetch HR emails from professional sources' },
      { status: 500 },
    );
  }
}
