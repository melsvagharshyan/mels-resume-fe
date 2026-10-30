'use client';

import {
  SAMPLE_COVER_LETTER_HTML,
  SAMPLE_CV_URL,
  SAMPLE_JOB_TITLE,
  buildEmailTemplateHtml,
  type EmailTemplateId,
} from '@/lib/email-templates';

type TemplatePreviewProps = {
  templateId: EmailTemplateId;
};

export default function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const html = buildEmailTemplateHtml(templateId, {
    jobTitle: SAMPLE_JOB_TITLE,
    coverLetterHtml: SAMPLE_COVER_LETTER_HTML,
    cvUrl: SAMPLE_CV_URL,
  });

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div
        className="mx-auto max-w-[680px] overflow-hidden rounded-[20px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
