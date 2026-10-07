import React from 'react';

export function List({ children, className = '' }) {
  return <ul className={`divide-y divide-slate-100 ${className}`}>{children}</ul>;
}

export function ListItem({ leading, title, subtitle, trailing, className = '' }) {
  return (
    <li className={`flex items-center gap-3 py-3.5 ${className}`}>
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-900">{title}</p>
        {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </li>
  );
}
