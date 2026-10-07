'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Star } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { useLanguage } from '@/context/LanguageContext';

const AUTH_PHOTO = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80';

export default function AuthShell({ title, subtitle, children, footer }) {
  const { t, copy } = useLanguage();
  const av = copy.authViews || {};

  return (
    <div className="grid min-h-screen lg:grid-cols-12 bg-sand-50">
      {/* Left visual hero */}
      <div className="relative hidden overflow-hidden bg-navy-950 lg:col-span-6 lg:flex lg:flex-col lg:justify-between p-12">
        <SafeImage
          src={AUTH_PHOTO}
          alt={t('auth.photoAlt')}
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-900/30" />

        {/* Top Logo on hero */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 font-serif text-2xl font-bold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400 text-navy-950 shadow-md">
              <Compass size={22} aria-hidden="true" />
            </span>
            <span>{t('brand')}</span>
          </Link>
        </div>

        {/* Floating VIP Social Proof Card */}
        <div className="relative z-10 space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-2xl text-white max-w-lg">
            <div className="flex items-center gap-1 text-gold-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
              ))}
              <span className="ml-2 text-xs font-bold text-white/90">{av.authExcellence || '4.9 / 5.0 Excelencia'}</span>
            </div>
            <p className="font-serif text-xl font-bold text-white leading-snug">
              {av.authQuote || '“La mejor plataforma para viajar por el Caribe y generar recompensas reales con amigos.”'}
            </p>
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/10">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-navy-900 bg-ocean-400 text-[10px] font-bold flex items-center justify-center text-white">SP</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-navy-900 bg-gold-400 text-[10px] font-bold flex items-center justify-center text-navy-950">CR</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-navy-900 bg-emerald-500 text-[10px] font-bold flex items-center justify-center text-white">AL</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {av.authTravelersCount || 'Únete a más de 2,400+ viajeros activos'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">{t('brand')}</p>
            <p className="mt-2 font-serif text-4xl font-bold leading-tight text-white">{t('auth.tagline')}</p>
            <p className="mt-2 max-w-md text-sm text-slate-300 leading-relaxed">{t('auth.taglineBody')}</p>
          </div>
        </div>
      </div>

      {/* Right form container */}
      <main id="contenido" tabIndex={-1} className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:col-span-6 lg:px-16">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-sm">
          <div className="mb-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 font-serif text-xl font-bold text-navy-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                <Compass size={18} aria-hidden="true" />
              </span>
              {t('brand')}
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold text-navy-900 tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}

          <div className="mt-7">{children}</div>

          {footer && <div className="mt-6 border-t border-sand-100 pt-5 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
