'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Compass, Headphones, MapPin, Palmtree, Search, Share2, Shield, Sparkles, TrendingUp, UserPlus, Users } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import OfferCard from '@/components/offers/OfferCard';
import MembershipCard from '@/components/membership/MembershipCard';
import Reveal from '@/components/common/Reveal';
import Button from '@/components/ui/Button';
import Accordion from '@/components/ui/Accordion';
import { AccentRule } from '@/components/common/Linework';
import InfiniteMovingCards from '@/components/ui/InfiniteMovingCards';
import BackgroundBeams from '@/components/ui/BackgroundBeams';
import { BentoGridItem } from '@/components/ui/BentoGrid';
import HoverEffect from '@/components/ui/CardHoverEffect';
import FlipWords from '@/components/ui/FlipWords';
import AnimatedTooltip from '@/components/ui/AnimatedTooltip';
import { TRAVEL_OFFERS } from '@/data/offers';
import { MEMBERSHIP_LEVELS } from '@/data/memberships';
import { FAQ_DATA } from '@/data/faqs';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchOffers } from '@/store/slices/offersSlice';

const TRUST_ICONS = [Headphones, Shield, Users];

const HERO_PEOPLE = [
  {
    name: 'Carlos Mendoza',
    role: 'Embajador Élite · Santo Domingo',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Valeria Santos',
    role: 'Miembro VIP · Santiago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Alejandro Ramos',
    role: 'Embajador · Miami',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Elena Peña',
    role: 'Viajera Frecuente · Madrid',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  },
];

const DESTINATION_WORDS = [
  'Punta Cana',
  'Samaná',
  'Cartagena',
  'Bayahíbe',
  'Cap Cana',
  'Cancún',
];

const TESTIMONIALS = {
  es: [
    {
      quote: 'Invité a 4 amigos de mi empresa para sus vacaciones en Punta Cana y acumulé 600 puntos suficientes para mi propia estancia en Samaná gratis.',
      name: 'Carlos Mendoza',
      role: 'Embajador · Santo Domingo',
      tag: 'Embajador Activo',
      pointsEarned: '600',
      initials: 'CM',
    },
    {
      quote: 'La atención personalizada y las tarifas exclusivas para miembros son insuperables. El sistema de referidos es transparente y paga al instante.',
      name: 'Valeria Santos',
      role: 'Miembro VIP · Santiago',
      tag: 'Miembro Activo',
      pointsEarned: '350',
      initials: 'VS',
    },
    {
      quote: 'Como Embajador Élite recibo un 15% de cada reserva de mis referidos de primer nivel y 5% de segundo nivel. Es una auténtica red de viajes de lujo.',
      name: 'Alejandro Ramos',
      role: 'Embajador Élite · Miami',
      tag: 'Top Tier Élite',
      pointsEarned: '1,850',
      initials: 'AR',
    },
    {
      quote: 'El resort en Bayahíbe superó todas nuestras expectativas. Además, mi patrocinador me ayudó en cada paso del canje de puntos.',
      name: 'Elena Peña',
      role: 'Viajera Frecuente · Madrid',
      tag: 'Viajero Verificado',
      pointsEarned: '220',
      initials: 'EP',
    },
  ],
  en: [
    {
      quote: 'I invited 4 colleagues for their vacation in Punta Cana and accumulated 600 points, which covered my own stay in Samaná for free.',
      name: 'Carlos Mendoza',
      role: 'Ambassador · Santo Domingo',
      tag: 'Active Ambassador',
      pointsEarned: '600',
      initials: 'CM',
    },
    {
      quote: 'The personalized advice and exclusive member rates are unmatched. The referral system is transparent and rewards instantly.',
      name: 'Valeria Santos',
      role: 'VIP Member · Santiago',
      tag: 'Active Member',
      pointsEarned: '350',
      initials: 'VS',
    },
    {
      quote: 'As an Elite Ambassador, I receive 100% of my direct referral points and 50% from level two. It is a genuine luxury travel community.',
      name: 'Alejandro Ramos',
      role: 'Elite Ambassador · Miami',
      tag: 'Elite Top Tier',
      pointsEarned: '1,850',
      initials: 'AR',
    },
    {
      quote: 'The resort in Bayahíbe exceeded all our expectations. Plus, my sponsor guided me through every step of redeeming my points.',
      name: 'Elena Peña',
      role: 'Frequent Traveler · Madrid',
      tag: 'Verified Traveler',
      pointsEarned: '220',
      initials: 'EP',
    },
  ],
};

