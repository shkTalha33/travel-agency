'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, totalPages = 1, onChange, className = '' }) {
  if (totalPages <= 1) return null;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const btn =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-xs font-bold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none';

  // Smart windowed page numbers with ellipsis (e.g. 1 ... 9 [10] 11 ... 20)
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let prev;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Paginación" className={`flex items-center justify-center gap-1.5 flex-wrap ${className}`}>
      {/* Previous Page Button */}
      <button
        type="button"
        className={`${btn} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-ocean-600 shadow-xs`}
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page Numbers & Ellipses */}
      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="px-2 text-xs font-bold text-slate-400 select-none">
              ...
            </span>
          );
        }
        const isActive = p === currentPage;
        return (
          <button
            type="button"
            key={`page-${p}`}
            onClick={() => onChange(p)}
            aria-current={isActive ? 'page' : undefined}
            className={`${btn} ${
              isActive
                ? 'border-ocean-600 bg-ocean-600 text-white shadow-sm font-extrabold cursor-default pointer-events-none'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-ocean-600 shadow-xs'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        type="button"
        className={`${btn} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-ocean-600 shadow-xs`}
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
