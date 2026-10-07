'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import { useLanguage } from '@/context/LanguageContext';

const TRAVEL_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    badge: { en: 'VIP TRAVEL & REWARDS', es: 'VIAJES VIP Y RECOMPENSAS' },
    title: { en: 'Caribbean escapes, on demand', es: 'Escapadas al Caribe, a tu alcance' },
    desc: {
      en: 'Book exclusive luxury stays across Dominican Republic & Caribbean resorts while earning points.',
      es: 'Reserva estancias de lujo exclusivas en República Dominicana y el Caribe mientras acumulas puntos.',
    },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80',
    badge: { en: '5-STAR LUXURY RESORTS', es: 'RESORTS DE LUJO 5 ESTRELLAS' },
    title: { en: 'Punta Cana & beachfront villas', es: 'Punta Cana y villas frente al mar' },
    desc: {
      en: 'Unlock member-only rates with all-inclusive gourmet dining, private pools, and VIP concierge.',
      es: 'Accede a tarifas exclusivas con todo incluido, piscinas privadas y atención de conserjería VIP.',
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80',
    badge: { en: 'EXCLUSIVE EXPERIENCES', es: 'EXPERIENCIAS EXCLUSIVAS' },
    title: { en: 'Sail the Caribbean waters', es: 'Navega las aguas del Caribe' },
    desc: {
      en: 'Catamaran cruises to Saona Island, coral reef snorkeling, and member referral points on every booking.',
      es: 'Excursiones en catamarán a Isla Saona, snorkel en arrecifes y puntos de referido en cada reserva.',
    },
  },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-scroll slides in a loop every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TRAVEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Floating Center Card Container with 10px padding on all sides */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-[10px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch overflow-hidden">
        
        {/* Left Side: Modern Auto-Scrolling Travel Visual Card */}
        <div className="lg:col-span-6 relative w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white shadow-md bg-navy-950 select-none">
          
          {/* Background Images with Cross-Fade Loop Transition */}
          {TRAVEL_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <SafeImage
                src={slide.image}
                alt="Caribbean travel destination"
                priority={index === 0}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                  index === activeSlide ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          ))}

          {/* Multi-stop gradient for readable overlay text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/35 z-[1]" />

          {/* Top Branding */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo.jpg"
                alt="Círculo Wingding Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-md border border-white/20 group-hover:scale-105 transition-transform"
              />
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                Círculo Wingding
              </span>
            </Link>
          </div>

          {/* Bottom Captions & Highlights with Smooth Fade */}
          <div className="relative z-10 space-y-3">
            <div className="min-h-[140px] sm:min-h-[150px] flex flex-col justify-end">
              {TRAVEL_SLIDES.map((slide, index) => {
                if (index !== activeSlide) return null;
                return (
                  <div key={slide.id} className="space-y-2 animate-fade-in">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider backdrop-blur-md text-white border border-white/20">
                      <Sparkles size={12} className="text-gold-300" />
                      {isEn ? slide.badge.en : slide.badge.es}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {isEn ? slide.title.en : slide.title.es}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-sm">
                      {isEn ? slide.desc.en : slide.desc.es}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Loop Dots Indicator */}
            <div className="flex items-center gap-2 pt-2">
              {TRAVEL_SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === activeSlide
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Centered Auth Form */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto flex flex-col justify-center py-2 sm:py-3 px-2 sm:px-4">
          <div className="text-center sm:text-left mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div>{children}</div>

          {footer && (
            <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs sm:text-sm text-slate-600">
              {footer}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
