type SendApplicationParams = {
  toEmail: string;
  coverLetter: string;
  jobTitle: string;
  cvUrl: string;
};

export async function sendApplication({
  toEmail,
  coverLetter,
  jobTitle,
  cvUrl,
}: SendApplicationParams) {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toEmail: toEmail.trim(),
      coverLetter,
      jobTitle,
      cvUrl,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? 'Failed to send email');
  }
}
