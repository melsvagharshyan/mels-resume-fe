'use client';

import TemplateList from './components/TemplateList';
import TemplatePreview from './components/TemplatePreview';
import { useEmailTemplatesPage } from './utils/hooks';

export default function EmailTemplatesPage() {
  const { templates, selectedId, previewId, setPreviewId, selectTemplate } =
    useEmailTemplatesPage();

  return (
    <section className="flex h-full min-h-0 flex-col p-3 pl-0">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-4">
        <div className="mb-3 border-b border-[var(--border)] pb-3">
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Email templates
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Preview 5 application styles and pick one for Quick Apply and Send all.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
          <TemplateList
            templates={templates}
            selectedId={selectedId}
            previewId={previewId}
            onPreview={setPreviewId}
            onSelect={selectTemplate}
          />
          <TemplatePreview templateId={previewId} />
        </div>
      </div>
    </section>
  );
}
