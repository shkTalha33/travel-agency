'use client';

import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-sand-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}
