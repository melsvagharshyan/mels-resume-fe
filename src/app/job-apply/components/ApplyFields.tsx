'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import type { ApplyJobSchema } from '../utils/validation';

type FieldProps = {
  control: Control<ApplyJobSchema>;
  errors: FieldErrors<ApplyJobSchema>;
};

export function EmailField({ control, errors }: FieldProps) {
  return (
    <Controller
      name="companyEmail"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <label htmlFor="companyEmail" className="text-sm font-medium text-[var(--muted)]">
            Company email
          </label>
          <input
            id="companyEmail"
            type="email"
            placeholder="hiring@company.com"
            autoComplete="email"
            className="field-input text-sm"
            {...field}
          />
          {errors.companyEmail && (
            <p className="text-sm text-[var(--danger)]">{errors.companyEmail.message}</p>
          )}
        </div>
      )}
    />
  );
}

export function CoverLetterField({ control, errors }: FieldProps) {
  return (
    <Controller
      name="coverLetterText"
      control={control}
      render={({ field }) => (
        <div className="flex min-h-0 flex-1 flex-col space-y-2">
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="coverLetterText" className="text-sm font-medium text-[var(--muted)]">
              Cover letter
            </label>
            <span className="text-xs text-[var(--muted)]">Editable</span>
          </div>
          <textarea
            id="coverLetterText"
            placeholder="Your cover letter will appear here..."
            className="field-input min-h-0 flex-1 resize-none overflow-y-auto text-sm leading-6"
            {...field}
          />
          {errors.coverLetterText && (
            <p className="text-sm text-[var(--danger)]">{errors.coverLetterText.message}</p>
          )}
        </div>
      )}
    />
  );
}
