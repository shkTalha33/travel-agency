import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export function OfferCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white" aria-hidden="true">
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
    <div className="rounded-2xl bg-white p-4 sm:p-5 space-y-2.5" aria-hidden="true">
      <Skeleton variant="text" className="w-1/2 h-3.5" />
      <Skeleton className="h-7 sm:h-8 w-24 sm:w-28 rounded-lg" />
      <Skeleton variant="text" className="w-3/4 h-3" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3.5 py-1" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" className="h-9 w-9 shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <Skeleton variant="text" className="w-2/5 h-3.5" />
            <Skeleton variant="text" className="w-1/4 h-2.5" />
          </div>
          <Skeleton variant="text" className="w-14 h-4 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Cargando panel de control" className="w-full space-y-5 animate-in fade-in duration-300">
      {/* 1. Top Welcome Banner Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton variant="circular" className="w-16 h-16 sm:w-18 sm:h-18 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-7 sm:h-8 w-44 sm:w-60 rounded-lg" />
              <div className="flex flex-wrap items-center gap-2.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-36 rounded hidden sm:inline-block" />
              </div>
            </div>
          </div>
          <div className="pt-2 lg:pt-0 border-t border-sand-100 lg:border-0">
            <Skeleton className="h-9 w-32 rounded-xl shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Points Statistics Metrics Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* 3. Interactive Graphs Section Skeleton */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Points Growth Chart Card */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3.5 w-56 rounded" />
            </div>
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
          <Skeleton className="h-60 sm:h-64 w-full rounded-xl" />
        </div>

        {/* Network Breakdown Chart Card */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-44 rounded" />
              <Skeleton className="h-3.5 w-52 rounded" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-60 sm:h-64 w-full rounded-xl" />
        </div>
      </div>

      {/* 4. Activity & Network Overview Grid Skeleton */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent Points Activity Card */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3 w-52 rounded" />
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <ListSkeleton rows={4} />
        </div>

        {/* Referral Network Overview Card */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <div className="space-y-1">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
          <ListSkeleton rows={3} />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return <DashboardSkeleton />;
}

