'use client';

import React from 'react';
import LegalPage from '@/components/common/LegalPage';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
  const { locale } = useLanguage();

  if (locale === 'en') {
    return (
      <LegalPage title="Terms and Conditions">
        <p>This page serves as official terms and platform guidelines for all members and travelers using Círculo Wingding.</p>
        <h2 className="font-sans text-lg font-semibold text-navy-900">Platform Usage</h2>
        <p>The platform enables users to create accounts, explore Caribbean travel packages, manage multi-tier affiliate referral trees, and request points redemptions.</p>
        <h2 className="font-sans text-lg font-semibold text-navy-900">Bookings & Points</h2>
        <p>Travel packages are booked and finalized off-platform with verified official travel advisors. Purchase points are credited by the system administration upon booking verification.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Términos y condiciones">
      <p>Esta página establece los términos y directrices oficiales de la plataforma para miembros y viajeros de Círculo Wingding.</p>
      <h2 className="font-sans text-lg font-semibold text-navy-900">Uso de la plataforma</h2>
      <p>La plataforma permite registrarse, consultar ofertas de viaje, gestionar una red de referidos y solicitar la redención de puntos.</p>
      <h2 className="font-sans text-lg font-semibold text-navy-900">Compras y puntos</h2>
      <p>Las compras de viajes se realizan fuera de la plataforma con asesores oficiales. Los puntos de compra son asignados por el administrador.</p>
    </LegalPage>
  );
}
