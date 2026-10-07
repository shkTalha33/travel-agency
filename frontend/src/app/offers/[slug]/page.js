'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, X, Clock, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import PublicShell from '@/components/layout/PublicShell';
import OfferCard from '@/components/offers/OfferCard';
import SafeImage from '@/components/common/SafeImage';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CardSpotlight from '@/components/ui/CardSpotlight';
import { AccentRule } from '@/components/common/Linework';
import { TRAVEL_OFFERS, localizeOffer } from '@/data/offers';
import { useLanguage } from '@/context/LanguageContext';

export default function OfferDetailPage({ params }) {
  const { t, locale, copy } = useLanguage();
  const rawOffer = TRAVEL_OFFERS.find((o) => o.slug === params.slug);
  if (!rawOffer) notFound();

  const offer = localizeOffer(rawOffer, locale);
  const related = TRAVEL_OFFERS.filter((o) => o.id !== rawOffer.id).slice(0, 3);
  const d = copy.offerDetail || {};

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: d.breadcrumbHome || 'Inicio', href: '/' },
            { label: d.breadcrumbOffers || 'Ofertas', href: '/offers' },
            { label: offer.destination },
          ]}
        />

        {/* Luxury Asymmetrical Photo Grid with light gray border & rounded corners */}
        <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-sm">
          <div className="grid gap-3 overflow-hidden rounded-2xl md:h-[28rem] md:grid-cols-4 md:grid-rows-2">
            {offer.gallery.slice(0, 4).map((src, i) => (
              <div key={src} className={`relative overflow-hidden rounded-xl group bg-sand-200 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <SafeImage
                  src={src}
                  alt={`${offer.destination}, ${i + 1}`}
                  className="h-full min-h-40 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <header>
              <div className="flex items-center gap-2">
                {offer.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-gold-300 shadow-sm border border-gold-400/30">
                    <Sparkles size={11} className="text-gold-400" />
                    {offer.badge}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs font-semibold text-ocean-700">
                  <MapPin size={13} aria-hidden="true" />
                  {offer.destination}, {offer.country}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl leading-tight">
                {offer.title}
              </h1>
              <AccentRule className="my-4" />

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1 rounded-lg bg-sand-100 px-2.5 py-1">
                  <Clock size={13} className="text-ocean-600" aria-hidden="true" />
                  {offer.duration}
                </span>
                <span className="rounded-lg bg-sand-100 px-2.5 py-1 text-slate-700">
                  {offer.hotelCategory}
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-700">{offer.description}</p>
            </header>

            {/* Highlights */}
            {offer.highlights && offer.highlights.length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">{d.highlightsTitle || 'Lo más destacado'}</h2>
                <ul className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  {offer.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ocean-100 text-ocean-700 mt-0.5">
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Inclusions / Exclusions */}
            <section className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  {d.includedTitle || 'Qué incluye'}
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {(offer.included || []).map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-3">{d.notIncludedTitle || 'Qué no incluye'}</h2>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {(offer.notIncluded || []).map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <X size={15} className="mt-0.5 shrink-0 text-rose-500" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Itinerary Timeline */}
            {offer.itinerary && offer.itinerary.length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">{d.itineraryTitle || 'Itinerario de viaje'}</h2>
                <ol className="relative space-y-6 border-l-2 border-ocean-300/60 pl-6 sm:pl-8 ml-3">
                  {offer.itinerary.map((dItem) => (
                    <li key={dItem.day} className="relative">
                      <span className="absolute -left-[2.15rem] sm:-left-[2.65rem] top-0 flex h-7 w-7 items-center justify-center rounded-xl bg-navy-900 text-xs font-bold text-gold-300 shadow-sm border border-gold-400/40" aria-hidden="true">
                        0{dItem.day}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-navy-900">
                        <span className="sr-only">{(d.dayPrefix || 'Día')} {dItem.day}: </span>
                        {dItem.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{dItem.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Aceternity CardSpotlight Booking Aside */}
          <aside className="lg:sticky lg:top-24">
            <CardSpotlight
              color="rgba(212, 180, 90, 0.2)"
              radius={280}
              className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{d.specialPriceFrom || 'Precio especial desde'}</p>
              <p className="font-serif text-4xl font-bold text-navy-900 mt-1">${offer.priceUSD.toLocaleString('en-US')}</p>
              <p className="mt-1 text-xs text-slate-500">{(d.perPerson || 'por persona')} · {offer.duration}</p>

              <div className="mt-5 rounded-2xl border border-ocean-200 bg-ocean-50 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-ocean-600" />
                  <span className="text-xs font-bold text-ocean-900">{d.referralReward || 'Recompensa de Referido'}</span>
                </div>
                <Badge variant="ocean" size="sm">+{offer.pointsReward} {copy.common.pts}</Badge>
              </div>

              <Link href="/register" className="mt-6 block">
                <Button variant="primary" size="lg" className="w-full rounded-2xl py-4 font-bold shadow-md hover:shadow-lg transition-all">
                  <Sparkles size={16} className="mr-2 text-white shrink-0" aria-hidden="true" />
                  <span>{d.bookVipBtn || 'Quiero esta oferta VIP'}</span>
                </Button>
              </Link>
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                {d.noOnlinePaymentHint || '🔒 Sin pagos en línea. Al registrarte, un asesor oficial coordinará los detalles de tu estancia contigo.'}
              </p>
            </CardSpotlight>
          </aside>
        </div>

        {/* Related Offers */}
        <section className="mt-20 border-t border-sand-200/80 pt-16" aria-labelledby="relacionadas">
          <h2 id="relacionadas" className="font-serif text-3xl font-bold text-navy-900 mb-8">{d.relatedTitle || 'Otras experiencias destacadas'}</h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{related.map((o) => <OfferCard key={o.id} offer={o} />)}</div>
        </section>
      </div>
    </PublicShell>
  );
}
