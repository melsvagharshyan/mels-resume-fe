'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { ImSpinner } from 'react-icons/im';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import { CoverLetterField, EmailField } from './components/ApplyFields';
import RoleTabs from './components/RoleTabs';
import { ApplyJobSchema, applyJobSchema } from './utils/validation';
import { coverLetterTexts, cvUrls, tabTitles } from './utils/constants';
import { sendApplication } from './utils/helpers';
import type { ApplyTab } from './utils/types';

export default function ApplyJob() {
  const [selectedTab, setSelectedTab] = useState<ApplyTab>('frontend');

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobSchema>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      companyEmail: '',
      coverLetterText: coverLetterTexts.frontend,
    },
  });

  const companyEmail = useWatch({ control, name: 'companyEmail' });

  useEffect(() => {
    setValue('coverLetterText', coverLetterTexts[selectedTab]);
  }, [selectedTab, setValue]);

  const onSubmit = async (values: ApplyJobSchema) => {
    try {
      await sendApplication({
        toEmail: values.companyEmail,
        coverLetter: values.coverLetterText,
        jobTitle: tabTitles[selectedTab],
        cvUrl: cvUrls[selectedTab],
      });

      toast.success('Application sent successfully!', { duration: 1000 });

      reset({
        companyEmail: '',
        coverLetterText: coverLetterTexts[selectedTab],
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send application');
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col p-3 pl-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass-panel flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Quick apply</h1>
          <p className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)]">
            {tabTitles[selectedTab]}
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col gap-3">
            <RoleTabs selectedTab={selectedTab} onSelect={setSelectedTab} />
            <EmailField control={control} errors={errors} />
            <div className="mt-auto space-y-2">
              <p className="truncate text-xs text-[var(--muted)]">
                To: {companyEmail?.trim() || 'company email'}
              </p>
              <Button type="submit" loading={isSubmitting} className="w-full rounded-2xl py-2.5 text-sm">
                {isSubmitting ? <ImSpinner className="h-5 w-5 animate-spin" /> : 'Send application'}
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <CoverLetterField control={control} errors={errors} />
          </div>
        </div>
      </form>
    </section>
  );
}
