import type { HrContactDto } from '@/app/store/hr-emails/types';
import { BLOCKED_COMPANY_PATTERNS, TARGET_EMAILS_PER_SOURCE } from './constants';

export function isBlockedCompany(name: string): boolean {
  const value = name.trim();
  if (!value) return false;
  return BLOCKED_COMPANY_PATTERNS.some((pattern) => pattern.test(value));
}

export function finalizeContacts(
  contacts: HrContactDto[],
  limit = TARGET_EMAILS_PER_SOURCE,
): HrContactDto[] {
  const seen = new Set<string>();
  const result: HrContactDto[] = [];

  for (const contact of contacts) {
    if (isBlockedCompany(contact.company)) continue;
    const email = contact.email.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    result.push({ ...contact, email });
    if (result.length >= limit) break;
  }

  return result;
}

export function mergeContacts(groups: HrContactDto[][]): HrContactDto[] {
  const seen = new Set<string>();
  const result: HrContactDto[] = [];

  for (const group of groups) {
    for (const contact of group) {
      if (isBlockedCompany(contact.company)) continue;
      const email = contact.email.trim().toLowerCase();
      if (!email || seen.has(email)) continue;
      seen.add(email);
      result.push({ ...contact, email });
    }
  }

  return result;
}
