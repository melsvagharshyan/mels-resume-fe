export type EmailTemplateId =
  | 'midnight'
  | 'clean-light'
  | 'editorial'
  | 'slate-tech'
  | 'signal';

export type EmailTemplateParams = {
  jobTitle: string;
  coverLetterHtml: string;
  cvUrl: string;
};

export type EmailTemplateMeta = {
  id: EmailTemplateId;
  name: string;
  description: string;
};
