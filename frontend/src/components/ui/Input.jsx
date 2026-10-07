'use client';

import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label, id, type = 'text', placeholder = '', value, onChange, error = '', helperText = '',
  required = false, disabled = false, icon = null, className = '', ...props
}) {
  const auto = useId();
  const fid = id || auto;
  const errId = `${fid}-error`;
  const helpId = `${fid}-help`;
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? errId : helperText ? helpId : undefined;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={fid} className="mb-1.5 block text-sm font-medium capitalize text-slate-700">
          {label}
          {required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400" aria-hidden="true">{icon}</div>}
        <input
          id={fid}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 outline-none focus:outline-none focus:ring-0 disabled:bg-slate-100 disabled:text-slate-500 ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 hover:border-slate-400 focus:border-ocean-600'}`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 flex items-center rounded-r-xl pr-3.5 text-slate-400 hover:text-slate-600" aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={show}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p id={helpId} className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
