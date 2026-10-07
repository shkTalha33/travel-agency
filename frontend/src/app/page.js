import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import HomeContent from '@/components/home/HomeContent';

export const metadata = {
  title: 'Viajes Dominicana — Viaja. Comparte. Gana.',
  description: 'Descubre ofertas de viaje, únete a la comunidad y gana puntos con tu red de referidos.',
};

export default function HomePage() {
  return (
    <PublicShell>
      <HomeContent />
    </PublicShell>
  );
}
