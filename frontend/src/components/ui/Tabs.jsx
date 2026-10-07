'use client';

import React, { useRef, useId } from 'react';

export default function Tabs({ tabs = [], activeTab, onChange, className = '', label = 'Secciones' }) {
  const base = useId();
  const refs = useRef([]);

  const onKeyDown = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={`flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/60 bg-slate-100/90 p-1 ${className}`}>
      {tabs.map((tab, i) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => (refs.current[i] = el)}
            id={`${base}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`flex select-none items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm ${active ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:bg-white/50 hover:text-navy-900'}`}
          >
            {tab.icon && <span className="shrink-0" aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && <span className={`rounded-full px-1.5 text-[11px] ${active ? 'bg-navy-900 text-white' : 'bg-slate-200 text-slate-700'}`}>{tab.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
