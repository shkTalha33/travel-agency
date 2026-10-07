'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Headphones, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Reveal from '@/components/common/Reveal';
import SafeImage from '@/components/common/SafeImage';
import { AccentRule } from '@/components/common/Linework';
import BackgroundBeams from '@/components/ui/BackgroundBeams';
import { useLanguage } from '@/context/LanguageContext';

const VALUE_ICONS = [Headphones, ShieldCheck, Users, Compass];
const HERO = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80';
const STORY = 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80';
const SIDE = 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=80';

export default function AboutContent() {
  const { t, copy } = useLanguage();
  const a = copy.about;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-sand-50 py-14 lg:py-20">
        {/* Soft background ambient glow */}
        <div className="pointer-events-none absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-ocean-200/35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-gold-200/30 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <Reveal direction="right">
              <div className="inline-flex items-center gap-2 rounded-full border border-ocean-300/70 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ocean-800 shadow-xs backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-ocean-600 animate-pulse" />
                ✦ {a.eyebrow}
              </div>

              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-navy-900 sm:text-5xl lg:text-6xl tracking-tight">
                {a.title}
              </h1>

              <AccentRule className="my-5" />

              <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                {a.desc}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/register">
                  <Button variant="gold" size="lg" className="rounded-2xl px-7 py-3.5 font-bold shadow-soft hover:shadow-elevated transition-all">
                    <Sparkles size={16} className="mr-1.5 text-navy-950 shrink-0" aria-hidden="true" />
                    <span>{t('auth.join')}</span>
                  </Button>
                </Link>
                <Link href="/offers">
                  <Button variant="secondary" size="lg" className="rounded-2xl px-7 py-3.5 font-bold border-slate-200 shadow-xs">
                    <span>{t('common.viewOffers')}</span>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Collage Images with all 4 corners rounded and light gray borders */}
          <div className="relative grid grid-cols-5 gap-3.5 lg:col-span-6">
            <Reveal direction="scale" delay={100} className="col-span-3">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-sm hover:shadow-md transition-all">
                <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl bg-sand-200">
                  <SafeImage src={HERO} alt={a.heroAlt} priority className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
                </div>
              </div>
            </Reveal>

            <div className="col-span-2 flex flex-col gap-3.5 justify-between">
              <Reveal direction="left" delay={150} className="flex-1">
                <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative flex-1 overflow-hidden rounded-2xl bg-sand-200 min-h-[7.5rem]">
                    <SafeImage src={STORY} alt={a.storyAlt} className="h-full w-full object-cover" />
                  </div>
                </div>
              </Reveal>

              <Reveal direction="left" delay={200} className="flex-1">
                <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative flex-1 overflow-hidden rounded-2xl bg-sand-200 min-h-[7.5rem]">
                    <SafeImage src={SIDE} alt={a.northAlt} className="h-full w-full object-cover" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Key Metrics / Stats Row */}
      <section className="bg-sand-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6 divide-y divide-sand-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-sand-200">
                {a.stats.map(([n, l], idx) => (
                  <div key={l} className={`${idx !== 0 ? 'sm:pl-6' : ''} ${idx >= 2 ? 'pt-4 sm:pt-0' : ''} text-center sm:text-left`}>
                    <p className="font-serif text-3xl font-bold text-navy-900 sm:text-4xl">{n}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story / About Us Detail */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal direction="scale">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-3.5 shadow-md">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-2xl bg-sand-200">
                <SafeImage src={STORY} alt={a.storyAlt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {a.storyEyebrow}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {a.storyTitle}
              </h2>
              <AccentRule className="my-4" />
              <p className="text-base leading-relaxed text-slate-600">{a.storyBody}</p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{a.storyBody2}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Purpose: Mission & Vision Cards */}
      <section className="bg-sand-100/70 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ocean-800">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
                {a.purposeEyebrow}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                {a.purposeTitle}
              </h2>
              <AccentRule className="mx-auto mt-4 mb-10" />
            </div>
          </Reveal>

          <div className="grid gap-7 md:grid-cols-2">
            <Reveal delay={100} className="h-full">
              <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs">
                      <Compass size={22} />
                    </span>
                    <span className="rounded-full bg-gold-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-800">
                      {a.mission}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-navy-900 sm:text-3xl">{a.missionLead}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{a.missionBody}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180} className="h-full">
              <div className="h-full rounded-3xl border border-navy-900 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 p-8 sm:p-10 text-white shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-400/15 blur-2xl" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500 text-navy-950 border border-gold-400 shadow-xs">
                      <Sparkles size={22} />
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-300 border border-white/10 backdrop-blur-sm">
                      {a.vision}
                    </span>
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-bold text-white sm:text-3xl">{a.visionLead}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{a.visionBody}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values Cards */}
      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-900">
                <Sparkles size={12} className="text-ocean-600" aria-hidden="true" />
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
              const Icon = VALUE_ICONS[i];
              return (
                <Reveal key={title} delay={i * 100} className="h-full">
                  <div className="h-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs">
                          <Icon size={22} aria-hidden="true" />
                        </span>
                        <span className="font-serif text-3xl font-bold text-slate-300">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 font-serif text-xl font-bold text-navy-900">{title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contacto" className="relative overflow-hidden bg-sand-50 py-14 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="scale" delay={100}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 px-6 py-14 text-center text-white shadow-2xl border border-gold-400/20 sm:px-12 sm:py-18">
              <BackgroundBeams />
              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-gold-300 border border-gold-400/30">
                  <MapPin size={13} className="text-gold-400" />
                  {a.location}
                </span>
                <h2 className="mt-4 font-serif text-3xl font-bold sm:text-5xl text-white tracking-tight">{a.ready}</h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">{a.readyBody}</p>
                <p className="mt-2 text-xs text-slate-400">{a.hours}</p>
                
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/register">
                    <Button
                      variant="gold"
                      size="lg"
                      className="rounded-2xl px-8 py-4 text-base font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                      <Sparkles size={16} className="text-navy-950 shrink-0" aria-hidden="true" />
                      <span>{t('auth.join')}</span>
                    </Button>
                  </Link>
                  <Link href="/offers">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-2xl border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md shadow-sm transition-all hover:bg-white/20 hover:border-white/50 hover:text-white"
                    >
                      {t('common.viewOffers')}
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
