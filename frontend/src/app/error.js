'use client';

import React from 'react';
import ErrorState from '@/components/common/ErrorState';

export default function GlobalError({ reset }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
      <ErrorState onRetry={reset} className="w-full" />
    </div>
  );
}
