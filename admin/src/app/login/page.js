'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Compass,
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const { locale, setLocale, t, isEn } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const ADMIN_SLIDES = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      badge: isEn ? 'ADMIN MASTER PORTAL' : 'PANEL MAESTRO ADMINISTRATIVO',
      title: isEn ? 'Total control over travel network' : 'Control total de la red de viajes',
      desc: isEn
        ? 'Supervise member growth, multi-tier L1/L2 commissions, and real-time settlements.'
        : 'Supervise el crecimiento de miembros, comisiones multinivel L1/L2 y liquidaciones en tiempo real.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=80',
      badge: isEn ? 'VIP DEALS & CATALOG' : 'CATÁLOGO & OFERTAS VIP',
      title: isEn ? 'Manage exclusive packages' : 'Gestione paquetes exclusivos',
      desc: isEn
        ? 'Create and update 5-star luxury resorts, excursions, and reward point promotions.'
        : 'Cree y actualice promociones de resorts de lujo 5 estrellas, excursiones y recompensas en puntos.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=80',
      badge: isEn ? 'POINTS & REDEMPTIONS' : 'PUNTOS & REDENCIONES',
      title: isEn ? 'Agile reward approval' : 'Aprobación ágil de recompensas',
      desc: isEn
        ? 'Validate redemption requests and assign offline purchase points with complete ledger audits.'
        : 'Valide solicitudes de redención y asigne puntos de compras offline con total trazabilidad.',
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Auto-scroll slides loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ADMIN_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError(isEn ? 'Please enter your email and password.' : 'Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || (isEn ? 'Invalid administrative credentials.' : 'Credenciales administrativas inválidas o sin permisos.'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Floating Center Card Container with 10px padding matching Frontend Auth layout */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-[10px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch overflow-hidden relative">
        
        {/* Left Side: Auto-Scrolling Travel Visual Card */}
        <div className="lg:col-span-6 relative w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-6 sm:p-8 text-white shadow-md bg-navy-950 select-none">
          
          {/* Background Images with Cross-Fade Loop Transition */}
          {ADMIN_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={slide.image}
                alt="Caribbean travel destination"
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                  index === activeSlide ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          ))}

          {/* Multi-stop gradient for optimal text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-navy-950/45 z-[1]" />

          {/* Top Branding */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Círculo Wingding Logo"
                className="h-10 w-10 rounded-xl object-cover shadow-md border border-gold-500/30"
              />
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block leading-tight">
                  Círculo Wingding
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-400 block">
                  {t('common.masterPortal', 'Portal Administrativo')}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-900/80 border border-gold-500/40 text-gold-400 text-[10px] font-bold tracking-wider backdrop-blur-md">
              <ShieldCheck size={12} />
              ADMIN MASTER
            </span>
          </div>

          {/* Bottom Captions & Highlights */}
          <div className="relative z-10 space-y-3">
            <div className="min-h-[140px] sm:min-h-[150px] flex flex-col justify-end">
              {ADMIN_SLIDES.map((slide, index) => {
                if (index !== activeSlide) return null;
                return (
                  <div key={slide.id} className="space-y-2 animate-fade-in">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider backdrop-blur-md text-white border border-white/20">
                      <Sparkles size={12} className="text-gold-300" />
                      {slide.badge}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {slide.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-sm">
                      {slide.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Loop Dots Indicator */}
            <div className="flex items-center gap-2 pt-2">
              {ADMIN_SLIDES.map((_, index) => (
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

        {/* Right Side: Admin Login Form matching Frontend Form Style */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto flex flex-col justify-center py-2 sm:py-3 px-2 sm:px-4">
          {/* Language Switcher in Login Card */}
          <div className="flex justify-end mb-2">
            <div className="inline-flex items-center p-0.5 rounded-xl bg-sand-100 border border-sand-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLocale('es')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  !isEn ? 'bg-ocean-600 text-white font-bold shadow-xs' : 'text-navy-600 hover:text-navy-950'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  isEn ? 'bg-ocean-600 text-white font-bold shadow-xs' : 'text-navy-600 hover:text-navy-950'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="text-center sm:text-left mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-700 block mb-1">
              {isEn ? 'Secure Admin Portal' : 'Acceso Seguro de Administrador'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              {isEn ? 'Sign In' : 'Iniciar Sesión'}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {isEn
                ? 'Enter your authorized credentials to manage the travel platform and members.'
                : 'Ingrese sus credenciales autorizadas para gestionar el sistema de viajes y miembros.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{isEn ? 'Authentication Error' : 'Error de Autenticación'}</p>
                <p className="mt-0.5 text-[11px] opacity-90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email / Username Input */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wide">
                {isEn ? 'Email Address' : 'Correo Electrónico'} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-sand-300 rounded-2xl text-navy-950 text-sm placeholder-slate-400 focus:border-gold-500 outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wide">
                {isEn ? 'Security Password' : 'Contraseña de Seguridad'} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-sand-300 rounded-2xl text-navy-950 text-sm placeholder-slate-400 focus:border-gold-500 outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-navy-900 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isEn ? 'Access Control Panel' : 'Ingresar al Panel de Control'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Viajes Dominicana. {isEn ? 'Master Administrative Portal.' : 'Módulo de Administración Independiente.'}
          </div>
        </div>

      </div>
    </div>
  );
}
