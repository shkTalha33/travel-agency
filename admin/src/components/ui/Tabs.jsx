'use client';

import React, { useRef, useId } from 'react';

export default function Tabs({ tabs = [], activeTab, onChange, className = '', label = 'Tabs' }) {
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
    <div
      role="tablist"
      aria-label={label}
      className={`flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-sand-200 bg-sand-100/60 p-1 ${className}`}
    >
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
            className={`flex select-none items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              active
                ? 'bg-navy-950 text-gold-400 shadow-sm'
                : 'text-navy-600 hover:bg-white/90 hover:text-navy-950'
            }`}
          >
            {tab.icon && <span className="shrink-0" aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  active ? 'bg-gold-400/20 text-gold-300' : 'bg-sand-200 text-navy-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
