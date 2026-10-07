'use client';

import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon = null,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-dashed border-slate-300 ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold text-navy-900 font-serif mb-2">{title}</h4>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
