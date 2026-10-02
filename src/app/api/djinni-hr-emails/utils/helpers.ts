import type { HrContactDto } from '@/app/store/hr-emails/types';
import {
  CONCURRENCY,
  DJINNI_JOBS_URL,
  DJINNI_KEYWORDS,
  DJINNI_PAGES,
  EMAIL_REGEX,
  IGNORED_EMAIL_DOMAINS,
  IGNORED_EMAIL_PATTERNS,
  IGNORED_FILE_EXTENSIONS,
  IGNORED_WEBSITE_HOSTS,
  MAX_EMAILS_PER_COMPANY,
  PREFERRED_EMAIL_PREFIXES,
  REQUEST_TIMEOUT_MS,
  USER_AGENT,
  WEBSITE_PATHS,
} from './constants';
import type { DjinniCompany, DjinniJobPosting } from './types';

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      redirect: 'follow',
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) return null;
    return await response.text();
  } catch {
    return null;
  }
}

function isJobPosting(value: unknown): value is DjinniJobPosting {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { '@type'?: unknown })['@type'] === 'JobPosting'
  );
}

function parseJobPostings(html: string): DjinniJobPosting[] {
  const scripts = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  const postings: DjinniJobPosting[] = [];

  for (const [, content] of scripts) {
    try {
      const parsed: unknown = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      postings.push(...items.filter(isJobPosting));
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }

  return postings;
}

export async function fetchDjinniJobs(): Promise<DjinniJobPosting[]> {
  const urls = DJINNI_KEYWORDS.flatMap((keyword) =>
    Array.from({ length: DJINNI_PAGES }, (_, index) => {
      const params = new URLSearchParams({ primary_keyword: keyword, page: String(index + 1) });
      return `${DJINNI_JOBS_URL}?${params.toString()}`;
    }),
  );

  const pages = await mapWithConcurrency(urls, CONCURRENCY, fetchHtml);
  const byId = new Map<number, DjinniJobPosting>();

  for (const html of pages) {
    if (!html) continue;
    for (const posting of parseJobPostings(html)) byId.set(posting.identifier, posting);
  }

  return [...byId.values()];
}

function decodeCloudflareEmail(encoded: string): string {
  const key = parseInt(encoded.slice(0, 2), 16);
  let email = '';
  for (let i = 2; i < encoded.length; i += 2) {
    email += String.fromCharCode(parseInt(encoded.slice(i, i + 2), 16) ^ key);
  }
  return email;
}

function isValidEmail(email: string): boolean {
  const domain = email.split('@')[1] ?? '';
  if (IGNORED_FILE_EXTENSIONS.test(email)) return false;
  if (IGNORED_EMAIL_DOMAINS.some((ignored) => domain === ignored || domain.endsWith(`.${ignored}`)))
    return false;
  return !IGNORED_EMAIL_PATTERNS.some((pattern) => pattern.test(email));
}

export function extractEmails(text: string): string[] {
  const normalized = text.replace(/&#64;|&#x40;|%40|\[at\]|\(at\)/gi, '@');
  const cloudflareEmails = [...normalized.matchAll(/data-cfemail="([0-9a-f]+)"/gi)].map(
    ([, encoded]) => decodeCloudflareEmail(encoded),
  );
  const found = [...(normalized.match(EMAIL_REGEX) ?? []), ...cloudflareEmails];

  return [...new Set(found.map((email) => email.toLowerCase().replace(/^\.+|\.+$/g, '')))].filter(
    isValidEmail,
  );
}

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function normalizeWebsite(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const { origin, hostname } = new URL(url.startsWith('http') ? url : `https://${url}`);
    const host = hostname.replace(/^www\./, '');
    if (IGNORED_WEBSITE_HOSTS.some((ignored) => host === ignored || host.endsWith(`.${ignored}`)))
      return null;
    return origin;
  } catch {
    return null;
  }
}

export function groupJobsByCompany(jobs: DjinniJobPosting[]): DjinniCompany[] {
  const companies = new Map<string, DjinniCompany>();

  for (const job of jobs) {
    const name = job.hiringOrganization?.name?.trim();
    if (!name) continue;

    const key = name.toLowerCase();
    const existing = companies.get(key);
    const descriptionEmails = extractEmails(job.description ?? '');

    if (existing) {
      existing.jobTitles.push(job.title);
      existing.descriptionEmails = [...new Set([...existing.descriptionEmails, ...descriptionEmails])];
      existing.website ??= normalizeWebsite(job.hiringOrganization?.sameAs);
      continue;
    }

    companies.set(key, {
      name,
      website: normalizeWebsite(job.hiringOrganization?.sameAs),
      jobTitles: [job.title],
      jobUrl: job.url,
      descriptionEmails,
    });
  }

  return [...companies.values()];
}

function emailPriority(email: string): number {
  const prefix = email.split('@')[0];
  return PREFERRED_EMAIL_PREFIXES.some((preferred) => prefix.startsWith(preferred)) ? 0 : 1;
}

async function findWebsiteEmails(website: string): Promise<string[]> {
  const host = getHostname(website);
  if (!host) return [];

  const pages = await Promise.all(WEBSITE_PATHS.map((path) => fetchHtml(`${website}${path}`)));
  const emails = pages.flatMap((html) => (html ? extractEmails(html) : []));

  return [...new Set(emails)].filter((email) => {
    const domain = email.split('@')[1];
    return domain === host || domain.endsWith(`.${host}`) || host.endsWith(`.${domain}`);
  });
}

export async function resolveCompanyContacts(company: DjinniCompany): Promise<HrContactDto[]> {
  const websiteEmails =
    company.descriptionEmails.length > 0 || !company.website
      ? []
      : await findWebsiteEmails(company.website);

  const candidates = [
    ...company.descriptionEmails.map((email) => ({ email, source: 'job' as const })),
    ...websiteEmails.map((email) => ({ email, source: 'website' as const })),
  ]
    .sort((a, b) => emailPriority(a.email) - emailPriority(b.email))
    .slice(0, MAX_EMAILS_PER_COMPANY);

  const focus = [...new Set(company.jobTitles)].join(' · ');

  return candidates.map(({ email, source }) => ({
    id: `${company.name}-${email}`,
    company: company.name,
    focus,
    email,
    website: company.website,
    jobUrl: company.jobUrl,
    source,
  }));
}
