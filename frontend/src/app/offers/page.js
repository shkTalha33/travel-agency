import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import OffersContent from '@/components/offers/OffersContent';

export const metadata = {
  title: 'Ofertas de viaje — Viajes Dominicana',
  description: 'Explora todas las ofertas de viaje disponibles.',
};

export default function OffersPage() {
  return (
    <PublicShell>
      <OffersContent />
    </PublicShell>
  );
}
