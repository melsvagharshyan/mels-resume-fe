import { PROFILE } from '../shared';
import type { EmailTemplateParams } from '../types';

export function buildSignalTemplate({
  jobTitle,
  coverLetterHtml,
  cvUrl,
}: EmailTemplateParams) {
  return `<div style="margin:0;padding:48px 20px;background:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:auto;">
    <tr>
      <td style="background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E7E7E7;box-shadow:0 18px 40px rgba(0,0,0,0.06);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td width="10" style="background:#111111;"></td>
            <td style="padding:36px 34px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle">
                    <p style="margin:0;display:inline-block;padding:6px 10px;border-radius:999px;background:#111111;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">New application</p>
                    <p style="margin:16px 0 0;font-size:26px;font-weight:800;color:#111111;letter-spacing:-0.4px;">${PROFILE.name}</p>
                    <p style="margin:8px 0 0;font-size:15px;color:#525252;">${jobTitle} Engineer</p>
                  </td>
                  <td align="right" valign="middle" width="84">
                    <img src="${PROFILE.photoUrl}" width="72" height="72" alt="${PROFILE.name}" style="display:block;border-radius:18px;">
                  </td>
                </tr>
              </table>
              <div style="margin:28px 0 0;background:#FAFAFA;border:1px solid #EEEEEE;border-radius:16px;padding:24px;">
                <p style="margin:0;color:#171717;font-size:15px;line-height:1.8;">${coverLetterHtml}</p>
              </div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0;">
                <tr>
                  <td style="border-radius:12px;background:#111111;">
                    <a href="${cvUrl}" target="_blank" style="display:inline-block;padding:14px 26px;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;">View Resume</a>
                  </td>
                  <td width="12"></td>
                  <td style="border-radius:12px;border:1px solid #D4D4D4;">
                    <a href="${PROFILE.websiteUrl}" target="_blank" style="display:inline-block;padding:14px 22px;color:#171717;text-decoration:none;font-weight:600;font-size:14px;">Portfolio</a>
                  </td>
                </tr>
              </table>
              <p style="margin:30px 0 0;font-size:13px;color:#737373;">
                LinkedIn · Website · GitHub —
                <a href="${PROFILE.linkedinUrl}" style="color:#525252;text-decoration:none;">connect</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}
