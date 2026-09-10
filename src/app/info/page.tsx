'use client';

import {
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaCopy,
  FaEnvelope,
  FaPhone,
  FaTelegram,
} from 'react-icons/fa';
import { JSX, useState } from 'react';
import Button from '@/components/ui/Button';

interface SocialLink {
  id: string;
  icon: JSX.Element;
  label: string;
  url: string;
  isCopyOnly?: boolean;
}

const socialLinks: SocialLink[] = [
  {
    id: 'linkedin',
    icon: <FaLinkedin className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mels-vagharshyan',
  },
  {
    id: 'website',
    icon: <FaGlobe className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'Website',
    url: 'https://www.melsvagharshyan.com',
  },
  {
    id: 'github',
    icon: <FaGithub className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'GitHub',
    url: 'https://github.com/melsvagharshyan',
  },
  {
    id: 'email',
    icon: <FaEnvelope className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'Email',
    url: 'mels.vagharshyandev@gmail.com',
  },
  {
    id: 'telegram',
    icon: <FaTelegram className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'Telegram',
    url: '@mels_develop',
    isCopyOnly: true,
  },
  {
    id: 'phone',
    icon: <FaPhone className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'Phone',
    url: '+37494541615',
  },
  {
    id: 'availability',
    icon: <FaCopy className="h-4 w-4 shrink-0 text-[var(--foreground)]" />,
    label: 'Availability',
    url: 'Available Immediately',
    isCopyOnly: true,
  },
];

export default function InfoPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col p-3 pl-0">
      <div className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-4">
        <h1 className="mb-3 text-xl font-bold tracking-tight text-[var(--foreground)]">My Info</h1>

        <div className="grid min-h-0 flex-1 content-start gap-2 overflow-hidden sm:grid-cols-2">
          {socialLinks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    {item.label}
                  </p>
                  {item.isCopyOnly ? (
                    <span className="block truncate text-sm font-medium text-[var(--foreground)]">
                      {item.url}
                    </span>
                  ) : (
                    <a
                      href={
                        item.id === 'email'
                          ? `mailto:${item.url}`
                          : item.id === 'phone'
                            ? `tel:${item.url}`
                            : item.url
                      }
                      target={item.id !== 'email' && item.id !== 'phone' ? '_blank' : undefined}
                      rel={
                        item.id !== 'email' && item.id !== 'phone'
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="block truncate text-sm font-medium text-[var(--foreground)] transition hover:opacity-70"
                    >
                      {item.url}
                    </a>
                  )}
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => handleCopy(item.url, item.id)}
                className="h-8 shrink-0 rounded-lg px-2.5 py-0 text-xs"
              >
                <FaCopy className="h-3 w-3" />
                {copied === item.id ? 'Copied' : 'Copy'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
