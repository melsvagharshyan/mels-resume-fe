import emailjs from '@emailjs/browser';

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
  await emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    {
      to_email: toEmail.trim(),
      cover_letter: coverLetter,
      job_title: jobTitle,
      cv_url: cvUrl,
    },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
  );
}
