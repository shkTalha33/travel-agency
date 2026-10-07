import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import AboutContent from '@/components/about/AboutContent';

export const metadata = { title: 'Nosotros — Círculo Wingding', description: 'Conoce nuestra misión, visión y concepto de comunidad.' };

export default function AboutPage() {
  return (
    <PublicShell>
      <AboutContent />
    </PublicShell>
  );
}
