"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Headphones,
  MapPin,
  Palmtree,
  Sailboat,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/common/Reveal";
import SafeImage from "@/components/common/SafeImage";
import { AccentRule } from "@/components/common/Linework";
import BackgroundBeams from "@/components/ui/BackgroundBeams";
import OfferCard from "@/components/offers/OfferCard";
import { useLanguage } from "@/context/LanguageContext";
import { useSelector, useDispatch } from "@/store";
import { fetchOffers } from "@/store/slices/offersSlice";

// Authentic high-resolution Caribbean travel assets (served as static files)
const IMAGES = {
  hero: "/images/about/hero.jpg",
  catamaran: "/images/about/catamaran.jpg",
  colonial: "/images/about/colonial.jpg",
};

const VALUE_ICONS = [Headphones, ShieldCheck, Users, Compass];

export default function AboutContent() {
  const { t, copy, isEn } = useLanguage();
  const a = copy.about;
  const dispatch = useDispatch();

  // Load real offers from Redux store / API
  const reduxOffers = useSelector((state) => state.offers?.items || []);

  React.useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const activeOffers = (reduxOffers || []).filter(
    (o) => o && o.isActive !== false,
  );
  const displayOffers =
    activeOffers.length > 0
      ? activeOffers.slice(0, 3)
      : [];

  return (
    <div className="overflow-hidden bg-sand-50">
      {/* =========================================================================
          1. HERO SECTION — Ultra-Luxurious Caribbean Showcase
      ========================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-100/80 via-sand-50 to-white pt-12 pb-16 lg:pt-18 lg:pb-24">
        {/* Ambient atmospheric glows */}
        <div
          className="pointer-events-none absolute -left-32 -top-24 h-[36rem] w-[36rem] rounded-full bg-ocean-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 top-10 h-[36rem] w-[36rem] rounded-full bg-gold-400/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Content Column */}
            <div className="lg:col-span-6 xl:col-span-5">
              <Reveal direction="right">
                <div className="inline-flex items-center gap-2 rounded-full border border-ocean-600/20 bg-ocean-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ocean-700 shadow-xs backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-ocean-600 animate-pulse" />
                  ✦ {a.eyebrow || (isEn ? "ABOUT US" : "NOSOTROS")} ·{" "}
                  {isEn ? "EXCLUSIVE TRAVEL CLUB" : "CLUB DE VIAJES EXCLUSIVO"}
                </div>

                <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.12] text-navy-900 sm:text-5xl lg:text-5xl xl:text-6xl tracking-tight">
                  {a.title}
                </h1>

                <AccentRule className="my-5" />

                <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                  {a.desc}
                </p>

                {/* Key Trust Highlights */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 shadow-xs backdrop-blur-xs">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 shrink-0">
                      <Palmtree size={17} />
                    </span>
                    <span className="text-xs font-bold text-navy-900">
                      {isEn
                        ? "5-Star All-Inclusive Resorts"
                        : "Resorts 5★ Todo Incluido"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 shadow-xs backdrop-blur-xs">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-600 shrink-0">
                      <Award size={17} />
                    </span>
                    <span className="text-xs font-bold text-navy-900">
                      {isEn
                        ? "100% L1 & 50% L2 Reward Points"
                        : "100% L1 y 50% L2 en Puntos"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 shadow-xs backdrop-blur-xs">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <ShieldCheck size={17} />
                    </span>
                    <span className="text-xs font-bold text-navy-900">
                      {isEn
                        ? "Direct 1:1 Personal Advisor"
                        : "Asesor Personal Directo 1:1"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 shadow-xs backdrop-blur-xs">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-50 text-navy-900 shrink-0">
                      <Users size={17} />
                    </span>
                    <span className="text-xs font-bold text-navy-900">
                      {isEn
                        ? "Transparent Referral Network"
                        : "Red de Referidos Transparente"}
                    </span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="md"
                      className="rounded-xl px-6 py-2.5 text-sm font-bold shadow-soft hover:shadow-elevated transition-all"
                    >
                      <Sparkles
                        size={16}
                        className="mr-2 text-white shrink-0"
                        aria-hidden="true"
                      />
                      <span>{t("auth.join")}</span>
                    </Button>
                  </Link>
                  <Link href="/offers">
                    <Button
                      variant="secondary"
                      size="md"
                      className="rounded-xl px-6 py-2.5 text-sm font-bold border border-slate-200 bg-white hover:bg-sand-100 text-navy-900 shadow-xs transition-all hover:shadow-sm"
                    >
                      <span>{t("common.viewOffers")}</span>
                      <ArrowRight size={15} className="ml-2 text-ocean-600" />
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Visual Column — Modern Floating Multi-Layer Showcase */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                {/* Background decorative soft frame */}
                <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-ocean-500/10 via-gold-400/10 to-transparent blur-xl" />

                <div className="relative grid grid-cols-12 gap-4 items-center">
                  {/* Master Main Image: Punta Cana Luxury Resort */}
                  <Reveal
                    direction="scale"
                    delay={120}
                    className="col-span-12 sm:col-span-8"
                  >
                    <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white p-2.5 shadow-xl transition-all duration-300 hover:shadow-2xl">
                      <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-2xl bg-sand-200">
                        <SafeImage
                          src={IMAGES.hero}
                          alt="Punta Cana Luxury Beachfront Resort"
                          priority
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient lighting overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

                        {/* Floating Glassmorphic Badge Bottom */}
                        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-navy-950/75 p-3.5 text-white backdrop-blur-md border border-white/10 shadow-lg">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-300">
                                📍 Punta Cana, R.D.
                              </p>
                              <p className="text-sm font-bold text-white">
                                {isEn
                                  ? "5-Star Beachfront Luxury Resort"
                                  : "Resort 5★ Frente al Mar"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg bg-gold-400/20 px-2 py-1 text-gold-300 border border-gold-400/30 shrink-0">
                              <Star
                                size={13}
                                className="fill-gold-400 text-gold-400"
                              />
                              <span className="text-xs font-extrabold">
                                4.9
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Secondary Staggered Floating Cards (Catamaran & Colonial Santo Domingo) */}
                  <div className="col-span-12 sm:col-span-4 flex sm:flex-col gap-4">
                    {/* Saona Island Catamaran Floating Card */}
                    <Reveal direction="left" delay={200} className="flex-1">
                      <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-200">
                          <SafeImage
                            src={IMAGES.catamaran}
                            alt="Luxury Catamaran Cruise near Saona Island"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-navy-950/70 px-2.5 py-1.5 backdrop-blur-sm border border-white/10">
                            <p className="text-[10px] font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1">
                              <Sailboat size={11} /> Saona Island
                            </p>
                            <p className="text-xs font-bold text-white truncate">
                              {isEn ? "Private Catamaran" : "Catamarán Privado"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>

                    {/* Zona Colonial Santo Domingo Floating Card */}
                    <Reveal direction="left" delay={260} className="flex-1">
                      <div className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-200">
                          <SafeImage
                            src={IMAGES.colonial}
                            alt="Historic Zona Colonial in Santo Domingo"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-navy-950/70 px-2.5 py-1.5 backdrop-blur-sm border border-white/10">
                            <p className="text-[10px] font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1">
                              <MapPin size={11} /> Santo Domingo
                            </p>
                            <p className="text-xs font-bold text-white truncate">
                              {isEn ? "Colonial Heritage" : "Cultura Colonial"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. OUR STORY — Editorial Magazine Layout
      ========================================================================== */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Story Imagery */}
            <div className="lg:col-span-6">
              <Reveal direction="scale">
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  {/* Subtle accent border card */}
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3 shadow-xl">
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-2xl bg-sand-200">
                      <SafeImage
                        src={IMAGES.colonial}
                        alt="Santo Domingo Colonial Heritage"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                        <p className="text-xs font-extrabold text-navy-900">
                          🇩🇴{" "}
                          {isEn
                            ? "Founded in the Dominican Republic"
                            : "Fundada en República Dominicana"}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {isEn
                            ? "Santo Domingo · Punta Cana · Puerto Plata"
                            : "Santo Domingo · Punta Cana · Puerto Plata"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-6">
              <Reveal delay={80}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 border border-ocean-600/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-ocean-700">
                  <Sparkles
                    size={12}
                    className="text-ocean-600"
                    aria-hidden="true"
                  />
                  {a.storyEyebrow || (isEn ? "OUR STORY" : "NUESTRA HISTORIA")}
                </span>

                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
                  {a.storyTitle}
                </h2>

                <AccentRule className="my-5" />

                <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
                  {a.storyBody}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                  {a.storyBody2}
                </p>

                {/* Key Commitments Checklist */}
                <div className="mt-8 space-y-3.5 border-t border-slate-100 pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-ocean-600 shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-medium text-slate-700">
                      <strong className="text-navy-900">
                        {isEn
                          ? "Zero Anonymous Carts"
                          : "Cero carritos impersonales"}
                        :
                      </strong>{" "}
                      {isEn
                        ? "Every reservation is tailored directly with professional destination specialists."
                        : "Cada viaje es gestionado personalmente por un asesor de viajes dedicado."}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-ocean-600 shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-medium text-slate-700">
                      <strong className="text-navy-900">
                        {isEn
                          ? "Merit-Based Rewards"
                          : "Recompensas por mérito"}
                        :
                      </strong>{" "}
                      {isEn
                        ? "Clear referral levels (100% on Level 1, 50% on Level 2) that turn travel into points."
                        : "Niveles transparentes (100% en Nivel 1 y 50% en Nivel 2) que transforman viajes en puntos."}
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="text-ocean-600 shrink-0 mt-0.5"
                    />
                    <p className="text-sm font-medium text-slate-700">
                      <strong className="text-navy-900">
                        {isEn ? "Complete Flexibility" : "Flexibilidad total"}:
                      </strong>{" "}
                      {isEn
                        ? "Redeem points easily for real vacation credits starting from just 50 points."
                        : "Canjea tus puntos acumulados por créditos de viaje a partir de solo 50 puntos."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PURPOSE — Mission & Vision Dual Luxury Cards
      ========================================================================== */}
      <section className="bg-sand-100/70 py-16 lg:py-24 border-y border-sand-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-ocean-800">
                <Sparkles
                  size={12}
                  className="text-ocean-600"
                  aria-hidden="true"
                />
                {a.purposeEyebrow || (isEn ? "PURPOSE" : "PROPÓSITO")}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {a.purposeTitle}
              </h2>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission Card (Ivory / Clean Luxury) */}
            <Reveal delay={100} className="h-full">
              <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs">
                      <Compass size={26} />
                    </span>
                    <span className="rounded-full bg-gold-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-800">
                      {a.mission}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
                    {a.missionLead}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {a.missionBody}
                  </p>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5 flex items-center gap-2 text-xs font-bold text-ocean-700">
                  <CheckCircle2 size={16} className="text-ocean-600" />
                  <span>
                    {isEn
                      ? "High standards in hotels & private transfers"
                      : "Altos estándares en hoteles y traslados privados"}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Vision Card (Obsidian / High Luxury) */}
            <Reveal delay={180} className="h-full">
              <div className="h-full rounded-3xl border border-navy-900 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 p-8 sm:p-10 text-white shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-400/15 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-navy-950 border border-gold-400 shadow-xs">
                      <Sparkles size={26} />
                    </span>
                    <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 border border-white/10 backdrop-blur-sm">
                      {a.vision}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-white sm:text-3xl">
                    {a.visionLead}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-300">
                    {a.visionBody}
                  </p>
                </div>

                <div className="relative z-10 mt-8 border-t border-white/10 pt-5 flex items-center gap-2 text-xs font-bold text-gold-300">
                  <Star size={16} className="text-gold-400 fill-gold-400" />
                  <span>
                    {isEn
                      ? "The premier Caribbean community & referral model"
                      : "El modelo de comunidad y referidos líder en el Caribe"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CORE VALUES — 4 Interactive Pillars
      ========================================================================== */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-navy-900">
                <Sparkles
                  size={12}
                  className="text-ocean-600"
                  aria-hidden="true"
                />
                {a.why}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {a.valuesTitle}
              </h2>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map(([title, body], i) => {
              const Icon = VALUE_ICONS[i] || Compass;
              return (
                <Reveal key={title} delay={i * 90} className="h-full">
                  <div className="group h-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs group-hover:scale-105 transition-transform">
                          <Icon size={22} aria-hidden="true" />
                        </span>
                        <span className="font-serif text-3xl font-bold text-slate-200 group-hover:text-ocean-600/30 transition-colors">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 font-serif text-xl font-bold text-navy-900">
                        {title}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                        {body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FEATURED TRAVEL OFFERS — Real Catalog Offers (Shown only when offers exist)
      ========================================================================== */}
      {displayOffers.length > 0 && (
        <section className="bg-sand-100/60 py-16 lg:py-24 border-t border-sand-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-50 border border-ocean-600/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-ocean-700">
                  <Palmtree
                    size={12}
                    className="text-ocean-600"
                    aria-hidden="true"
                  />
                  {isEn ? "FEATURED OFFERS" : "OFERTAS DESTACADAS"}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                  {isEn
                    ? "Experience the Real Caribbean"
                    : "Vive la Experiencia Real del Caribe"}
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  {isEn
                    ? "Explore our premier travel packages with exclusive membership points rewards."
                    : "Descubre nuestros paquetes de viaje más solicitados con recompensas exclusivas en puntos."}
                </p>
                <AccentRule className="mx-auto mt-4 mb-10" />
              </div>
            </Reveal>

            {/* Real Travel Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayOffers.map((offer, idx) => (
                <Reveal
                  key={offer.id || offer._id || offer.slug || idx}
                  delay={idx * 80}
                >
                  <OfferCard offer={offer} basePath="/offers" />
                </Reveal>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/offers">
                <Button
                  variant="secondary"
                  size="md"
                  className="rounded-xl px-6 py-2.5 text-sm font-bold border border-slate-200 bg-white hover:bg-sand-100 text-navy-900 shadow-xs transition-all hover:shadow-sm"
                >
                  <span>
                    {isEn
                      ? "View All Travel Offers"
                      : "Ver Todas las Ofertas de Viaje"}
                  </span>
                  <ArrowRight size={15} className="ml-2 text-ocean-600" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          6. FINAL CALL TO ACTION
      ========================================================================== */}
      <section
        id="contacto"
        className="relative overflow-hidden bg-sand-50 py-16 lg:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="scale" delay={100}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 px-6 py-14 text-center text-white shadow-2xl border border-gold-400/20 sm:px-12 sm:py-18">
              <BackgroundBeams />
              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-gold-300 border border-gold-400/30">
                  <MapPin size={13} className="text-gold-400" />
                  {a.location || "Santo Domingo, República Dominicana"}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-5xl text-white tracking-tight">
                  {a.ready}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
                  {a.readyBody}
                </p>
                <p className="mt-2 text-xs text-slate-400">{a.hours}</p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="md"
                      className="rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles
                        size={15}
                        className="text-white shrink-0 mr-1.5"
                        aria-hidden="true"
                      />
                      <span>{t("auth.join")}</span>
                    </Button>
                  </Link>
                  <Link href="/offers">
                    <Button
                      variant="outline"
                      size="md"
                      className="rounded-xl border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-md shadow-sm transition-all hover:bg-white/20 hover:border-white/50 hover:text-white"
                    >
                      {t("common.viewOffers")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
