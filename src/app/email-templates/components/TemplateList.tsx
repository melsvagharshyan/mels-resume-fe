'use client';

import Button from '@/components/ui/Button';
import type { EmailTemplateId, EmailTemplateMeta } from '../utils/types';

type TemplateListProps = {
  templates: EmailTemplateMeta[];
  selectedId: EmailTemplateId;
  previewId: EmailTemplateId;
  onPreview: (id: EmailTemplateId) => void;
  onSelect: (id: EmailTemplateId) => void;
};

export default function TemplateList({
  templates,
  selectedId,
  previewId,
  onPreview,
  onSelect,
}: TemplateListProps) {
  return (
    <div className="flex max-h-56 w-full min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain pr-1 lg:max-h-none lg:h-full lg:w-[280px] lg:shrink-0">
      {templates.map((template) => {
        const isPreview = template.id === previewId;
        const isSelected = template.id === selectedId;

        return (
          <div
            key={template.id}
            className={`rounded-2xl border p-3 transition ${
              isPreview
                ? 'border-[var(--foreground)] bg-[var(--surface-strong)]'
                : 'border-[var(--border)] bg-[var(--surface-muted)]'
            }`}
          >
            <Button
              variant="ghost"
              onClick={() => onPreview(template.id)}
              className="h-auto w-full justify-start rounded-xl px-0 py-0 text-left hover:bg-transparent"
            >
              <span className="block w-full">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {template.name}
                  </span>
                  {isSelected ? (
                    <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--on-accent)]">
                      Active
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted)]">
                  {template.description}
                </span>
              </span>
            </Button>

            {!isSelected ? (
              <Button
                variant="secondary"
                onClick={() => onSelect(template.id)}
                className="mt-3 w-full rounded-xl py-2 text-xs"
              >
                Use for sends
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
