'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${maxWidth} m-auto overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-2xl animate-scale-in flex flex-col`}
      >
        {/* Modal Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between border-b border-sand-200 px-6 py-5 bg-white shrink-0">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-400 text-navy-950 flex items-center justify-center shadow-md shadow-gold-500/20 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-lg font-serif font-bold text-navy-950 tracking-tight">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-navy-950 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[calc(90vh-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
