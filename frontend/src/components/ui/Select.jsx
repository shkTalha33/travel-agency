'use client';

import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({ label, id, options = [], value, onChange, error = '', required = false, className = '', ...props }) {
  const auto = useId();
  const fid = id || auto;
  const errId = `${fid}-error`;
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={fid} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}{required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
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
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-colors ${error ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
          {...props}
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
      {error && <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
