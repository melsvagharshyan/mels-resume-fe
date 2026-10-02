export const DJINNI_JOBS_URL = 'https://djinni.co/jobs/';

export const DJINNI_KEYWORDS = ['React.js', 'Front-End'] as const;

export const DJINNI_PAGES = 10;

export const WEBSITE_PATHS = ['', '/careers', '/contact', '/contacts', '/jobs'] as const;

export const REQUEST_TIMEOUT_MS = 6000;

export const CONCURRENCY = 10;

export const MAX_EMAILS_PER_COMPANY = 2;

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

export const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;

export const IGNORED_EMAIL_DOMAINS = [
  'djinni.co',
  'example.com',
  'example.org',
  'domain.com',
  'email.com',
  'sentry.io',
  'wixpress.com',
  'sentry-next.wixpress.com',
];

export const IGNORED_EMAIL_PATTERNS = [/^no-?reply@/i, /^privacy@/i, /^gdpr@/i, /^abuse@/i, /^dpo@/i];

export const IGNORED_FILE_EXTENSIONS = /\.(png|jpe?g|gif|svg|webp|avif|css|js|ico|woff2?)$/i;

export const IGNORED_WEBSITE_HOSTS = [
  'djinni.co',
  'linkedin.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  't.me',
];

export const PREFERRED_EMAIL_PREFIXES = [
  'hr',
  'jobs',
  'job',
  'careers',
  'career',
  'hiring',
  'recruit',
  'recruiting',
  'recruitment',
  'talent',
  'cv',
  'apply',
  'people',
];
