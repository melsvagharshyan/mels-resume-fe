import { NextResponse } from 'next/server';
import { isSmtpConfigured, sendApplicationEmail } from './utils/mailer';
import type { SendEmailResponse } from './utils/types';
import { sendEmailSchema } from './utils/validations';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!isSmtpConfigured()) {
      return NextResponse.json(
        { message: 'Google SMTP is not configured. Set SMTP_USER and SMTP_PASS in .env.' },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const parsed = sendEmailSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Invalid request';
      return NextResponse.json({ message }, { status: 400 });
    }

    const result = await sendApplicationEmail(parsed.data);
    const response: SendEmailResponse = { ok: true, toEmail: result.toEmail };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to send email via Google SMTP', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
