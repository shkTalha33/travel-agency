import React from 'react';
import Skeleton from '@/components/ui/Skeleton';
import Card from '@/components/ui/Card';

export function OfferCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft" aria-hidden="true">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="h-6 w-4/5" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <Card padding="p-5" aria-hidden="true">
      <Skeleton variant="text" className="w-1/2" />
      <Skeleton className="mt-3 h-8 w-1/3" />
    </Card>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4 py-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-10 w-10" />
          <div className="flex-1 space-y-2"><Skeleton variant="text" className="w-1/2" /><Skeleton variant="text" className="w-1/3" /></div>
          <Skeleton variant="text" className="w-14" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div role="status" aria-label="Cargando contenido" className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton /></div>
      <Card><ListSkeleton /></Card>
    </div>
  );
}
