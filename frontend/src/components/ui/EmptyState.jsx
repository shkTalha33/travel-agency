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
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-sand-100 flex items-center justify-center text-navy-700 mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-bold text-navy-900 font-serif mb-2">{title}</h4>
      {description && (
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
