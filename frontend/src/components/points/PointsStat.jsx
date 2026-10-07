import React from 'react';
import Card from '@/components/ui/Card';

export default function PointsStat({ label, value, hint, tone = 'default' }) {
  return (
    <Card padding="p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone === 'accent' ? 'text-ocean-600' : 'text-navy-900'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}
