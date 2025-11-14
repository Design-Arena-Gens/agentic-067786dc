'use client';

import clsx from 'clsx';

interface QuickReplyButtonProps {
  label: string;
  onSelect: (label: string) => void;
}

export function QuickReplyButton({ label, onSelect }: QuickReplyButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      className={clsx(
        'rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/90 transition hover:bg-brand-accent hover:text-slate-900'
      )}
    >
      {label}
    </button>
  );
}
