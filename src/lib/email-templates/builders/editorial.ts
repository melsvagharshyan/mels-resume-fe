import { PROFILE } from '../shared';
import type { EmailTemplateParams } from '../types';

export function buildEditorialTemplate({
  jobTitle,
  coverLetterHtml,
  cvUrl,
}: EmailTemplateParams) {
  return `<div style="margin:0;padding:48px 20px;background:#FAFAF8;font-family:'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:auto;">
    <tr>
      <td style="background:#FFFFFF;border-top:4px solid #111111;padding:44px 40px 40px;">
        <p style="margin:0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#6B6B6B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Application</p>
        <p style="margin:14px 0 0;font-size:34px;line-height:1.15;font-weight:700;color:#111111;">${PROFILE.name}</p>
        <p style="margin:10px 0 0;font-size:15px;color:#444444;">${jobTitle} · Open to opportunities</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;">
          <tr>
            <td style="width:72px;vertical-align:top;">
              <img src="${PROFILE.photoUrl}" width="64" height="64" alt="${PROFILE.name}" style="display:block;border-radius:2px;">
            </td>
            <td style="vertical-align:middle;padding-left:16px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#555555;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">A short note introducing my experience and interest in joining your team.</p>
            </td>
          </tr>
        </table>
        <div style="border-top:1px solid #E8E6E1;border-bottom:1px solid #E8E6E1;padding:26px 0;">
          <p style="margin:0;color:#222222;font-size:17px;line-height:1.85;">${coverLetterHtml}</p>
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0 0;">
          <tr>
            <td>
              <a href="${cvUrl}" target="_blank" style="display:inline-block;padding:12px 0;color:#111111;text-decoration:underline;font-weight:700;font-size:15px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">View full resume →</a>
            </td>
          </tr>
        </table>
        <p style="margin:34px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8A8A8A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <a href="${PROFILE.linkedinUrl}" style="color:#8A8A8A;text-decoration:none;">LinkedIn</a>
          &nbsp;&nbsp;/&nbsp;&nbsp;
          <a href="${PROFILE.websiteUrl}" style="color:#8A8A8A;text-decoration:none;">Site</a>
          &nbsp;&nbsp;/&nbsp;&nbsp;
          <a href="${PROFILE.githubUrl}" style="color:#8A8A8A;text-decoration:none;">GitHub</a>
        </p>
      </td>
    </tr>
  </table>
</div>`;
}
