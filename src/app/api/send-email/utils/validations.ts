import { z } from 'zod';

export const sendEmailSchema = z.object({
  toEmail: z.email('Invalid email address').min(1, 'Recipient email is required'),
  coverLetter: z.string().trim().min(1, 'Cover letter is required').max(20000),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(200),
  cvUrl: z.url('Invalid CV URL').min(1, 'CV URL is required'),
});

export type SendEmailSchemaValues = z.infer<typeof sendEmailSchema>;
