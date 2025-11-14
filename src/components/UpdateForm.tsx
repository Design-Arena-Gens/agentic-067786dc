'use client';

import { useState } from 'react';
import type { AgentContext } from '@/lib/agent';

interface UpdateFormProps {
  locale: AgentContext['locale'];
  onSubmit: (jobCard: string, registration: string) => void;
}

export function UpdateForm({ locale, onSubmit }: UpdateFormProps) {
  const [jobCard, setJobCard] = useState('');
  const [registration, setRegistration] = useState('');

  const labels = {
    jobCard: locale === 'af' ? 'Werkkaart nommer' : 'Job card number',
    registration: locale === 'af' ? 'Registrasie nommer' : 'Registration number',
    optional: locale === 'af' ? 'Opsioneel' : 'Optional',
    submit: locale === 'af' ? 'Kontroleer status' : 'Check status'
  } as const;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(jobCard, registration);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex w-full flex-col gap-3 rounded-2xl bg-slate-800/60 p-4 text-left text-xs text-slate-100"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.jobCard}</span>
        <input
          value={jobCard}
          onChange={(event) => setJobCard(event.target.value)}
          placeholder="12345"
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">
          {labels.registration} <span className="text-white/40">({labels.optional})</span>
        </span>
        <input
          value={registration}
          onChange={(event) => setRegistration(event.target.value)}
          placeholder={locale === 'af' ? 'CY 123-456' : 'CA 123-456'}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-brand-accent"
      >
        {labels.submit}
      </button>
    </form>
  );
}
