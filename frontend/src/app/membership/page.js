import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import MembershipContent from '@/components/membership/MembershipContent';

export const metadata = { title: 'Membresía — Círculo Wingding', description: 'Compara los cuatro niveles de membresía.' };

export default function MembershipPage() {
  return (
    <PublicShell>
      <MembershipContent />
    </PublicShell>
  );
}
