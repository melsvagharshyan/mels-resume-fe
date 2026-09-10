import type { HrCompany } from '../utils/types';

type HrEmailListProps = {
  companies: HrCompany[];
};

export default function HrEmailList({ companies }: HrEmailListProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {companies.map((item) => (
          <div
            key={`${item.id}-${item.email}`}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2.5"
          >
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">{item.company}</p>
            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{item.focus}</p>
            <p className="mt-1 truncate text-xs font-medium text-[var(--foreground)]">{item.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
