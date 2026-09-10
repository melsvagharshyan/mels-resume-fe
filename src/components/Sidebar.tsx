'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSend, FiUser } from 'react-icons/fi';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { navItems } from './utils/constants';

const icons = {
  Apply: FiSend,
  Info: FiUser,
} as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel m-3 flex w-52 shrink-0 flex-col rounded-[28px] p-3.5">
      <Link href="/job-apply" className="mb-6 flex items-center gap-2.5 px-1">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-semibold text-[var(--on-accent)]">
          M
        </span>
        <span className="min-w-0">
          <span className="block text-xl font-bold leading-none tracking-tight text-[var(--foreground)]">
            Mels
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Easy apply
          </span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = icons[item.name];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[var(--accent)] text-[var(--on-accent)]'
                  : 'bg-[var(--surface-muted)] text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <ThemeToggle />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
            <span className="text-xs font-medium text-[var(--foreground)]">Available now</span>
          </div>
          <p className="text-[11px] leading-4 text-[var(--muted)]">Ready for opportunities</p>
        </div>
      </div>
    </aside>
  );
}
