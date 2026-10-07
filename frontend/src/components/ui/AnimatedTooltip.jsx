'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';

/**
 * Aceternity UI — Animated Tooltip
 * Interactive floating avatar tooltip with smooth scale and elevation.
 */
export function AnimatedTooltip({ items }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-row items-center -space-x-3">
      {items.map((item, idx) => (
        <div
          key={item.name || idx}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === idx && (
            <div
              className="absolute -top-16 -left-1/2 translate-x-1/2 flex flex-col items-center justify-center rounded-2xl bg-navy-950 px-3.5 py-1.5 text-xs shadow-xl z-50 whitespace-nowrap border border-gold-400/30 text-white animate-scale-in"
              role="tooltip"
            >
              <div className="font-bold text-gold-300">{item.name}</div>
              <div className="text-[10px] text-slate-300">{item.role || item.status}</div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-navy-950 border-b border-r border-gold-400/30" />
            </div>
          )}

          <div className="relative transition-all duration-300 group-hover:scale-110 group-hover:z-30">
            <Avatar
              src={item.image || item.avatar}
              name={item.name}
              size="md"
              className="ring-2 ring-white shadow-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnimatedTooltip;
