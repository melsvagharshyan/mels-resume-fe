import type { HrContactDto } from '@/app/store/hr-emails/types';
import type { DjinniCompany } from '@/app/api/djinni-hr-emails/utils/types';
import { CONCURRENCY } from '@/app/api/djinni-hr-emails/utils/constants';
import {
  extractEmails,
  mapWithConcurrency,
  normalizeWebsite,
  resolveCompanyContacts,
} from '@/app/api/djinni-hr-emails/utils/helpers';
import { DOU_PAGES, DOU_QUERY, DOU_SEARCH_URL } from './constants';
import { finalizeContacts, isBlockedCompany } from './filters';
import { fetchBrowserHtml, stripTags } from './http';

type DouSearchVacancy = {
  id: string;
  title: string;
  url: string;
  company: string;
  companyUrl: string | null;
};

function parseSearchVacancies(html: string): DouSearchVacancy[] {
  const blocks = html.split('l-vacancy').slice(1);
  const vacancies: DouSearchVacancy[] = [];

  for (const block of blocks) {
    const urlMatch = block.match(
      /href="(https:\/\/jobs\.dou\.ua\/companies\/([^"/]+)\/vacancies\/(\d+)\/?)"/,
    );
    const titleMatch = block.match(/class="vt"[^>]*>([\s\S]*?)<\/a>/);
    const companyMatch = block.match(/class="company"[^>]*>([\s\S]*?)<\/a>/);

    if (!urlMatch) continue;

    const companySlug = urlMatch[2];
    const id = urlMatch[3];
    const title = titleMatch ? stripTags(titleMatch[1]) : id;
    const company = companyMatch ? stripTags(companyMatch[1]) : companySlug;

    vacancies.push({
      id,
      title,
      url: urlMatch[1],
      company,
      companyUrl: `https://jobs.dou.ua/companies/${companySlug}/`,
    });
  }

  return vacancies;
}

async function fetchDouSearchVacancies(): Promise<DouSearchVacancy[]> {
  const urls = Array.from({ length: DOU_PAGES }, (_, page) => {
    const params = new URLSearchParams({ search: DOU_QUERY });
    if (page > 0) params.set('page', String(page + 1));
    return `${DOU_SEARCH_URL}?${params.toString()}`;
  });

  const pages = await mapWithConcurrency(urls, CONCURRENCY, fetchBrowserHtml);
  const byId = new Map<string, DouSearchVacancy>();

  for (const html of pages) {
    if (!html) continue;
    for (const vacancy of parseSearchVacancies(html)) {
      byId.set(vacancy.id, vacancy);
    }
  }

  return [...byId.values()];
}

function parseDouCompanySite(html: string): string | null {
  const match = html.match(/<div class="site">[\s\S]*?href="([^"]+)"/);
  return normalizeWebsite(match?.[1]);
}

async function buildDouCompanies(vacancies: DouSearchVacancy[]): Promise<DjinniCompany[]> {
  const details = await mapWithConcurrency(vacancies, CONCURRENCY, async (vacancy) => {
    const html = await fetchBrowserHtml(vacancy.url);
    const descriptionEmails = html ? extractEmails(stripTags(html)) : [];
    return { vacancy, descriptionEmails };
  });

  const companies = new Map<string, DjinniCompany & { companyUrl: string | null }>();

  for (const { vacancy, descriptionEmails } of details) {
    const name = vacancy.company.trim();
    if (!name || isBlockedCompany(name)) continue;

    const key = name.toLowerCase();
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
      website: null,
      jobTitles: [vacancy.title],
      jobUrl: vacancy.url,
      descriptionEmails,
      companyUrl: vacancy.companyUrl,
    });
  }

  const companyList = [...companies.values()];

  await mapWithConcurrency(companyList, CONCURRENCY, async (company) => {
    if (company.descriptionEmails.length > 0 || !company.companyUrl) return null;
    const html = await fetchBrowserHtml(company.companyUrl);
    if (!html) return null;
    company.website = parseDouCompanySite(html);
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

export async function fetchDouHrContacts(): Promise<HrContactDto[]> {
  const vacancies = await fetchDouSearchVacancies();
  const companies = await buildDouCompanies(vacancies);
  const contacts = await mapWithConcurrency(companies, CONCURRENCY, resolveCompanyContacts);
  return finalizeContacts(contacts.flat());
}
