'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Ultra-smooth viewport reveal component.
 * Animates elements gracefully into view as user scrolls.
 */
export default function Reveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 750,
}) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dirClass = {
    up: 'reveal-up',
    down: 'reveal-down',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
    fade: 'reveal-fade',
  }[direction] || 'reveal-up';

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${on ? 'reveal-in' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        ...(delay ? { transitionDelay: `${delay}ms` } : {}),
      }}
    >
      {children}
    </div>
  );
}
