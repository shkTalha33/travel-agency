'use client';

import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  id,
  options = [],
  value,
  onChange,
  error = '',
  required = false,
  className = '',
  placeholder,
  ...props
}) {
  const auto = useId();
  const fid = id || auto;
  const errId = `${fid}-error`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={fid} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={fid}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-xs font-semibold text-slate-900 transition-colors outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer ${
            error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-slate-200 hover:border-ocean-400 focus:border-ocean-600'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
