import { PROFILE } from '../shared';
import type { EmailTemplateParams } from '../types';

export function buildSlateTechTemplate({
  jobTitle,
  coverLetterHtml,
  cvUrl,
}: EmailTemplateParams) {
  return `<div style="margin:0;padding:48px 20px;background:#0B1220;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;-webkit-text-size-adjust:100%;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:auto;">
    <tr>
      <td style="background:#111827;border:1px solid #1F2A44;border-radius:18px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#0EA5E9 0%,#22D3EE 100%);height:4px;"></div>
        <div style="padding:34px 34px 38px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td valign="middle">
                <p style="margin:0;font-size:12px;color:#67E8F9;letter-spacing:0.16em;text-transform:uppercase;">Candidate brief</p>
                <p style="margin:10px 0 0;font-size:24px;font-weight:700;color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${PROFILE.name}</p>
                <p style="margin:8px 0 0;font-size:13px;color:#94A3B8;">role := "${jobTitle}"</p>
              </td>
              <td align="right" valign="middle" width="84">
                <img src="${PROFILE.photoUrl}" width="68" height="68" alt="${PROFILE.name}" style="display:block;border-radius:14px;border:1px solid #334155;">
              </td>
            </tr>
          </table>
          <div style="margin:28px 0 0;background:#0B1220;border:1px solid #1E293B;border-radius:14px;padding:22px;">
            <p style="margin:0 0 10px;font-size:11px;color:#38BDF8;letter-spacing:0.14em;text-transform:uppercase;">cover_letter.md</p>
            <p style="margin:0;color:#E2E8F0;font-size:15px;line-height:1.75;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${coverLetterHtml}</p>
          </div>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0;">
            <tr>
              <td style="border-radius:10px;background:#0EA5E9;">
                <a href="${cvUrl}" target="_blank" style="display:inline-block;padding:13px 24px;color:#082F49;text-decoration:none;font-weight:700;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Open resume()</a>
              </td>
            </tr>
          </table>
          <p style="margin:28px 0 0;font-size:12px;color:#64748B;">
            <a href="${PROFILE.linkedinUrl}" style="color:#94A3B8;text-decoration:none;">linkedin</a>
            &nbsp;|&nbsp;
            <a href="${PROFILE.websiteUrl}" style="color:#94A3B8;text-decoration:none;">web</a>
            &nbsp;|&nbsp;
            <a href="${PROFILE.githubUrl}" style="color:#94A3B8;text-decoration:none;">github</a>
          </p>
        </div>
      </td>
    </tr>
  </table>
</div>`;
}
