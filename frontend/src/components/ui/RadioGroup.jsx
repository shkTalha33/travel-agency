'use client';

import React from 'react';

export default function RadioGroup({ legend, name, options = [], value, onChange, className = '' }) {
  return (
    <fieldset className={className}>
      {legend && <legend className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">{legend}</legend>}
      <div className="space-y-2">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <label key={o.value} htmlFor={id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${value === o.value ? 'border-navy-900 bg-navy-900/5' : 'border-slate-200 hover:border-slate-300'}`}>
              <input id={id} type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="h-4 w-4 text-navy-900" />
              <span className="text-slate-700">{o.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
