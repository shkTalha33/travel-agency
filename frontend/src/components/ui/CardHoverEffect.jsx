'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Card Hover Effect
 * Smooth gliding background pill that follows the hovered item in a grid.
 */
export function HoverEffect({ items, className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {items.map((item, idx) => {
        const Wrapper = item.link ? Link : 'div';
        const wrapperProps = item.link ? { href: item.link } : {};

        return (
          <Wrapper
            {...wrapperProps}
            key={item?.title || idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Aceternity subtle gliding background */}
            <span
              className={cn(
                'absolute inset-0 h-full w-full bg-slate-200/50 rounded-3xl -z-10 transition-all duration-200 opacity-0 scale-95',
                hoveredIndex === idx && 'opacity-100 scale-100'
              )}
            />

            <div className="relative rounded-3xl h-full w-full p-6 sm:p-7 overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  {item.icon && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs">
                      {item.icon}
                    </div>
                  )}
                  {item.badge && (
                    <span className="font-serif text-2xl font-bold text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-navy-900 mt-5">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>

              {item.footer && (
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-ocean-700 flex items-center justify-between">
                  {item.footer}
                </div>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

export default HoverEffect;
