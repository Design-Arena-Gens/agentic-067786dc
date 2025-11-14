'use client';

import { useState } from 'react';
import type { AgentContext, EstimateDetails } from '@/lib/agent';

interface EstimateFormProps {
  locale: AgentContext['locale'];
  onSubmit: (details: EstimateDetails) => void;
  onCancel?: () => void;
}

export function EstimateForm({ locale, onSubmit, onCancel }: EstimateFormProps) {
  const [form, setForm] = useState<Omit<EstimateDetails, 'photoUrls'>>({});
  const [photoField, setPhotoField] = useState('');

  const labels = {
    carModel: locale === 'af' ? 'Voertuig make & model' : 'Vehicle make & model',
    year: locale === 'af' ? 'Jaar' : 'Year',
    damageType: locale === 'af' ? 'Tipe skade' : 'Damage type',
    damageDescription: locale === 'af' ? 'Beskryf die skade' : 'Describe the damage',
    photoUrls: locale === 'af' ? 'Foto skakels (opsioneel)' : 'Photo links (optional)',
    submit: locale === 'af' ? 'Stuur besonderhede' : 'Send details',
    cancel: locale === 'af' ? 'Kanselleer' : 'Cancel'
  } as const;

  function handleChange(field: keyof Omit<EstimateDetails, 'photoUrls'>, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: EstimateDetails = {
      ...form,
      photoUrls: photoField
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter(Boolean)
    };
    onSubmit(payload);
    setForm({});
    setPhotoField('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex w-full flex-col gap-3 rounded-2xl bg-slate-800/60 p-4 text-left text-xs text-slate-100"
    >
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.carModel}</span>
        <input
          required
          value={form.carModel ?? ''}
          onChange={(event) => handleChange('carModel', event.target.value)}
          placeholder={locale === 'af' ? 'Toyota Hilux, VW Polo, ens.' : 'e.g. Toyota Hilux, VW Polo'}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.year}</span>
        <input
          required
          value={form.year ?? ''}
          onChange={(event) => handleChange('year', event.target.value)}
          placeholder="2020"
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.damageType}</span>
        <input
          required
          value={form.damageType ?? ''}
          onChange={(event) => handleChange('damageType', event.target.value)}
          placeholder={locale === 'af' ? 'Voorpaneel duik' : 'Front panel dent'}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.damageDescription}</span>
        <textarea
          required
          value={form.damageDescription ?? ''}
          onChange={(event) => handleChange('damageDescription', event.target.value)}
          placeholder={
            locale === 'af'
              ? 'Kort beskrywing van wat gebeur het en watter panele geraak is.'
              : 'Describe what happened and which panels were affected.'
          }
          rows={3}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-wide text-white/60">{labels.photoUrls}</span>
        <textarea
          value={photoField}
          onChange={(event) => setPhotoField(event.target.value)}
          placeholder={
            locale === 'af'
              ? 'https://joufoto1.jpg\nhttps://joufoto2.jpg'
              : 'https://yourphoto1.jpg\nhttps://yourphoto2.jpg'
          }
          rows={2}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-brand-accent"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="submit"
          className="flex-1 rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 transition hover:shadow-glow"
        >
          {labels.submit}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/40"
          >
            {labels.cancel}
          </button>
        ) : null}
      </div>
    </form>
  );
}
