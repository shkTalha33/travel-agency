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

export function OfferDetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando detalles de la oferta" className="mx-auto max-w-7xl px-2 sm:px-4 py-2 space-y-8 animate-in fade-in duration-300">
      {/* Main Content & Aside Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Left Column (Image Gallery, Header, Highlights, Inclusions, Itinerary) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Image Gallery Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-72 sm:h-96 md:h-[28rem] w-full rounded-3xl" />
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Skeleton className="aspect-[4/3] w-20 sm:w-24 md:w-28 rounded-2xl shrink-0" />
              <Skeleton className="aspect-[4/3] w-20 sm:w-24 md:w-28 rounded-2xl shrink-0" />
              <Skeleton className="aspect-[4/3] w-20 sm:w-24 md:w-28 rounded-2xl shrink-0" />
            </div>
          </div>
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
            </div>
            <Skeleton className="h-9 sm:h-12 w-4/5 rounded-xl mt-3" />
            <Skeleton className="h-0.5 w-16 rounded my-4" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-6 w-28 rounded-lg" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-3/4 h-4" />
            </div>
          </div>

          {/* Highlights Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 space-y-4">
            <Skeleton className="h-7 w-44 rounded-lg" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <Skeleton variant="circular" className="h-5 w-5 shrink-0" />
                <Skeleton variant="text" className="w-4/5" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton variant="circular" className="h-5 w-5 shrink-0" />
                <Skeleton variant="text" className="w-3/4" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton variant="circular" className="h-5 w-5 shrink-0" />
                <Skeleton variant="text" className="w-5/6" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton variant="circular" className="h-5 w-5 shrink-0" />
                <Skeleton variant="text" className="w-2/3" />
              </div>
            </div>
          </div>

          {/* Inclusions / Exclusions */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 space-y-3">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <div className="space-y-2">
                <Skeleton variant="text" className="w-full" />
                <Skeleton variant="text" className="w-4/5" />
                <Skeleton variant="text" className="w-3/4" />
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 space-y-3">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <div className="space-y-2">
                <Skeleton variant="text" className="w-full" />
                <Skeleton variant="text" className="w-4/5" />
              </div>
            </div>
          </div>

          {/* Itinerary Timeline */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 space-y-6">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <div className="space-y-6 border-l-2 border-slate-200 pl-6 sm:pl-8 ml-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton variant="text" className="w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton variant="text" className="w-5/6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton variant="text" className="w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Aside Booking Box */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 sm:p-7 space-y-4">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-3.5 w-32 rounded" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-3 w-48 mx-auto rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </aside>
      </div>

      {/* Related Offers Section Skeleton */}
      <div className="mt-14 border-t border-sand-200/80 pt-10 space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function NetworkSkeleton() {
  return (
    <div role="status" aria-label="Cargando red de referidos" className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-64 rounded-lg" />
            <Skeleton className="h-4 w-60 sm:w-80 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-16 w-44 rounded-2xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      {/* Member Tree/Table Card Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        <ListSkeleton rows={5} />
      </div>
    </div>
  );
}

export function PointsSkeleton() {
  return (
    <div role="status" aria-label="Cargando balance de puntos" className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Top Balance Banner Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-9 sm:h-10 w-36 rounded-lg" />
            <Skeleton className="h-4 w-52 rounded" />
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3">
            <Skeleton className="h-14 w-44 rounded-2xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* History Card Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        <div className="space-y-1.5 pb-3 border-b border-sand-100">
          <Skeleton className="h-6 w-52 rounded" />
          <Skeleton className="h-3.5 w-72 rounded" />
        </div>
        <ListSkeleton rows={5} />
      </div>
    </div>
  );
}

export function RedeemSkeleton() {
  return (
    <div role="status" aria-label="Cargando formulario de redención" className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-9 sm:h-10 w-32 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-48 rounded-xl" />
            <Skeleton className="h-7 w-48 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Form & Aside Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Form Card Skeleton */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 space-y-5">
          <div className="space-y-1.5 pb-3 border-b border-sand-100">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Info Aside Skeleton */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 space-y-3">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div role="status" aria-label="Cargando perfil" className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Top Profile Banner Skeleton */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton variant="circular" className="w-18 h-18 sm:w-20 sm:h-20 shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-7 sm:h-8 w-44 rounded-lg" />
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3.5 w-48 rounded" />
            </div>
          </div>
          <Skeleton className="h-16 w-52 rounded-2xl" />
        </div>
      </div>

      {/* Grid Settings Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Account Info Card */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <Skeleton className="h-6 w-44 rounded" />
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" className="w-20 h-20 shrink-0" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Security / Password Card */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OffersPageSkeleton() {
  return (
    <div role="status" aria-label="Cargando ofertas de viaje" className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Section Heading Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-8 sm:h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-80 sm:w-96 rounded" />
      </div>

      {/* Filters Bar Skeleton */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
        <Skeleton className="h-11 w-44 rounded-xl" />
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      {/* Offers Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <OfferCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return <DashboardSkeleton />;
}


