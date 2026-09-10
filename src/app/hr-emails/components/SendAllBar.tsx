'use client';

import { ImSpinner } from 'react-icons/im';
import Button from '@/components/ui/Button';
import RoleTabs from '@/app/job-apply/components/RoleTabs';
import { tabTitles } from '@/app/job-apply/utils/constants';
import type { ApplyTab } from '@/app/job-apply/utils/types';

type SendAllBarProps = {
  selectedTab: ApplyTab;
  onSelectTab: (tab: ApplyTab) => void;
  isSending: boolean;
  progress: number;
  total: number;
  onSendAll: () => void;
};

export default function SendAllBar({
  selectedTab,
  onSelectTab,
  isSending,
  progress,
  total,
  onSendAll,
}: SendAllBarProps) {
  return (
    <div className="mb-3 space-y-3 border-b border-[var(--border)] pb-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">HR emails</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Send the current cover letter and CV to all {total} contacts.
          </p>
        </div>
        <p className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
          {tabTitles[selectedTab]}
        </p>
      </div>

      <RoleTabs selectedTab={selectedTab} onSelect={onSelectTab} />

      <Button
        onClick={onSendAll}
        loading={isSending}
        className="w-full rounded-2xl py-2.5 text-sm sm:w-auto sm:min-w-[220px]"
      >
        {isSending ? (
          <>
            <ImSpinner className="h-4 w-4 animate-spin" />
            Sending {progress}/{total}
          </>
        ) : (
          'Send all'
        )}
      </Button>
    </div>
  );
}
