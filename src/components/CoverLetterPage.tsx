'use client';

import { useState, useEffect } from 'react';
import {
  useGetCoverLetterQuery,
  useUpdateCoverLetterMutation,
} from '@/app/store/cover-letter/cover-letter.api';
import { FaRegCopy } from 'react-icons/fa';
import { ImSpinner } from 'react-icons/im';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { coverLetterTexts } from '@/app/job-apply/utils/constants';
import type { ApplyTab } from '@/app/job-apply/utils/types';

type CoverLetterPageProps = {
  type: ApplyTab;
  title: string;
};

export default function CoverLetterPage({ type, title }: CoverLetterPageProps) {
  const { data, isLoading, isError } = useGetCoverLetterQuery(type);
  const [updateCoverLetter, { isLoading: isUpdating }] = useUpdateCoverLetterMutation();

  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.text) {
      setText(data.text);
    } else if (!data) {
      setText(coverLetterTexts[type]);
    }
  }, [data, type]);

  const handleSave = async () => {
    try {
      await updateCoverLetter({ type, text }).unwrap();
      setIsEditing(false);
      toast.success('Cover letter saved!', { duration: 1000 });
    } catch (err) {
      console.error(err);
      toast.error('Error saving cover letter');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (isError) {
    return <p className="mt-16 text-center text-[var(--danger)]">Error loading cover letter</p>;
  }

  return (
    <section className="flex h-full min-h-0 flex-col p-3 pl-0">
      <div className="glass-panel flex min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-[28px] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Cover letter
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
              {title}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCopy} className="rounded-xl px-3 py-2">
              <FaRegCopy className="text-sm" />
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              loading={isUpdating}
              className="min-w-[90px] rounded-xl px-3 py-2"
            >
              {isEditing ? (
                isUpdating ? (
                  <ImSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  'Save'
                )
              ) : (
                'Edit'
              )}
            </Button>
          </div>
        </div>

        {isEditing ? (
          <textarea
            className="field-input min-h-0 flex-1 resize-none overflow-y-auto text-sm leading-6"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <p className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm leading-6 text-[var(--foreground)]">
            {text}
          </p>
        )}
      </div>
    </section>
  );
}