export default function HomeContent() {
  const { copy, faqs, locale } = useLanguage();
  const dispatch = useDispatch();
  const dynamicOffers = useSelector((state) => state.offers.items);

  React.useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const h = copy.home;
  const ext = h.extra || {};
  const faqItems = FAQ_DATA.slice(0, 5).map((item) => ({ id: item.id, ...faqs[item.id] }));
  const testimonialItems = TESTIMONIALS[locale] || TESTIMONIALS.es;

  const featuredOffers =
    dynamicOffers && dynamicOffers.length > 0
      ? dynamicOffers.slice(0, 3)
      : TRAVEL_OFFERS.slice(0, 3);

  return (
    <>
      {/* Luxury Caribbean Hero Section */}
      <section className="relative overflow-hidden bg-sand-50 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-ocean-200/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-gold-200/35 blur-3xl" aria-hidden="true" />

        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:radial-gradient(ellipse_85%_70%_at_50%_40%,#000_25%,transparent_90%)]" aria-hidden="true">
          <svg className="absolute h-full w-full stroke-sand-300/80" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="hero-luxury-lattice" width="44" height="44" patternUnits="userSpaceOnUse" x="50%" y="-1">
                <path d="M.5 44V.5H44" fill="none" strokeDasharray="3 3" strokeWidth="0.8" />
                <circle cx="22" cy="22" r="1.5" fill="#CD9B6C" fillOpacity="0.45" />
                <path d="M22 18v8M18 22h8" stroke="#B87B42" strokeWidth="0.6" strokeOpacity="0.35" strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-luxury-lattice)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <div className="hero-animate-1 inline-flex items-center gap-2 rounded-full border border-ocean-300/70 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ocean-800 shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-ocean-600 animate-pulse" />
            ✦ {h.eyebrow}
          </div>

          {/* Grand Editorial Headline */}
          <h1 className="hero-animate-2 mt-6 font-serif text-4xl font-bold leading-[1.12] text-navy-900 sm:text-6xl lg:text-7xl tracking-tight max-w-4xl mx-auto">
            {h.titleA}{' '}
            <span className="text-ocean-700 underline decoration-gold-400/60 decoration-wavy decoration-2">
              <FlipWords words={DESTINATION_WORDS} duration={2600} />
            </span>
            <br />
            {h.titleC}
          </h1>

          {/* Subtitle */}
          <p className="hero-animate-3 mt-6 max-w-2xl mx-auto text-base leading-relaxed text-slate-600 sm:text-lg">
            {h.subtitle}
          </p>

          {/* Interactive Luxury Travel Discovery Bar */}
          <div className="hero-animate-4 mt-10 mx-auto max-w-4xl rounded-3xl border border-sand-300/80 bg-white/95 p-3 shadow-card ring-1 ring-black/[0.03] backdrop-blur-md">
            <div className="grid grid-cols-1 divide-y divide-sand-100 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-sand-200">
              {/* Segment 1: Destination */}
              <div className="flex items-center gap-3 p-3 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/30 shadow-xs">
                  <MapPin size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{ext.destinationLabel || 'Destino'}</p>
                  <p className="truncate text-sm font-bold text-navy-900">{ext.destinationValue || 'Punta Cana & Caribe'}</p>
                </div>
              </div>

              {/* Segment 2: Experience Type */}
              <div className="flex items-center gap-3 p-3 text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/30 shadow-xs">
                  <Palmtree size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{ext.experienceLabel || 'Experiencia'}</p>
                  <p className="truncate text-sm font-bold text-navy-900">{ext.experienceValue || 'Resorts & Villas VIP'}</p>
                </div>
              </div>

              {/* Segment 3: Reward CTA */}
              <div className="flex items-center justify-between gap-3 p-2.5 sm:pl-4">
                <div className="hidden md:block text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">{ext.vipRewardsLabel || 'Recompensas VIP'}</p>
                  <p className="text-xs font-bold text-navy-900">{ext.vipRewardsValue || 'Hasta 15% en Puntos'}</p>
                </div>
                <Link href="/offers" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full rounded-2xl px-5 py-3 font-bold shadow-soft hover:shadow-elevated transition-all">
                    <Search size={15} className="shrink-0 text-white" />
                    <span>{copy.common.viewOffers}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Popular Destination Pills */}
          <div className="hero-animate-5 mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-slate-400 mr-1 hidden sm:inline">{copy.common.popularDestinations || 'Destinos populares:'}</span>
            {[
              { name: 'Punta Cana', pts: '450 pts' },
              { name: 'Samaná Bay', pts: '520 pts' },
              { name: 'Cap Cana Marina', pts: '680 pts' },
              { name: 'Bayahíbe', pts: '380 pts' },
            ].map((d) => (
              <Link
                key={d.name}
                href="/offers"
                className="inline-flex items-center gap-1.5 rounded-full border border-sand-200/90 bg-white/80 px-3 py-1.5 transition-all hover:border-ocean-400 hover:bg-white hover:text-navy-900 shadow-xs"
              >
                <span>{d.name}</span>
                <span className="rounded-full bg-ocean-50 px-1.5 py-0.2 text-[10px] font-bold text-ocean-700">
                  {d.pts}
                </span>
              </Link>
            ))}
          </div>

          {/* Social Proof & Trust Card with AnimatedTooltip */}
          <div className="hero-animate-6 mt-10 inline-flex flex-wrap items-center justify-center gap-6 rounded-3xl border border-sand-200/90 bg-white/90 px-6 py-3.5 shadow-soft backdrop-blur-md">
            <AnimatedTooltip items={HERO_PEOPLE} />
            <div className="text-left text-xs border-l border-sand-200 pl-4">
              <div className="flex items-center gap-1.5 font-bold text-navy-900">
                <span className="text-gold-500">★ ★ ★ ★ ★</span>
                <span>4.9/5</span>
              </div>
              <p className="text-slate-500 text-[11px]">{ext.activeMembersCount || '+3,500 Miembros Activos · Sin cuotas ocultas'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — 4 in a single row with icons */}
      <section id="como-funciona" className="scroll-mt-20 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {h.howEyebrow}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {h.howTitle}
              </h2>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {h.steps.map((s, i) => {
              const StepIcons = [UserPlus, Compass, Share2, Sparkles];
              const StepIcon = StepIcons[i] || Sparkles;
              return (
                <Reveal key={s.n} delay={i * 100} className="h-full">
                  <BentoGridItem
                    stepNumber={s.n}
                    title={s.t}
                    description={s.d}
                    badge={`${copy.common.step} 0${i + 1}`}
                    icon={<StepIcon size={20} />}
                    className="h-full"
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offers Featured */}
      <section className="bg-sand-100/70 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionHeading eyebrow={h.offersEyebrow} title={h.offersTitle} />
                <AccentRule className="mt-4" />
              </div>
              <Link href="/offers"><Button variant="secondary" className="rounded-2xl">{copy.common.allOffers}</Button></Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOffers.map((o, i) => (
              <Reveal key={o._id || o.id || o.slug || i} delay={i * 120}>
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-slate-500 sm:text-left">{h.offersNote}</p>
        </div>
      </section>

      {/* Memberships */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <SectionHeading eyebrow={h.membershipEyebrow} title={h.membershipTitle} description={h.membershipDesc} align="center" />
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(MEMBERSHIP_LEVELS).map((l, i) => (
              <Reveal key={l.id} delay={i * 80}>
                <MembershipCard level={l} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Live Payouts Marquee (Aceternity InfiniteMovingCards) */}
      <section className="overflow-hidden bg-sand-100/80 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ocean-800">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {ext.communityStoriesPill || 'Experiencias y Recompensas'}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
                {ext.communityStoriesTitle || 'Historias reales de nuestra comunidad'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {ext.communityStoriesSubtitle || 'Descubre cómo nuestros miembros viajan por el Caribe y acumulan puntos cada mes.'}
              </p>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-8 flex justify-center">
              <InfiniteMovingCards items={testimonialItems} direction="left" speed="normal" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Referral System Highlights */}
      <section className="relative overflow-hidden bg-navy-950 py-14 text-white lg:py-20">
        <BackgroundBeams />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal direction="right">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{h.referralEyebrow}</p>
              <AccentRule className="my-4 text-gold-400" />
              <h2 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">{h.referralTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-slate-300">{h.referralBody}</p>
            </div>
          </Reveal>
          
          <Reveal direction="left" delay={150}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
              <h3 className="font-serif text-xl font-bold text-gold-300 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-gold-400" aria-hidden="true" />
                {h.referralExample}
              </h3>
              <ol className="space-y-4">
                {[h.referralYou, h.referralL1, h.referralL2].map((label, i) => (
                  <li key={label} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-navy-900/60 p-4 transition-colors hover:bg-navy-900">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-xs font-bold text-navy-950">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{ext.autoRewardsDesc || 'Recompensas automáticas acreditadas en tu billetera digital.'}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Points Calculation Breakdown — Connected Hierarchy Flow Diagram */}
      <section className="bg-sand-50 py-14 lg:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold-200/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute left-0 bottom-0 h-80 w-80 rounded-full bg-ocean-100/30 blur-3xl" aria-hidden="true" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8 relative z-10">
          <div className="lg:col-span-5">
            <Reveal direction="right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ocean-800">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {h.pointsEyebrow}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">{h.pointsTitle}</h2>
              <AccentRule className="my-4" />
              <p className="text-base leading-relaxed text-slate-600">{h.pointsBody}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/membership">
                  <Button variant="primary" size="lg" className="rounded-2xl shadow-soft">
                    {copy.common.learnLevels}
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button variant="ghost" size="lg" className="rounded-2xl text-slate-700 hover:text-navy-900 text-sm font-bold">
                    {copy.common.allFaqs}
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal direction="left" delay={150}>
              <div className="relative py-2 sm:py-4">
                {/* Header with simulation context */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-5 mb-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 font-bold text-xs border border-gold-400/30 shadow-xs">
                      VIP
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-navy-900">{h.pointsExample}</p>
                      <p className="text-[11px] text-slate-500">{ext.commissionDistSubtitle || 'Distribución de comisiones multinivel en tiempo real'}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200/70 px-3 py-1 text-[11px] font-bold text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-600 animate-pulse" />
                    {ext.simulationPill || 'Simulación'}
                  </span>
                </div>

                {/* Connected Flow Timeline */}
                <div className="relative pl-10 sm:pl-12 space-y-6">
                  <div className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-[2px] bg-sand-300" aria-hidden="true" />

                  {/* Level 2: Person A */}
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className="absolute -left-[32px] sm:-left-[40px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 font-bold text-xs shadow-sm ring-4 ring-sand-50 border border-gold-400/30">
                      A
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-navy-900">{h.pointsA}</p>
                        <span className="rounded-full bg-sand-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-sand-300/60">
                          {copy.common.level} 2 (50%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ext.l2CommissionSub || 'Comisión por sub-referido en su red'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <strong className="font-serif text-lg font-bold text-gold-700 block">+75 {copy.common.pts}</strong>
                      <span className="text-[10px] font-semibold text-emerald-700">{ext.l2Earnings || 'Ganancia L2'}</span>
                    </div>
                  </div>

                  {/* Flow label */}
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span>↑</span>
                    <span>{ext.upwardFlow || 'Flujo de comisión ascendente (L1 → L2)'}</span>
                  </div>

                  {/* Level 1: Person B */}
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className="absolute -left-[32px] sm:-left-[40px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 font-bold text-xs shadow-sm ring-4 ring-sand-50 border border-gold-400/30">
                      B
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-navy-900">{h.pointsB}</p>
                        <span className="rounded-full bg-sand-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-sand-300/60">
                          {copy.common.level} 1 (100%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ext.l1CommissionSub || 'Comisión directa por invitar a Persona C'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <strong className="font-serif text-lg font-bold text-gold-700 block">+150 {copy.common.pts}</strong>
                      <span className="text-[10px] font-semibold text-emerald-700">{ext.l1Earnings || 'Ganancia L1'}</span>
                    </div>
                  </div>

                  {/* Flow label */}
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span>↑</span>
                    <span>{ext.tripReservationGenerated || 'Generado por la reserva de viaje'}</span>
                  </div>

                  {/* Level 0: Person C */}
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className="absolute -left-[32px] sm:-left-[40px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 font-bold text-xs shadow-sm ring-4 ring-sand-50 border border-gold-400/30">
                      C
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-navy-900">{h.pointsC}</p>
                        <span className="rounded-full bg-sand-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-sand-300/60">
                          {ext.buyerLabel || 'Comprador'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{ext.buyerDesc || 'Realiza la compra de estancia en resort'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-bold text-slate-600 block">{h.pointsOwn}</span>
                      <span className="text-[10px] font-medium text-slate-400">{ext.pointsOrigin || 'Origen de los puntos'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer summary callout */}
                <div className="mt-8 pt-5 border-t border-sand-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600 font-medium">{ext.totalDistributedLabel || 'Total comisiones repartidas en la red:'}</span>
                  <span className="font-bold text-navy-900 font-serif text-sm">
                    {ext.totalDistributedValue || '+225 puntos en total'}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee */}
      <section className="bg-sand-100/70 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {h.trustEyebrow}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {h.trustTitle}
              </h2>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <HoverEffect
              items={h.trust.map(([title, d], i) => {
                const Icon = TRUST_ICONS[i];
                return {
                  title,
                  description: d,
                  icon: <Icon size={22} aria-hidden="true" />,
                  badge: `0${i + 1}`,
                  link: '/about',
                  footer: (
                    <span className="inline-flex items-center gap-1 text-ocean-700 font-bold hover:underline">
                      {copy.common.moreAbout} <ArrowRight size={13} />
                    </span>
                  ),
                };
              })}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-50 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <SectionHeading eyebrow={h.faqEyebrow} title={h.faqTitle} align="center" />
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Accordion items={faqItems} />
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 text-center">
              <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-bold text-ocean-700 hover:underline">
                {copy.common.allFaqs}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative overflow-hidden bg-sand-50 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="scale" delay={100}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 px-6 py-14 text-center text-white shadow-2xl border border-ocean-500/20 sm:px-12 sm:py-18">
              <BackgroundBeams />
              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-ocean-300 border border-ocean-500/30">
                  <Sparkles size={13} className="text-ocean-400" />
                  {ext.exclusiveMembershipPill || 'Membresía Exclusiva'}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-5xl text-white tracking-tight">{h.ctaTitle}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">{h.ctaBody}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      className="rounded-2xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles size={16} className="text-white shrink-0" aria-hidden="true" />
                      <span>{copy.auth.join}</span>
                    </Button>
                  </Link>
                  <Link href="/membership">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-2xl border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md shadow-sm transition-all hover:bg-white/20 hover:border-white/50 hover:text-white"
                    >
                      {copy.common.learnLevels}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
