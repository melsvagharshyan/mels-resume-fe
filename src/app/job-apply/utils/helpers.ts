import { DEFAULT_EMAIL_TEMPLATE_ID, type EmailTemplateId } from '@/lib/email-templates';
import { loadSelectedEmailTemplateId } from '@/app/email-templates/utils/helpers';

type SendApplicationParams = {
  toEmail: string;
  coverLetter: string;
  jobTitle: string;
  cvUrl: string;
  templateId?: EmailTemplateId;
};

function resolveTemplateId(templateId?: EmailTemplateId): EmailTemplateId {
  if (templateId) return templateId;
  if (typeof window !== 'undefined') return loadSelectedEmailTemplateId();
  return DEFAULT_EMAIL_TEMPLATE_ID;
}

export async function sendApplication({
  toEmail,
  coverLetter,
  jobTitle,
  cvUrl,
  templateId,
}: SendApplicationParams) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toEmail: toEmail.trim(),
      coverLetter,
      jobTitle,
      cvUrl,
      templateId: resolveTemplateId(templateId),
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? 'Failed to send email');
  }
}
