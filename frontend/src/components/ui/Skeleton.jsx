'use client';

import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variants[variant] || variants.rectangular} ${className}`}
    />
  );
}
