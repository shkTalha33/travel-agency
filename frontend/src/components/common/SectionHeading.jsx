import React from 'react';
import { AccentRule } from '@/components/common/Linework';

export default function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      {eyebrow && (
        <div className={`mb-3 flex flex-col gap-2 ${center ? 'items-center' : 'items-start'}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ocean-700">{eyebrow}</p>
          <AccentRule />
        </div>
      )}
      <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 leading-relaxed text-slate-600">{description}</p>}
    </div>
  );
}
