'use client';

import React, { useId } from 'react';

export default function Tooltip({ content, children }) {
  const id = useId();
  return (
    <span className="relative inline-flex group">
      <span aria-describedby={id} tabIndex={0} className="inline-flex cursor-help rounded">{children}</span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[16rem] -translate-x-1/2 rounded-lg bg-navy-900 px-3 py-2 text-xs font-normal normal-case tracking-normal text-white opacity-0 shadow-card transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
