'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Lamp Container
 * Ambient spotlight cone beaming down on headers.
 */
export function LampContainer({ children, className }) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden bg-navy-950 w-full rounded-3xl z-0 py-16 px-4',
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left Lamp Beam */}
        <div
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-gold-400/60 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-navy-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-navy-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </div>

        {/* Right Lamp Beam */}
        <div
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-gold-400/60 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-navy-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-navy-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </div>

        {/* Center Glow */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-navy-950 blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-ocean-400/30 blur-2xl" />
        <div className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-gold-400/80" />

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-navy-950" />
      </div>

      <div className="relative z-50 flex -translate-y-12 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
}

export default LampContainer;
