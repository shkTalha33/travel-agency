'use client';

import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200',
    flat: 'bg-slate-50 border border-slate-200/70',
    elevated: 'bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200',
    dark: 'bg-navy-900 border border-navy-800 text-white shadow-sm',
    glass: 'glass-panel shadow-sm border border-white/60',
  };

  const hoverStyle = hoverEffect
    ? 'lift'
    : '';

  return (
    <div
      className={`rounded-2xl ${variants[variant] || variants.default} ${padding} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
