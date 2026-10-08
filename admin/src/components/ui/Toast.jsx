'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: {
    cls: 'border-emerald-200/90 bg-white/95 text-emerald-950 shadow-2xl ring-1 ring-emerald-500/20',
    iconCls: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  error: {
    cls: 'border-rose-200/90 bg-white/95 text-rose-950 shadow-2xl ring-1 ring-rose-500/20',
    iconCls: 'text-rose-600',
    Icon: AlertCircle,
  },
  info: {
    cls: 'border-ocean-200/90 bg-white/95 text-navy-950 shadow-2xl ring-1 ring-[#AA303E]/20',
    iconCls: 'text-[#AA303E]',
    Icon: Info,
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((msgOrOpts, typeArg = 'success', durationArg = 4000) => {
    const id = ++idRef.current;
    let message = '';
    let type = 'success';
    let duration = 4000;

    if (typeof msgOrOpts === 'object' && msgOrOpts !== null) {
      message = msgOrOpts.message || msgOrOpts.text || msgOrOpts.title || '';
      type = msgOrOpts.type || 'success';
      duration = msgOrOpts.duration || 4000;
    } else {
      message = String(msgOrOpts || '');
      type = typeArg || 'success';
      duration = durationArg || 4000;
    }

    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="fixed top-5 right-5 z-[999999] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((t) => {
          const { cls, iconCls, Icon } = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 text-sm backdrop-blur-md shadow-2xl transition-all animate-slide-down ${cls}`}
            >
              <Icon size={20} className={`mt-0.5 shrink-0 ${iconCls}`} aria-hidden="true" />
              <p className="flex-1 font-medium leading-relaxed">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="rounded-lg p-1 text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    return {
      toast: (msg) => console.log('Toast:', msg),
    };
  }
  return ctx;
}
