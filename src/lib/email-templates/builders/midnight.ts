import { PROFILE } from '../shared';
import type { EmailTemplateParams } from '../types';

export function buildMidnightTemplate({
  jobTitle,
  coverLetterHtml,
  cvUrl,
}: EmailTemplateParams) {
  return `<div style="margin:0;padding:48px 20px;background:#0F1115;background-image:radial-gradient(circle at top left, rgba(214,228,255,0.08), transparent 45%),radial-gradient(circle at bottom right, rgba(214,228,255,0.05), transparent 40%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;margin:auto;">
    <tr>
      <td style="background:rgba(26,29,35,0.96);border:1px solid rgba(255,255,255,0.12);border-radius:28px;padding:38px;box-shadow:0 30px 80px rgba(0,0,0,0.50),inset 0 1px 0 rgba(255,255,255,0.06);">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="middle">
              <p style="margin:0;font-size:26px;font-weight:700;color:#F8FAFC;letter-spacing:-0.5px;">${PROFILE.name}</p>
              <p style="margin:6px 0 0;font-size:14px;color:#AEB6C2;font-weight:500;">${jobTitle} Engineer</p>
            </td>
            <td align="right" valign="middle" width="90">
              <img src="${PROFILE.photoUrl}" width="74" height="74" alt="${PROFILE.name}" style="display:block;border-radius:50%;border:2px solid #D6E4FF;">
            </td>
          </tr>
        </table>
        <div style="height:1px;background:linear-gradient(90deg, transparent, rgba(214,228,255,0.30), transparent);margin:28px 0;"></div>
        <div style="background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:26px;">
          <p style="margin:0;color:#EEF2F7;font-size:16px;line-height:1.85;">${coverLetterHtml}</p>
        </div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:34px auto 0;">
          <tr>
            <td style="border-radius:14px;background:#FFFFFF;">
              <a href="${cvUrl}" target="_blank" style="display:inline-block;padding:15px 34px;color:#111827;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">View Resume</a>
            </td>
          </tr>
        </table>
        <div style="margin-top:36px;">
          <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding:0 8px;">
                <a href="${PROFILE.linkedinUrl}" target="_blank" style="display:inline-block;border:1px solid rgba(255,255,255,0.14);border-radius:14px;background:rgba(255,255,255,0.03);padding:12px;">
                  <img src="${PROFILE.linkedinIcon}" width="22" height="22" alt="LinkedIn" style="display:block;" />
                </a>
              </td>
              <td style="padding:0 8px;">
                <a href="${PROFILE.websiteUrl}" target="_blank" style="display:inline-block;border:1px solid rgba(255,255,255,0.14);border-radius:14px;background:rgba(255,255,255,0.03);padding:12px;">
                  <img src="${PROFILE.websiteIcon}" width="22" height="22" alt="Website" style="display:block;" />
                </a>
              </td>
              <td style="padding:0 8px;">
                <a href="${PROFILE.githubUrl}" target="_blank" style="display:inline-block;border:1px solid rgba(255,255,255,0.14);border-radius:14px;background:rgba(255,255,255,0.03);padding:12px;">
                  <img src="${PROFILE.githubIcon}" width="22" height="22" alt="GitHub" style="display:block;" />
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:26px 0 0;text-align:center;font-size:13px;color:#8B95A3;letter-spacing:0.2px;">Thank you for your time and consideration.</p>
        </div>
      </td>
    </tr>
  </table>
</div>`;
}
