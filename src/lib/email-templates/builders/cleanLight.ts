import { PROFILE } from '../shared';
import type { EmailTemplateParams } from '../types';

export function buildCleanLightTemplate({
  jobTitle,
  coverLetterHtml,
  cvUrl,
}: EmailTemplateParams) {
  return `<div style="margin:0;padding:48px 20px;background:#F3F4F6;font-family:Georgia,'Times New Roman',serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:auto;">
    <tr>
      <td style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:4px;padding:42px 40px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <img src="${PROFILE.photoUrl}" width="64" height="64" alt="${PROFILE.name}" style="display:block;border-radius:50%;border:1px solid #E5E7EB;">
            </td>
          </tr>
        </table>
        <p style="margin:22px 0 0;font-size:28px;font-weight:700;color:#111827;letter-spacing:-0.4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${PROFILE.name}</p>
        <p style="margin:8px 0 0;font-size:14px;color:#6B7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Applying for ${jobTitle}</p>
        <div style="height:1px;background:#E5E7EB;margin:28px 0;"></div>
        <p style="margin:0;color:#1F2937;font-size:16px;line-height:1.8;">${coverLetterHtml}</p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:32px 0 0;">
          <tr>
            <td style="border-radius:6px;background:#111827;">
              <a href="${cvUrl}" target="_blank" style="display:inline-block;padding:14px 28px;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">View Resume</a>
            </td>
          </tr>
        </table>
        <p style="margin:36px 0 0;font-size:13px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <a href="${PROFILE.linkedinUrl}" style="color:#6B7280;text-decoration:none;">LinkedIn</a>
          &nbsp;·&nbsp;
          <a href="${PROFILE.websiteUrl}" style="color:#6B7280;text-decoration:none;">Website</a>
          &nbsp;·&nbsp;
          <a href="${PROFILE.githubUrl}" style="color:#6B7280;text-decoration:none;">GitHub</a>
        </p>
      </td>
    </tr>
  </table>
</div>`;
}
