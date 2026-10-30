import type { HrContactDto } from '@/app/store/hr-emails/types';
import type { DjinniCompany } from '@/app/api/djinni-hr-emails/utils/types';
import { CONCURRENCY } from '@/app/api/djinni-hr-emails/utils/constants';
import {
  extractEmails,
  mapWithConcurrency,
  normalizeWebsite,
  resolveCompanyContacts,
} from '@/app/api/djinni-hr-emails/utils/helpers';
import { HABR_PAGES, HABR_QUERY, HABR_SEARCH_URL } from './constants';
import { finalizeContacts, isBlockedCompany } from './filters';
import {
  fetchBrowserHtml,
  parseJobPostingDescription,
  parseJobPostingOrganization,
  stripTags,
} from './http';

type HabrSearchVacancy = {
  id: string;
  title: string;
  url: string;
  company: string;
};

function parseSearchVacancies(html: string): HabrSearchVacancy[] {
  const cards = html.split('class="vacancy-card"').slice(1);
  const vacancies: HabrSearchVacancy[] = [];

  for (const card of cards) {
    const urlMatch = card.match(/href="(\/vacancies\/(\d+))"/);
    const titleMatch = card.match(/class="vacancy-card__title-link"[^>]*>([\s\S]*?)<\/a>/);
    const companyMatch = card.match(/href="\/companies\/[^"]+"[^>]*>([\s\S]*?)<\/a>/);

    if (!urlMatch) continue;

    const id = urlMatch[2];
    const title = titleMatch ? stripTags(titleMatch[1]) : '';
    const company = companyMatch ? stripTags(companyMatch[1]) : '';

    vacancies.push({
      id,
      title: title || id,
      url: `https://career.habr.com/vacancies/${id}`,
      company: company || title || id,
    });
  }

  return vacancies;
}

async function fetchHabrSearchVacancies(): Promise<HabrSearchVacancy[]> {
  const urls = Array.from({ length: HABR_PAGES }, (_, page) => {
    const params = new URLSearchParams({
      q: HABR_QUERY,
      type: 'all',
      page: String(page + 1),
    });
    return `${HABR_SEARCH_URL}?${params.toString()}`;
  });

  const pages = await mapWithConcurrency(urls, CONCURRENCY, fetchBrowserHtml);
  const byId = new Map<string, HabrSearchVacancy>();

  for (const html of pages) {
    if (!html) continue;
    for (const vacancy of parseSearchVacancies(html)) {
      byId.set(vacancy.id, vacancy);
    }
  }

  return [...byId.values()];
}

async function buildHabrCompanies(vacancies: HabrSearchVacancy[]): Promise<DjinniCompany[]> {
  const details = await mapWithConcurrency(vacancies, CONCURRENCY, async (vacancy) => {
    const html = await fetchBrowserHtml(vacancy.url);
    if (!html) {
      return {
        vacancy,
        descriptionEmails: [] as string[],
        website: null as string | null,
        orgName: null as string | null,
      };
    }

    const org = parseJobPostingOrganization(html);
    return {
      vacancy,
      descriptionEmails: extractEmails(parseJobPostingDescription(html)),
      website: normalizeWebsite(org.website ?? undefined),
      orgName: org.name,
    };
  });

  const companies = new Map<string, DjinniCompany>();

  for (const { vacancy, descriptionEmails, website, orgName } of details) {
    const name = (orgName || vacancy.company).trim();
    if (!name || isBlockedCompany(name)) continue;

    const key = name.toLowerCase();
    const existing = companies.get(key);

    if (existing) {
      existing.jobTitles.push(vacancy.title);
      existing.descriptionEmails = [
        ...new Set([...existing.descriptionEmails, ...descriptionEmails]),
      ];
      existing.website ??= website;
      continue;
    }

    companies.set(key, {
      name,
      website,
      jobTitles: [vacancy.title],
      jobUrl: vacancy.url,
      descriptionEmails,
    });
  }

  return [...companies.values()];
}

export async function fetchHabrHrContacts(): Promise<HrContactDto[]> {
  const vacancies = await fetchHabrSearchVacancies();
  const companies = await buildHabrCompanies(vacancies);
  const contacts = await mapWithConcurrency(companies, CONCURRENCY, resolveCompanyContacts);
  return finalizeContacts(contacts.flat());
}
