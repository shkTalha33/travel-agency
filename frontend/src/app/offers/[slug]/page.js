'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, X, Clock, MapPin, Sparkles, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import PublicShell from '@/components/layout/PublicShell';
import OfferCard from '@/components/offers/OfferCard';
import SafeImage from '@/components/common/SafeImage';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CardSpotlight from '@/components/ui/CardSpotlight';
import { AccentRule } from '@/components/common/Linework';
import { TRAVEL_OFFERS, localizeOffer } from '@/data/offers';
import { getCountryFlag } from '@/data/countries';
import { useLanguage } from '@/context/LanguageContext';
import { offersApi } from '@/lib/apiClient';

export default function OfferDetailPage({ params }) {
  const { t, locale, copy } = useLanguage();
  const routeParams = useParams();
  const rawSlug = routeParams?.slug || params?.slug || '';
  const slug = typeof rawSlug === 'string' ? decodeURIComponent(rawSlug) : '';

  const [rawOffer, setRawOffer] = useState(() => {
    if (!slug) return null;
    return TRAVEL_OFFERS.find((o) => o.slug === slug || o.id === slug || o._id === slug) || null;
  });
  const [relatedOffers, setRelatedOffers] = useState([]);
  const [loading, setLoading] = useState(!rawOffer);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadOffer() {
      try {
        setLoading(true);
        const res = await offersApi.getBySlugOrId(slug);
        if (isMounted && res?.data?.offer) {
          setRawOffer(res.data.offer);
          if (res.data.relatedOffers && res.data.relatedOffers.length > 0) {
            setRelatedOffers(res.data.relatedOffers);
          }
          setNotFoundState(false);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch offer from API, checking local data:', err?.message || err);
      }

      // Check local mock data
      const local = TRAVEL_OFFERS.find(
        (o) => o.slug === slug || o.id === slug || o._id === slug
      );
      if (isMounted) {
        if (local) {
          setRawOffer(local);
          setRelatedOffers(TRAVEL_OFFERS.filter((o) => o.slug !== slug && o.id !== slug).slice(0, 3));
          setNotFoundState(false);
        } else {
          setNotFoundState(true);
        }
        setLoading(false);
      }
    }

    loadOffer();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const d = copy?.offerDetail || {};

  if (loading) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-ocean-600" />
          <p className="text-sm font-semibold text-slate-600">
            {locale === 'en' ? 'Loading travel offer details...' : 'Cargando detalles de la oferta de viaje...'}
          </p>
        </div>
      </PublicShell>
    );
  }

  if (notFoundState || !rawOffer) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sand-200 text-navy-800 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-ocean-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-2">
            {locale === 'en' ? 'Offer Not Found' : 'Oferta No Encontrada'}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {locale === 'en'
              ? 'The travel offer you are looking for does not exist or has been removed.'
              : 'La oferta de viaje que buscas no existe o ha sido trasladada.'}
          </p>
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy-950 text-gold-300 font-bold text-xs hover:bg-navy-900 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === 'en' ? 'Explore All Offers' : 'Explorar Todas las Ofertas'}</span>
          </Link>
        </div>
      </PublicShell>
    );
  }

  const offer = localizeOffer(rawOffer, locale);

  const galleryImages =
    Array.isArray(offer.gallery) && offer.gallery.length > 0
      ? offer.gallery
      : [offer.image].filter(Boolean);

  const fallbackRelated =
    relatedOffers.length > 0
      ? relatedOffers
      : TRAVEL_OFFERS.filter((o) => o.slug !== offer.slug && o.id !== offer.id).slice(0, 3);

  const locationText = offer.destination && offer.country
    ? `${offer.destination}, ${offer.country}`
    : offer.destination || offer.country || '';

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: d.breadcrumbHome || 'Inicio', href: '/' },
            { label: d.breadcrumbOffers || 'Ofertas', href: '/offers' },
            { label: offer.destination || offer.title },
          ]}
        />

        {/* Luxury Photo Display: Single Hero or Asymmetrical Grid */}
        <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-2.5 sm:p-3 shadow-sm">
          {galleryImages.length <= 1 ? (
            <div className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden rounded-2xl group bg-sand-200">
              <SafeImage
                src={galleryImages[0] || offer.image}
                alt={offer.destination || offer.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className="grid gap-3 overflow-hidden rounded-2xl md:h-[28rem] md:grid-cols-4 md:grid-rows-2">
              {galleryImages.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-xl group bg-sand-200 ${
                    i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <SafeImage
                    src={src}
                    alt={`${offer.destination || offer.title}, ${i + 1}`}
                    className="h-full min-h-40 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}
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
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ocean-700 bg-ocean-50/80 px-2.5 py-1 rounded-full border border-ocean-200/60">
                  <span className="text-sm leading-none" role="img" aria-label={offer.country}>
                    {getCountryFlag(offer.country)}
                  </span>
                  <MapPin size={13} aria-hidden="true" />
                  <span>{locationText}</span>
                </span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl leading-tight">
                {offer.title}
              </h1>
              <AccentRule className="my-4" />

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                {offer.duration && (
                  <span className="flex items-center gap-1 rounded-lg bg-sand-100 px-2.5 py-1">
                    <Clock size={13} className="text-ocean-600" aria-hidden="true" />
                    {offer.duration}
                  </span>
                )}
                {offer.hotelCategory && (
                  <span className="rounded-lg bg-sand-100 px-2.5 py-1 text-slate-700">
                    {offer.hotelCategory}
                  </span>
                )}
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-700">
                {offer.description || offer.summary}
              </p>
            </header>

            {/* Highlights */}
            {Array.isArray(offer.highlights) && offer.highlights.filter((h) => h && h.trim()).length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">
                  {d.highlightsTitle || (locale === 'en' ? 'Highlights' : 'Lo más destacado')}
                </h2>
                <ul className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  {offer.highlights
                    .filter((h) => h && h.trim())
                    .map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
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
            {((Array.isArray(offer.included) && offer.included.filter((h) => h && h.trim()).length > 0) ||
              (Array.isArray(offer.notIncluded) && offer.notIncluded.filter((h) => h && h.trim()).length > 0)) && (
              <section className="grid gap-6 sm:grid-cols-2">
                {Array.isArray(offer.included) && offer.included.filter((h) => h && h.trim()).length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      {d.includedTitle || (locale === 'en' ? 'What is included' : 'Qué incluye')}
                    </h2>
                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {offer.included
                        .filter((h) => h && h.trim())
                        .map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {Array.isArray(offer.notIncluded) && offer.notIncluded.filter((h) => h && h.trim()).length > 0 && (
                  <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-navy-900 mb-3 flex items-center gap-2">
                      <X size={18} className="text-rose-500" />
                      {d.notIncludedTitle || (locale === 'en' ? 'What is not included' : 'Qué no incluye')}
                    </h2>
                    <ul className="space-y-2.5 text-sm text-slate-700">
                      {offer.notIncluded
                        .filter((h) => h && h.trim())
                        .map((h, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X size={15} className="mt-0.5 shrink-0 text-rose-500" aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Itinerary Timeline */}
            {offer.itinerary && offer.itinerary.length > 0 && (
              <section className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">
                  {d.itineraryTitle || 'Itinerario de viaje'}
                </h2>
                <ol className="relative space-y-6 border-l-2 border-ocean-300/60 pl-6 sm:pl-8 ml-3">
                  {offer.itinerary.map((dItem, idx) => (
                    <li key={dItem.day || idx} className="relative">
                      <span
                        className="absolute -left-[2.15rem] sm:-left-[2.65rem] top-0 flex h-7 w-7 items-center justify-center rounded-xl bg-navy-900 text-xs font-bold text-gold-300 shadow-sm border border-gold-400/40"
                        aria-hidden="true"
                      >
                        {String(dItem.day || idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-navy-900">
                        <span className="sr-only">
                          {(d.dayPrefix || 'Día')} {dItem.day || idx + 1}:{' '}
                        </span>
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
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {d.specialPriceFrom || 'Precio especial desde'}
              </p>
              <p className="font-serif text-4xl font-bold text-navy-900 mt-1">
                ${(offer.priceUSD || 0).toLocaleString('en-US')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {(d.perPerson || 'por persona')} {offer.duration ? `· ${offer.duration}` : ''}
              </p>

              <div className="mt-5 rounded-2xl border border-ocean-200 bg-ocean-50 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-ocean-600" />
                  <span className="text-xs font-bold text-ocean-900">
                    {d.referralReward || 'Recompensa de Referido'}
                  </span>
                </div>
                <Badge variant="ocean" size="sm">
                  +{offer.pointsReward || 0} {copy.common?.pts || 'PTS'}
                </Badge>
              </div>

              <Link href="/register" className="mt-6 block">
                <Button variant="primary" size="lg" className="w-full rounded-2xl py-4 font-bold shadow-md hover:shadow-lg transition-all">
                  <Sparkles size={16} className="mr-2 text-white shrink-0" aria-hidden="true" />
                  <span>{d.bookVipBtn || 'Quiero esta oferta VIP'}</span>
                </Button>
              </Link>
              <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                {d.noOnlinePaymentHint ||
                  '🔒 Sin pagos en línea. Al registrarte, un asesor oficial coordinará los detalles de tu estancia contigo.'}
              </p>
            </CardSpotlight>
          </aside>
        </div>

        {/* Related Offers */}
        {fallbackRelated.length > 0 && (
          <section className="mt-20 border-t border-sand-200/80 pt-16" aria-labelledby="relacionadas">
            <h2 id="relacionadas" className="font-serif text-3xl font-bold text-navy-900 mb-8">
              {d.relatedTitle || 'Otras experiencias destacadas'}
            </h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackRelated.map((o) => (
                <OfferCard key={o.id || o._id || o.slug} offer={o} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
