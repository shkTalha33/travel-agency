import React from 'react';

/** Hairline gold rule used under eyebrows and between editorial blocks. */
export function AccentRule({ className = '' }) {
  return (
    <svg className={`h-[2px] w-10 text-gold-500 ${className}`} viewBox="0 0 40 2" fill="none" aria-hidden="true">
      <path d="M0 1h40" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Crop-mark corners around a photo or panel. */
export function CornerFrame({ className = '' }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full text-gold-500 ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path d="M12 0v10H0" stroke="currentColor" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
      <path d="M88 0v10h12" stroke="currentColor" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
      <path d="M12 100v-10H0" stroke="currentColor" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
      <path d="M88 100v-10h12" stroke="currentColor" strokeWidth="0.7" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Faint architectural line grid behind the hero. */
export function HeroGrid() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-navy-900/[0.06]" aria-hidden="true">
      <defs>
        <pattern id="hero-grid" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M72 0H0M0 0v72" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      <line x1="42%" y1="0" x2="42%" y2="100%" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Horizontal connector used above numbered columns. */
export function Connector() {
  return (
    <svg className="mb-8 hidden h-4 w-full text-gold-500/70 lg:block" viewBox="0 0 1000 16" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path d="M8 8h984" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
      <circle cx="336" cy="8" r="3.5" fill="currentColor" />
      <circle cx="664" cy="8" r="3.5" fill="currentColor" />
      <circle cx="992" cy="8" r="3.5" fill="currentColor" />
    </svg>
  );
}
