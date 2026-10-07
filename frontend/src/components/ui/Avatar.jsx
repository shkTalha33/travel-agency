'use client';

import React from 'react';

const SIZES = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl' };

const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const [failed, setFailed] = React.useState(false);
  const cls = `${SIZES[size] || SIZES.md} rounded-full shrink-0 ${className}`;
  if (!src || failed) {
    return <span role="img" aria-label={name} className={`${cls} bg-navy-900 text-gold-400 font-semibold inline-flex items-center justify-center`}>{initials(name)}</span>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name} onError={() => setFailed(true)} className={`${cls} object-cover`} />;
}
