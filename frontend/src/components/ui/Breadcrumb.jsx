import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {last || !item.href ? (
                <span aria-current={last ? 'page' : undefined} className="text-slate-700 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-navy-900">{item.label}</Link>
              )}
              {!last && <ChevronRight size={12} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
