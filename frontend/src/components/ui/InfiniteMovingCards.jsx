'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';

/**
 * Aceternity UI — Infinite Moving Cards
 * Continuously scrolling marquee with pause on hover, gradient masks, and Caribbean styling.
 */
export function InfiniteMovingCards({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });

    // Speed calculation
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '25s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '45s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }

      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards');
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse');
      }
    }

    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex min-w-full shrink-0 gap-5 py-4 w-max flex-nowrap',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="w-[340px] max-w-full relative rounded-3xl border border-sand-200/90 bg-white/95 p-6 shadow-card shrink-0 sm:w-[400px] transition-all duration-300 hover:shadow-elevated hover:border-ocean-300"
          >
            <div className="flex items-center justify-between border-b border-sand-100 pb-3.5 mb-3.5">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-ocean-50 text-ocean-700 px-2.5 py-0.5 border border-ocean-200/60">
                {item.tag || 'Viajero VIP'}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 italic">
              &ldquo;{item.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3 pt-3 border-t border-sand-100/70">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-ocean-800 text-gold-300 font-bold text-xs shadow-xs">
                {item.initials || item.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy-900">{item.name}</p>
                <p className="truncate text-xs font-medium text-slate-500">{item.role || item.destination}</p>
              </div>
              {item.pointsEarned && (
                <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
                  +{item.pointsEarned} pts
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InfiniteMovingCards;
