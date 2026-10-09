'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  ArrowLeft, 
  Gift, 
  PhoneCall, 
  Building
} from 'lucide-react';
import OfferCard from '@/components/offers/OfferCard';
import OfferImageGallery from '@/components/offers/OfferImageGallery';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CardSpotlight from '@/components/ui/CardSpotlight';
import { AccentRule } from '@/components/common/Linework';
import { TRAVEL_OFFERS, localizeOffer } from '@/data/offers';
import { getCountryFlag } from '@/data/countries';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { offersApi } from '@/lib/apiClient';

function findLocalOffer(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();

  // 1. Direct match
  let found = TRAVEL_OFFERS.find(
    (o) =>
      o.slug === clean ||
      o.id === clean ||
      o._id === clean ||
      (o.aliases && o.aliases.includes(clean))
  );
  if (found) return found;

  // 2. Substring match
  found = TRAVEL_OFFERS.find(
    (o) =>
      (o.slug && (clean.includes(o.slug) || o.slug.includes(clean))) ||
      (o.id && (clean.includes(o.id) || o.id.includes(clean))) ||
      (o.aliases && o.aliases.some((a) => clean.includes(a) || a.includes(clean)))
  );
  if (found) return found;

  // 3. Token match
  const words = clean
    .split(/[-_+\s]+/)
    .filter((w) => w.length > 2 && !['and', 'the', 'del', 'los', 'las', 'por', 'con', 'para'].includes(w));

  if (words.length > 0) {
    found = TRAVEL_OFFERS.find((o) => {
      const searchTarget = `${o.slug} ${o.id} ${o.title} ${o.destination} ${o.country || ''} ${o.en?.title || ''} ${o.en?.destination || ''} ${(o.aliases || []).join(' ')}`.toLowerCase();
      return words.some((w) => searchTarget.includes(w));
    });
  }

  return found || null;
}

export default function DashboardOfferDetailPage({ params }) {
  const { t, locale, copy, isEn } = useLanguage();
  const { currentUser } = useAuth();
  const routeParams = useParams();
  const rawSlug = routeParams?.slug || params?.slug || '';
  const slug = typeof rawSlug === 'string' ? decodeURIComponent(rawSlug) : '';

  const [rawOffer, setRawOffer] = useState(() => findLocalOffer(slug));
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
        console.warn('Could not fetch offer from API in dashboard, checking local data:', err?.message || err);
      }

      const local = findLocalOffer(slug);
      if (isMounted) {
        if (local) {
          setRawOffer(local);
          setRelatedOffers(TRAVEL_OFFERS.filter((o) => o.slug !== local.slug && o.id !== local.id).slice(0, 3));
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
      <div className="mx-auto max-w-7xl px-4 py-28 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-ocean-600" />
        <p className="text-sm font-semibold text-slate-600">
          {locale === 'en' ? 'Loading travel offer details...' : 'Cargando detalles de la oferta de viaje...'}
        </p>
      </div>
    );
  }

  if (notFoundState || !rawOffer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
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
          href="/dashboard/offers"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy-950 text-gold-300 font-bold text-xs hover:bg-navy-900 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'en' ? 'Explore All Offers' : 'Explorar Todas las Ofertas'}</span>
        </Link>
      </div>
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

  const userStats = currentUser?.stats || currentUser?.pointsStats || {};
  const userPoints = userStats.availablePoints || 0;

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 space-y-10">
      {/* Luxury Interactive Photo Carousel & Thumbnails */}
      <OfferImageGallery images={galleryImages} title={offer.destination || offer.title} />

      <div className="grid gap-10 lg:grid-cols-3">
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

        {/* Aside Booking / Points Redemption Card */}
        <aside className="lg:sticky lg:top-8 space-y-6">
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

            {/* Direct Action Area */}
            <div className="mt-6 space-y-3">
              <Link href={`/dashboard/redeem?offer=${encodeURIComponent(offer.title)}`} className="block">
                <Button variant="primary" size="lg" className="w-full rounded-2xl py-3.5 font-bold shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-ocean-700 via-ocean-600 to-ocean-800 text-white">
                  <Gift size={16} className="mr-2 text-gold-300 shrink-0" aria-hidden="true" />
                  <span>{locale === 'en' ? 'Redeem Points for this Trip' : 'Redimir Puntos para este Viaje'}</span>
                </Button>
              </Link>
              <p className="text-center text-[11px] text-slate-500 font-medium">
                {locale === 'en'
                  ? `Available: ${userPoints} PTS • Min. 50 PTS per redemption`
                  : `Disponibles: ${userPoints} PTS • Mínimo 50 PTS por solicitud`}
              </p>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hola, soy miembro de Círculo Wingding y deseo coordinar la reserva de la oferta: ${offer.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block pt-1"
              >
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white text-navy-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-sand-50 shadow-xs transition-all"
                >
                  <PhoneCall size={14} className="text-ocean-600 shrink-0" />
                  <span>{locale === 'en' ? 'Contact VIP Concierge' : 'Contactar Asesor VIP'}</span>
                </button>
              </a>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
              {d.noOnlinePaymentHint ||
                '🔒 Sin pagos en línea. Al solicitar tu viaje o canje, un asesor oficial coordinará los detalles de tu estancia contigo.'}
            </p>
          </CardSpotlight>
        </aside>
      </div>

      {/* Related Offers */}
      {fallbackRelated.length > 0 && (
        <section className="mt-16 border-t border-sand-200/80 pt-12" aria-labelledby="relacionadas">
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
  );
}
