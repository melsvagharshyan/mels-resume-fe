import type { HrContactDto } from '@/app/store/hr-emails/types';
import type { DjinniCompany } from '@/app/api/djinni-hr-emails/utils/types';
import { CONCURRENCY } from '@/app/api/djinni-hr-emails/utils/constants';
import {
  extractEmails,
  mapWithConcurrency,
  normalizeWebsite,
  resolveCompanyContacts,
} from '@/app/api/djinni-hr-emails/utils/helpers';
import { HH_ITEMS_PER_PAGE, HH_PAGES, HH_SEARCH_URL, HH_VACANCY_QUERY } from './constants';
import { finalizeContacts, isBlockedCompany } from './filters';
import { fetchBrowserHtml, parseJobPostingDescription, stripTags } from './http';
import type { HhSearchVacancy } from './types';

type HhCompany = DjinniCompany & {
  employerId: string | null;
};

function parseSearchVacancies(html: string): HhSearchVacancy[] {
  const blocks = html.split('data-qa="vacancy-serp__vacancy"').slice(1);
  const vacancies: HhSearchVacancy[] = [];

  for (const block of blocks) {
    const urlMatch = block.match(/href="(https:\/\/hh\.ru\/vacancy\/(\d+)[^"]*)"/);
    const titleMatch = block.match(/data-qa="serp-item__title"[^>]*>([\s\S]*?)<\/a>/);
    const employerMatch = block.match(
      /data-qa="vacancy-serp__vacancy-employer"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/,
    );

    if (!urlMatch || !titleMatch) continue;

    const id = urlMatch[2];
    const title = stripTags(titleMatch[1]);
    const company = employerMatch ? stripTags(employerMatch[2]) : '';
    const employerHref = employerMatch?.[1] ?? '';
    const employerIdMatch = employerHref.match(/\/employer\/(\d+)/);

    if (!title) continue;

    vacancies.push({
      id,
      title,
      url: `https://hh.ru/vacancy/${id}`,
      company: company || title,
      employerId: employerIdMatch?.[1] ?? null,
    });
  }

  return vacancies;
}

async function fetchHhSearchVacancies(): Promise<HhSearchVacancy[]> {
  const urls = Array.from({ length: HH_PAGES }, (_, page) => {
    const params = new URLSearchParams({
      text: HH_VACANCY_QUERY,
      items_on_page: String(HH_ITEMS_PER_PAGE),
      page: String(page),
    });
    return `${HH_SEARCH_URL}?${params.toString()}`;
  });

  const pages = await mapWithConcurrency(urls, CONCURRENCY, fetchBrowserHtml);
  const byId = new Map<string, HhSearchVacancy>();

  for (const html of pages) {
    if (!html) continue;
    for (const vacancy of parseSearchVacancies(html)) {
      byId.set(vacancy.id, vacancy);
    }
  }

  return [...byId.values()];
}

function parseEmployerSite(html: string): string | null {
  const match = html.match(/data-qa="sidebar-company-site"[^>]*href="([^"]+)"/);
  return normalizeWebsite(match?.[1]);
}

async function buildHhCompanies(vacancies: HhSearchVacancy[]): Promise<DjinniCompany[]> {
  const details = await mapWithConcurrency(vacancies, CONCURRENCY, async (vacancy) => {
    const html = await fetchBrowserHtml(vacancy.url);
    const descriptionEmails = html ? extractEmails(parseJobPostingDescription(html)) : [];
    return { vacancy, descriptionEmails };
  });

  const companies = new Map<string, HhCompany>();

  for (const { vacancy, descriptionEmails } of details) {
    const name = vacancy.company.trim();
    if (!name || isBlockedCompany(name)) continue;

    const key = (vacancy.employerId || name).toLowerCase();
    const existing = companies.get(key);

    if (existing) {
      existing.jobTitles.push(vacancy.title);
      existing.descriptionEmails = [
        ...new Set([...existing.descriptionEmails, ...descriptionEmails]),
      ];
      continue;
    }

    companies.set(key, {
      name,
      employerId: vacancy.employerId,
      website: null,
      jobTitles: [vacancy.title],
      jobUrl: vacancy.url,
      descriptionEmails,
    });
  }

  const companyList = [...companies.values()];

  await mapWithConcurrency(companyList, CONCURRENCY, async (company) => {
    if (company.descriptionEmails.length > 0 || !company.employerId) return null;
    const html = await fetchBrowserHtml(`https://hh.ru/employer/${company.employerId}`);
    if (!html) return null;
    company.website = parseEmployerSite(html);
    return null;
  });

  return companyList.map(({ name, website, jobTitles, jobUrl, descriptionEmails }) => ({
    name,
    website,
    jobTitles,
    jobUrl,
    descriptionEmails,
  }));
}

export async function fetchHhHrContacts(): Promise<HrContactDto[]> {
  const vacancies = await fetchHhSearchVacancies();
  const companies = await buildHhCompanies(vacancies);
  const contacts = await mapWithConcurrency(companies, CONCURRENCY, resolveCompanyContacts);
  return finalizeContacts(contacts.flat());
}
