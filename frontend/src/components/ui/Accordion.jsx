'use client';

import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const base = useId();
  const [open, setOpen] = useState([0]);

  const toggle = (i) => {
    if (allowMultiple) setOpen(open.includes(i) ? open.filter((x) => x !== i) : [...open, i]);
    else setOpen(open.includes(i) ? [] : [i]);
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const panelId = `${base}-panel-${i}`;
        const btnId = `${base}-btn-${i}`;
        return (
          <div
            key={item.id || i}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'border-ocean-300 bg-gradient-to-b from-white via-white to-ocean-50/30 shadow-card ring-1 ring-ocean-400/20'
                : 'border-sand-200/90 bg-white shadow-soft hover:border-ocean-300/60 hover:shadow-card'
            }`}
          >
            <h3 className="font-sans">
              <button
                id={btnId}
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors"
              >
                <span className="flex items-center gap-3 pr-4 text-base font-bold text-navy-900 transition-colors group-hover:text-ocean-700">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    isOpen ? 'bg-ocean-600 text-white' : 'bg-sand-100 text-slate-500 group-hover:bg-ocean-100 group-hover:text-ocean-700'
                  }`}>
                    0{i + 1}
                  </span>
                  {item.question || item.title}
                </span>
                <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
                  isOpen ? 'rotate-180 bg-ocean-100 text-ocean-700' : 'bg-sand-100 text-slate-500 group-hover:bg-sand-200'
                }`} aria-hidden="true">
                  <ChevronDown size={16} />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={btnId} className="border-t border-sand-100/80 px-5 pb-6 pt-3 sm:px-6 text-sm leading-relaxed text-slate-600 animate-fade-in pl-14 sm:pl-16">
                {item.answer || item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
