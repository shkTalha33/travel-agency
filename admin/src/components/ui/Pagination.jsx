'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, totalPages = 1, onChange, className = '' }) {
  const effectiveTotalPages = Math.max(1, totalPages || 1);
  const currentPage = Math.max(1, Math.min(page || 1, effectiveTotalPages));

  const btn =
    'inline-flex h-8 min-w-[34px] items-center justify-center rounded-xl border px-2.5 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none';

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    if (effectiveTotalPages <= 1) return [1];

    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= effectiveTotalPages; i++) {
      if (i === 1 || i === effectiveTotalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        type="button"
        className={`${btn} border-sand-200 bg-white text-navy-700 hover:bg-sand-50 hover:border-sand-300 shadow-xs`}
        onClick={() => onChange && onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={15} />
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="px-1.5 text-xs text-navy-400 font-bold">
              ...
            </span>
          );
        }
        const isActive = p === currentPage;
        return (
          <button
            type="button"
            key={`page-${p}-${idx}`}
            onClick={() => onChange && onChange(p)}
            disabled={isActive}
            aria-current={isActive ? 'page' : undefined}
            className={`${btn} ${
              isActive
                ? 'border-navy-900 bg-navy-900 text-white font-extrabold shadow-xs pointer-events-none'
                : 'border-sand-200 bg-white text-navy-800 hover:bg-sand-50 hover:border-sand-300 shadow-xs'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className={`${btn} border-sand-200 bg-white text-navy-700 hover:bg-sand-50 hover:border-sand-300 shadow-xs`}
        onClick={() => onChange && onChange(currentPage + 1)}
        disabled={currentPage >= effectiveTotalPages}
        aria-label="Next Page"
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}
