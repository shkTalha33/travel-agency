'use client';

import React, { useId } from 'react';

export default function Checkbox({ label, id, checked, onChange, error = '', className = '', ...props }) {
  const auto = useId();
  const fid = id || auto;
  const errId = `${fid}-error`;
  return (
    <div className={className}>
      <label htmlFor={fid} className="flex items-start gap-2.5 text-sm text-slate-600 cursor-pointer">
        <input
          id={fid}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-navy-900"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p id={errId} role="alert" className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
