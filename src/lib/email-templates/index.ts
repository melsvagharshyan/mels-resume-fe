import { buildCleanLightTemplate } from './builders/cleanLight';
import { buildEditorialTemplate } from './builders/editorial';
import { buildMidnightTemplate } from './builders/midnight';
import { buildSignalTemplate } from './builders/signal';
import { buildSlateTechTemplate } from './builders/slateTech';
import type { EmailTemplateId, EmailTemplateMeta, EmailTemplateParams } from './types';

export type { EmailTemplateId, EmailTemplateMeta, EmailTemplateParams } from './types';
export {
  SAMPLE_COVER_LETTER_HTML,
  SAMPLE_CV_URL,
  SAMPLE_JOB_TITLE,
} from './shared';

export const EMAIL_TEMPLATE_META: EmailTemplateMeta[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark card with soft glow — the original application look.',
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'Bright, calm, resume-forward letter on white paper.',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Serif magazine layout with a strong top rule.',
  },
  {
    id: 'slate-tech',
    name: 'Slate Tech',
    description: 'Developer brief with cyan accent and code-like labels.',
  },
  {
    id: 'signal',
    name: 'Signal',
    description: 'Bold left stripe and dual CTAs for a sharp first impression.',
  },
];

export const DEFAULT_EMAIL_TEMPLATE_ID: EmailTemplateId = 'midnight';

const builders: Record<EmailTemplateId, (params: EmailTemplateParams) => string> = {
  midnight: buildMidnightTemplate,
  'clean-light': buildCleanLightTemplate,
  editorial: buildEditorialTemplate,
  'slate-tech': buildSlateTechTemplate,
  signal: buildSignalTemplate,
};

export function isEmailTemplateId(value: unknown): value is EmailTemplateId {
  return typeof value === 'string' && value in builders;
}

export function buildEmailTemplateHtml(
  templateId: EmailTemplateId | undefined,
  params: EmailTemplateParams,
) {
  const id = templateId && isEmailTemplateId(templateId) ? templateId : DEFAULT_EMAIL_TEMPLATE_ID;
  return builders[id](params);
}
