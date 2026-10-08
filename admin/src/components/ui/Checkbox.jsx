'use client';

import React, { useId } from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({
  label,
  id,
  checked = false,
  onChange,
  error = '',
  className = '',
  ...props
}) {
  const auto = useId();
  const fid = id || auto;
  const errId = `${fid}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={fid}
        className="group relative flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer select-none"
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={fid}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            aria-invalid={!!error}
            aria-describedby={error ? errId : undefined}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`flex h-4 w-4 items-center justify-center rounded-md border transition-all duration-200 ${
              checked
                ? 'border-ocean-600 bg-ocean-600 text-white shadow-xs'
                : 'border-slate-300 bg-white group-hover:border-ocean-500'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-ocean-500 peer-focus-visible:ring-offset-2`}
          >
            {checked && <Check size={12} strokeWidth={3.5} className="text-white" aria-hidden="true" />}
          </div>
        </div>
        <span className="leading-snug text-slate-700 group-hover:text-navy-900 transition-colors">{label}</span>
      </label>
      {error && (
        <p id={errId} role="alert" className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
