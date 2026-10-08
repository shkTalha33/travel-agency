'use client';

import React, { useId, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  icon = null,
  rightIcon = null,
  className = '',
  inputClassName = '',
  ...props
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
        <label htmlFor={fid} className="mb-1.5 block text-xs font-bold text-navy-800">
          {label}
          {required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-navy-400" aria-hidden="true">
            {icon}
          </div>
        )}
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
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs font-medium text-navy-950 transition-colors placeholder:text-navy-400/60 outline-none focus:outline-none focus:ring-0 disabled:bg-sand-100 disabled:text-navy-400 disabled:cursor-not-allowed ${
            icon ? 'pl-10' : ''
          } ${isPassword || rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
              : 'border-sand-200 hover:border-sand-300 focus:border-gold-500'
          } ${inputClassName}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 flex items-center rounded-r-xl pr-3.5 text-navy-400 hover:text-navy-700 cursor-pointer"
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {!isPassword && rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy-400" aria-hidden="true">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={helpId} className="mt-1.5 text-[11px] text-navy-500">{helperText}</p>
      ) : null}
    </div>
  );
}
