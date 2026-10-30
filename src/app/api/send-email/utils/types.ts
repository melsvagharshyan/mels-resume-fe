export type SendEmailRequest = {
  toEmail: string;
  coverLetter: string;
  jobTitle: string;
  cvUrl: string;
};

export type SendEmailResponse = {
  ok: true;
  toEmail: string;
};
