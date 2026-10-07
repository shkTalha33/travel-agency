'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Bento Grid & Bento Grid Item
 * Responsive, asymmetrical luxury layout with hover glow and micro-interactions.
 */
export function BentoGrid({ className, children }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  stepNumber,
  badge,
  children,
}) {
  return (
    <div
      className={cn(
        'row-span-1 rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 justify-between flex flex-col space-y-4 relative overflow-hidden',
        className
      )}
    >
      {header && <div className="w-full">{header}</div>}

      <div>
        <div className="flex items-center justify-between">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs">
              {icon}
            </div>
          )}
          {stepNumber && (
            <span className="font-serif text-3xl font-bold text-slate-300">
              {stepNumber}
            </span>
          )}
          {badge && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              {badge}
            </span>
          )}
        </div>

        {title && (
          <h3 className="font-serif text-xl font-bold text-navy-900 mt-4">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-slate-600 mt-2">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}

export default BentoGrid;
