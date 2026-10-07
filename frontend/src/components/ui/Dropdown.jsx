'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ trigger, items = [], align = 'right', label = 'Menú' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const itemCls = 'block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50';

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} aria-label={label} className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100">
        {trigger}
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} role="menu" className={`absolute z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevated animate-scale-in ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {items.map((it) =>
            it.href ? (
              <Link key={it.label} href={it.href} role="menuitem" className={itemCls} onClick={() => setOpen(false)}>{it.label}</Link>
            ) : (
              <button key={it.label} type="button" role="menuitem" className={itemCls} onClick={() => { setOpen(false); it.onClick?.(); }}>{it.label}</button>
            )
          )}
        </div>
      )}
    </div>
  );
}
