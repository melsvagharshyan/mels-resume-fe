import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  DEFAULT_EMAIL_TEMPLATE_ID,
  EMAIL_TEMPLATE_META,
  type EmailTemplateId,
} from '@/lib/email-templates';
import { loadSelectedEmailTemplateId, saveSelectedEmailTemplateId } from './helpers';

export function useEmailTemplatesPage() {
  const [selectedId, setSelectedId] = useState<EmailTemplateId>(DEFAULT_EMAIL_TEMPLATE_ID);
  const [previewId, setPreviewId] = useState<EmailTemplateId>(DEFAULT_EMAIL_TEMPLATE_ID);

  useEffect(() => {
    const stored = loadSelectedEmailTemplateId();
    setSelectedId(stored);
    setPreviewId(stored);
  }, []);

  const selectTemplate = (templateId: EmailTemplateId) => {
    setSelectedId(templateId);
    setPreviewId(templateId);
    saveSelectedEmailTemplateId(templateId);
    const meta = EMAIL_TEMPLATE_META.find((item) => item.id === templateId);
    toast.success(`${meta?.name ?? 'Template'} selected for sends`, { duration: 1600 });
  };

  return {
    templates: EMAIL_TEMPLATE_META,
    selectedId,
    previewId,
    setPreviewId,
    selectTemplate,
  };
}
