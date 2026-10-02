export type HrContactSource = 'job' | 'website';

export type HrContactDto = {
  id: string;
  company: string;
  focus: string;
  email: string;
  website: string | null;
  jobUrl: string;
  source: HrContactSource;
};

export type HrContactsResponse = {
  data: HrContactDto[];
};
