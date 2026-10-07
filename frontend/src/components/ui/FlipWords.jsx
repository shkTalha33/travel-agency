'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Aceternity UI — Flip Words
 * Smooth fading/sliding word carousel for impactful headings.
 */
export function FlipWords({
  words = [],
  duration = 3000,
  className = '',
}) {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        index = (index + 1) % words.length;
        setCurrentWord(words[index]);
        setIsFlipping(false);
      }, 350);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span
      className={cn(
        'inline-block transition-all duration-300 transform',
        isFlipping
          ? 'opacity-0 -translate-y-2 scale-95'
          : 'opacity-100 translate-y-0 scale-100',
        className
      )}
    >
      {currentWord}
    </span>
  );
}

export default FlipWords;
