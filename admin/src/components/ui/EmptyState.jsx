'use client';

import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon = null,
  title,
  description,
  actionText,
  onAction,
  actionVariant = 'gold',
  actionIcon = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-dashed border-sand-300 ${className}`}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-sand-100/80 flex items-center justify-center text-navy-400 mb-3.5 shadow-inner">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-navy-950 font-serif mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-navy-500 max-w-md mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant={actionVariant} size="sm" icon={actionIcon} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
