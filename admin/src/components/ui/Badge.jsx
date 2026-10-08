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
    default: 'bg-sand-100 text-navy-700 border-sand-300',
    primary: 'bg-navy-900 text-white border-navy-900',
    gold: 'bg-gold-50 text-gold-900 border-gold-300 font-bold',
    ocean: 'bg-ocean-50 text-ocean-800 border-ocean-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
    danger: 'bg-rose-50 text-rose-800 border-rose-300 font-semibold',
    // Club Membership Tiers
    member: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
    active_member: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    ambassador: 'bg-ocean-50 text-ocean-800 border-ocean-300 font-bold',
    elite_ambassador: 'bg-gold-50 text-gold-900 border-gold-400 font-extrabold shadow-xs',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase',
    sm: 'text-[11px] px-2.5 py-0.5 rounded-lg font-semibold',
    md: 'text-xs px-3 py-1 rounded-xl font-bold',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border leading-tight ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      )}
      {children}
    </span>
  );
}
