'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Moving Border Button
 * Animated gradient border button with smooth rotation.
 */
export function MovingBorderButton({
  borderRadius = '1.25rem',
  children,
  as: Component = 'button',
  containerClassName,
  borderClassName,
  duration = 4000,
  className,
  ...otherProps
}) {
  return (
    <Component
      className={cn(
        'relative p-[1.5px] overflow-hidden bg-transparent transition-all duration-300 active:scale-[0.98]',
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <div
          className={cn(
            'h-full w-full opacity-[0.9] absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4B45A_0%,#3AA99C_50%,#D4B45A_100%)]',
            borderClassName
          )}
        />
      </div>

      <div
        className={cn(
          'relative bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-navy-950 font-bold flex items-center justify-center w-full h-full text-sm backdrop-blur-xl px-6 py-3.5 shadow-sm',
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export default MovingBorderButton;
