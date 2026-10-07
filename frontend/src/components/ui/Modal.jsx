'use client';

import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, description, children, maxWidth = 'max-w-lg' }) {
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const node = dialogRef.current;
    const focusables = () => Array.from(node?.querySelectorAll(FOCUSABLE) || []);
    (focusables()[0] || node)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return e.preventDefault();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
      <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-elevated animate-scale-in`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 pb-4 pt-6">
          <div>
            {title && <h2 id={titleId} className="font-serif text-xl font-bold text-navy-900">{title}</h2>}
            {description && <p id={descId} className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
