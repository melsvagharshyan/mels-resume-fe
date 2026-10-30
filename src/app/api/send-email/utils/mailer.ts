import { createTransport } from 'nodemailer';
import { buildApplicationEmailHtml } from './template';
import type { SendEmailSchemaValues } from './validations';

const DEFAULT_FROM = 'Mels Vagharshyan <mels.vagharshyandev@gmail.com>';

function smtpConfig() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT || '587') || 587;
  const user = (process.env.SMTP_USER || 'mels.vagharshyandev@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const from = (process.env.SMTP_FROM || DEFAULT_FROM).trim();

  return { host, port, user, pass, from };
}

export function isSmtpConfigured() {
  const { host, user, pass, from } = smtpConfig();
  return Boolean(host && user && pass && from);
}

function createSmtpTransport() {
  const { host, port, user, pass } = smtpConfig();

  return createTransport({
    host,
    port,
    secure: false,
    requireTLS: true,
    auth: {
      user,
      pass,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatCoverLetterHtml(coverLetter: string) {
  return escapeHtml(coverLetter.trim()).replaceAll('\n', '<br>');
}

function buildApplicationBodies({ coverLetter, jobTitle, cvUrl }: SendEmailSchemaValues) {
  const trimmedJobTitle = jobTitle.trim();
  const trimmedCvUrl = cvUrl.trim();
  const trimmedCoverLetter = coverLetter.trim();

  const text = `${trimmedCoverLetter}

---
Role: ${trimmedJobTitle}
CV: ${trimmedCvUrl}
`;

  const html = buildApplicationEmailHtml({
    jobTitle: escapeHtml(trimmedJobTitle),
    coverLetterHtml: formatCoverLetterHtml(trimmedCoverLetter),
    cvUrl: escapeHtml(trimmedCvUrl),
  });

  return { text, html };
}

export async function sendApplicationEmail(values: SendEmailSchemaValues) {
  if (!isSmtpConfigured()) {
    throw new Error('Google SMTP is not configured. Set SMTP_USER and SMTP_PASS in .env.');
  }

  const { from } = smtpConfig();
  const transport = createSmtpTransport();
  const { text, html } = buildApplicationBodies(values);
  const toEmail = values.toEmail.trim().toLowerCase();

  await transport.sendMail({
    from,
    to: toEmail,
    subject: `Application — ${values.jobTitle.trim()}`,
    text,
    html,
  });

  return { toEmail };
}
