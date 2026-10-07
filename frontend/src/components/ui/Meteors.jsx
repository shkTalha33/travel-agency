'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Meteors Effect
 * Diagonal shooting star animations with glowing tails for dark luxury containers.
 */
export function Meteors({ number = 20, className }) {
  const meteors = useMemo(() => {
    return new Array(number).fill(true).map(() => ({
      top: `${Math.floor(Math.random() * 80) - 20}%`,
      left: `${Math.floor(Math.random() * 120) - 20}%`,
      animationDelay: `${Math.random() * 1.5 + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * 6 + 4)}s`,
    }));
  }, [number]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {meteors.map((m, idx) => (
        <span
          key={`meteor-${idx}`}
          className={cn(
            'animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-full bg-gold-300 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[60px] before:h-[1px] before:bg-gradient-to-r before:from-gold-300 before:to-transparent",
            className
          )}
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.animationDelay,
            animationDuration: m.animationDuration,
          }}
        />
      ))}
    </div>
  );
}

export default Meteors;
