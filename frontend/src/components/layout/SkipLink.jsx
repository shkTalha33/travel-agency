'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SkipLink() {
  const { t } = useLanguage();
  return <a href="#contenido" className="skip-link">{t('skip')}</a>;
}
