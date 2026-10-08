'use client';

import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-5',
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'bg-white border border-sand-200 shadow-sm hover:border-sand-300 transition-all duration-200',
    flat: 'bg-sand-50/80 border border-sand-200',
    elevated: 'bg-white border border-sand-200 shadow-md hover:shadow-lg transition-all duration-200',
    dark: 'bg-navy-950 border border-navy-800 text-white shadow-sm',
    gold: 'bg-gradient-to-br from-gold-50/60 to-amber-50/40 border border-gold-200 shadow-xs',
  };

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-0.5 hover:shadow-md transition-transform duration-200'
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
