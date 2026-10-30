import {
  DEFAULT_EMAIL_TEMPLATE_ID,
  isEmailTemplateId,
  type EmailTemplateId,
} from '@/lib/email-templates';
import { SELECTED_EMAIL_TEMPLATE_KEY } from './constants';

export function loadSelectedEmailTemplateId(): EmailTemplateId {
  try {
    const raw = window.localStorage.getItem(SELECTED_EMAIL_TEMPLATE_KEY);
    if (isEmailTemplateId(raw)) return raw;
  } catch {
    // Ignore storage errors.
  }
  return DEFAULT_EMAIL_TEMPLATE_ID;
}

export function saveSelectedEmailTemplateId(templateId: EmailTemplateId) {
  window.localStorage.setItem(SELECTED_EMAIL_TEMPLATE_KEY, templateId);
}
