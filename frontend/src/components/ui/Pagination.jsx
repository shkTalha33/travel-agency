'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const btn = 'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1.5">
      <button className={`${btn} border-slate-200 bg-white hover:bg-slate-50`} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Página anterior"><ChevronLeft size={16} /></button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={`${btn} ${n === page ? 'border-navy-900 bg-navy-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>{n}</button>
      ))}
      <button className={`${btn} border-slate-200 bg-white hover:bg-slate-50`} onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Página siguiente"><ChevronRight size={16} /></button>
    </nav>
  );
}
