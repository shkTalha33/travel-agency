import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import FaqContent from '@/components/faq/FaqContent';

export const metadata = { title: 'Preguntas frecuentes — Viajes Dominicana', description: 'Respuestas sobre registro, membresías, puntos y red.' };

export default function FaqPage() {
  return (
    <PublicShell>
      <FaqContent />
    </PublicShell>
  );
}
