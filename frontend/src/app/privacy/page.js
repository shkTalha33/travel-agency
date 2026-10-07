'use client';

import React from 'react';
import LegalPage from '@/components/common/LegalPage';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { locale } = useLanguage();

  if (locale === 'en') {
    return (
      <LegalPage title="Privacy Policy">
        <p>Viajes Dominicana is committed to protecting your personal information and transparent data handling practices.</p>
        <h2 className="font-sans text-lg font-semibold text-navy-900">Information We Collect</h2>
        <p>Full name, email address, and contact details necessary to administer your membership account and process travel inquiries.</p>
        <h2 className="font-sans text-lg font-semibold text-navy-900">How We Use Your Data</h2>
        <p>We use your data to maintain account security, display your network earnings, and coordinate booking details through dedicated advisors.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Política de privacidad">
      <p>Viajes Dominicana está comprometida con la protección de tu información personal y la transparencia en el tratamiento de datos.</p>
      <h2 className="font-sans text-lg font-semibold text-navy-900">Datos que recopilamos</h2>
      <p>Nombre, correo electrónico y datos de contacto necesarios para gestionar tu cuenta y tus solicitudes.</p>
      <h2 className="font-sans text-lg font-semibold text-navy-900">Uso de tus datos</h2>
      <p>Usamos tus datos para operar tu cuenta, mostrar tu red de referidos y contactarte sobre tus solicitudes.</p>
    </LegalPage>
  );
}
