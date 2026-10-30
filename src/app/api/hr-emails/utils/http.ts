import { BROWSER_USER_AGENT } from './constants';

export async function fetchBrowserHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': BROWSER_USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9,uk-UA;q=0.8,en-US;q=0.7,en;q=0.6',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripTags(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' '));
}

export function parseJobPostingDescription(html: string): string {
  const scripts = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

  for (const [, content] of scripts) {
    try {
      const parsed: unknown = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (
          typeof item === 'object' &&
          item !== null &&
          (item as { '@type'?: unknown })['@type'] === 'JobPosting' &&
          typeof (item as { description?: unknown }).description === 'string'
        ) {
          return stripTags((item as { description: string }).description);
        }
      }
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return '';
}

export function parseJobPostingOrganization(html: string): {
  name: string | null;
  website: string | null;
} {
  const scripts = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

  for (const [, content] of scripts) {
    try {
      const parsed: unknown = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (
          typeof item !== 'object' ||
          item === null ||
          (item as { '@type'?: unknown })['@type'] !== 'JobPosting'
        ) {
          continue;
        }

        const org = (item as { hiringOrganization?: { name?: string; sameAs?: string } })
          .hiringOrganization;
        return {
          name: org?.name?.trim() || null,
          website: org?.sameAs?.trim() || null,
        };
      }
    } catch {
      // Ignore malformed JSON-LD.
    }
  }

  return { name: null, website: null };
}
