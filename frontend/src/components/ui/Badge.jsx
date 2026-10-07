'use client';

import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-navy-900 text-white border-navy-900',
    ocean: 'bg-ocean-50 text-ocean-700 border-ocean-200',
    gold: 'bg-gold-50 text-gold-800 border-gold-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    // Specific membership level variants
    member: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
    active_member: 'bg-ocean-100 text-ocean-800 border-ocean-300 font-semibold',
    ambassador: 'bg-gold-100 text-gold-800 border-gold-300 font-semibold',
    elite_ambassador: 'bg-navy-900 text-gold-300 border-gold-400/50 font-bold',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border leading-tight ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
