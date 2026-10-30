import { buildEmailTemplateHtml } from '@/lib/email-templates';
import type { EmailTemplateId } from '@/lib/email-templates';

type ApplicationEmailTemplateParams = {
  jobTitle: string;
  coverLetterHtml: string;
  cvUrl: string;
  templateId?: EmailTemplateId;
};

export function buildApplicationEmailHtml({
  jobTitle,
  coverLetterHtml,
  cvUrl,
  templateId,
}: ApplicationEmailTemplateParams) {
  return buildEmailTemplateHtml(templateId, {
    jobTitle,
    coverLetterHtml,
    cvUrl,
  });
}
