'use client';

import React from 'react';
import ErrorState from '@/components/common/ErrorState';

export default function DashboardError({ reset }) {
  return <ErrorState onRetry={reset} />;
}
