import React from 'react';
import PublicShell from '@/components/layout/PublicShell';
import ContactFormGridWithDetails from '@/components/contact/ContactFormGridWithDetails';

export const metadata = {
  title: 'Contacto VIP & Asesoría — Círculo Wingding',
  description: 'Comunícate con nuestro equipo de concierges y especialistas en viajes de lujo por el Caribe. Atención personalizada 24/7.',
};

export default function ContactPage() {
  return (
    <PublicShell>
      <ContactFormGridWithDetails />
    </PublicShell>
  );
}
