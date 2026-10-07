'use client';

import React, { useMemo, useState } from 'react';
import OfferCard from './OfferCard';
import Reveal from '@/components/common/Reveal';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { OfferCardSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useLanguage } from '@/context/LanguageContext';
import { localizeOffer } from '@/data/offers';

const PAGE_SIZE = 6;

export default function OffersExplorer({ offers }) {
  const { t, locale, copy } = useLanguage();
  const loading = useMockLoading(400);
  const [country, setCountry] = useState('todos');
  const [page, setPage] = useState(1);

  const countries = useMemo(() => [...new Set(offers.map((o) => o.country))], [offers]);
  const countryOptions = countries.map((c) => {
    const sample = offers.find((o) => o.country === c);
    return { value: c, label: localizeOffer(sample, locale).country };
  });
  const filtered = country === 'todos' ? offers : offers.filter((o) => o.country === country);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Category Pills & Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-sand-200/80 bg-white/80 p-4 shadow-soft backdrop-blur-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setCountry('todos'); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              country === 'todos'
                ? 'bg-navy-900 text-gold-300 shadow-sm'
                : 'bg-sand-100 text-slate-600 hover:bg-sand-200 hover:text-navy-900'
            }`}
          >
            {t('common.allCountries')}
          </button>
          {countryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setCountry(opt.value); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                country === opt.value
                  ? 'bg-navy-900 text-gold-300 shadow-sm'
                  : 'bg-sand-100 text-slate-600 hover:bg-sand-200 hover:text-navy-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-500" aria-live="polite">
          <strong className="text-navy-900">{filtered.length}</strong> {filtered.length === 1 ? t('common.offer') : t('common.offers')} {copy.common?.available || 'disponibles'}
        </p>
      </div>

      <div className="mt-8" aria-busy={loading}>
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <OfferCardSkeleton key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            title={t('common.noOffersTitle')}
            description={t('common.noOffersDesc')}
            actionText={t('common.seeAll')}
            onAction={() => setCountry('todos')}
          />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((o, i) => (
              <Reveal key={o.id} delay={i * 80}>
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
