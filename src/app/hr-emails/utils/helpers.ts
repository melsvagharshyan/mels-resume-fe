import { HR_CONTACTS_STORAGE_KEY } from './constants';
import type { HrCompany } from './types';

export function loadStoredContacts(): HrCompany[] {
  try {
    const raw = window.localStorage.getItem(HR_CONTACTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HrCompany[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredContacts(contacts: HrCompany[]) {
  window.localStorage.setItem(HR_CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}
