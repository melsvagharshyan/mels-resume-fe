export type DjinniJobPosting = {
  '@type': string;
  identifier: number;
  title: string;
  url: string;
  description?: string;
  hiringOrganization?: {
    name?: string;
    sameAs?: string;
  };
};

export type DjinniCompany = {
  name: string;
  website: string | null;
  jobTitles: string[];
  jobUrl: string;
  descriptionEmails: string[];
};
