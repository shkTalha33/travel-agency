'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Background Beams
 * Atmospheric glowing gradient rays and light beam paths.
 */
export function BackgroundBeams({ className }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]',
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] opacity-40 stroke-gold-400/30"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <path
          d="M100 0 L500 500 L900 1000 M900 0 L500 500 L100 1000 M500 0 L500 1000 M0 500 L1000 500"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="500" cy="500" r="250" strokeWidth="1" />
        <circle cx="500" cy="500" r="400" strokeWidth="1" strokeDasharray="6 6" />
      </svg>
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="absolute left-1/3 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean-400/10 blur-3xl" />
    </div>
  );
}

export default BackgroundBeams;
