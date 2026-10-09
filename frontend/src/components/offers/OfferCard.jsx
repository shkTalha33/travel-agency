'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import SafeImage from '@/components/common/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import { localizeOffer } from '@/data/offers';
import { getCountryFlag } from '@/data/countries';

/** Presentational: receives a single `offer` object via props (backend-ready). */
export default function OfferCard({ offer, basePath }) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const o = localizeOffer(offer, locale);

  const locationText = o.destination && o.country
    ? `${o.destination}, ${o.country}`
    : o.destination || o.country || '';

  const prefix = basePath || (pathname?.startsWith('/dashboard') ? '/dashboard/offers' : '/offers');
  const offerTarget = `${prefix}/${encodeURIComponent(o.slug || o._id || o.id || '')}`;

  return (
    <Link
      href={offerTarget}
      className="lift group block rounded-3xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200">
        <SafeImage
          src={o.image}
          alt={`${t('common.viewOf')} ${o.destination || o.title}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-black/20" />

        {o.badge && (
          <div className="absolute left-3.5 top-3.5">
            <span className="inline-flex items-center rounded-full bg-navy-900/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md shadow-sm border border-gold-400/30">
              {o.badge}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/10 truncate">
            <span className="text-sm leading-none shrink-0" role="img" aria-label={o.country}>
              {getCountryFlag(o.country)}
            </span>
            <MapPin size={12} className="text-ocean-300 shrink-0" aria-hidden="true" />
            <span className="truncate">{locationText}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md shrink-0">
            <Clock size={11} aria-hidden="true" />
            {o.duration}
          </span>
        </div>
      </div>

      <div className="px-1.5 pt-4 pb-1">
        <h3 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-navy-900 group-hover:text-ocean-700 transition-colors">
          {o.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {o.summary}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-sand-100 pt-3.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {t('common.from')}
            </p>
            <p className="font-serif text-2xl font-bold text-navy-900">
              ${o.priceUSD.toLocaleString('en-US')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center gap-1 rounded-full border border-ocean-200 bg-ocean-50 px-2.5 py-0.5 text-xs font-bold text-ocean-800 shadow-xs">
              <Sparkles size={11} className="text-ocean-600" aria-hidden="true" />
              <span>+{o.pointsReward} {t('common.points')}</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-ocean-700 group-hover:translate-x-0.5 transition-transform">
              {t('common.viewOffer')}
              <ArrowRight size={13} aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
