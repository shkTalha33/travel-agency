'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/layout/AdminShell';
import { adminApi } from '@/lib/apiClient';
import {
  Users,
  Coins,
  Palmtree,
  Gift,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Sparkles,
  PlusCircle,
  Compass,
  Waves,
  Crown,
  Activity,
  ArrowRight,
  Flame,
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboardPage() {
  const { t, isEn } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboardStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalUsersCount = stats?.users?.total || 0;

  const membershipTiers = [
    {
      id: 'member',
      name: isEn ? 'Member' : 'Miembro',
      tag: isEn ? 'Base Rank' : 'Rango Inicial',
      icon: Compass,
      commission: isEn ? '0% commissions' : '0% comisiones',
      bgGradient: 'from-slate-50 to-slate-100/90',
      border: 'border-slate-200 hover:border-slate-400',
      badgeStyle: 'bg-slate-200/80 text-slate-800 border-slate-300',
      accentColor: 'text-slate-700',
      iconBg: 'bg-slate-200 text-slate-700',
      progressColor: 'bg-slate-400',
    },
    {
      id: 'active_member',
      name: isEn ? 'Active Member' : 'Miembro Activo',
      tag: isEn ? '1st Purchase' : '1ra Compra',
      icon: Waves,
      commission: isEn ? '100% L1 Direct' : '100% N1 Directo',
      bgGradient: 'from-emerald-50/70 to-teal-50/90',
      border: 'border-emerald-200/90 hover:border-emerald-400',
      badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      accentColor: 'text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-700',
      progressColor: 'bg-emerald-500',
    },
    {
      id: 'ambassador',
      name: isEn ? 'Ambassador' : 'Embajador',
      tag: isEn ? '2 Tier Leader' : 'Líder 2 Niveles',
      icon: Award,
      commission: isEn ? '100% L1 + 50% L2' : '100% N1 + 50% N2',
      bgGradient: 'from-ocean-50/70 to-blue-50/90',
      border: 'border-ocean-200/90 hover:border-ocean-400',
      badgeStyle: 'bg-ocean-100 text-ocean-900 border-ocean-300',
      accentColor: 'text-ocean-900',
      iconBg: 'bg-ocean-100 text-ocean-700',
      progressColor: 'bg-ocean-600',
    },
    {
      id: 'elite_ambassador',
      name: isEn ? 'Elite Ambassador' : 'Embajador Élite',
      tag: isEn ? 'Top VIP' : 'Rango VIP Máster',
      icon: Crown,
      commission: isEn ? '100% L1 + 50% L2 VIP' : '100% N1 + 50% N2 VIP',
      bgGradient: 'from-navy-950 via-navy-900 to-navy-950 text-white',
      border: 'border-gold-500/50 hover:border-gold-400 shadow-lg shadow-gold-500/10',
      badgeStyle: 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 border-gold-400 font-extrabold',
      accentColor: 'text-gold-400',
      iconBg: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
      progressColor: 'bg-gradient-to-r from-gold-500 to-gold-300',
      isDark: true,
    },
  ];

  return (
    <AdminShell
      title={t('dashboard.title', 'Panel de Control General')}
      subtitle={t('dashboard.subtitle', 'Supervisión global de usuarios, comisiones multinivel, catálogo de viajes y redenciones')}
      actionButton={
        <div className="flex items-center gap-2.5">
          <Link
            href="/points"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Coins className="w-4 h-4" />
            <span>{t('dashboard.assignPointsBtn', 'Asignar Puntos de Venta')}</span>
          </Link>
          <Link
            href="/offers"
            className="flex items-center gap-2 px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('dashboard.newOfferBtn', 'Nueva Oferta')}</span>
          </Link>
        </div>
      }
    >
      {/* 4 Premium Ultra-Luxurious KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Members */}
        <div className="relative bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-6 border border-sky-200/80 shadow-[0_4px_20px_-4px_rgba(14,165,233,0.12)] hover:shadow-[0_12px_30px_-6px_rgba(14,165,233,0.22)] hover:border-sky-400 transition-all duration-300 overflow-hidden group">
          {/* Ambient Glow & Watermark */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute -right-3 -bottom-3 w-28 h-28 text-sky-500/[0.08] group-hover:text-sky-500/[0.16] group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <Users className="w-full h-full" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-800/80 font-sans">
                {t('dashboard.totalMembers', 'Total Miembros')}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEn ? 'Club Community' : 'Comunidad del Club'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 ring-4 ring-sky-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="relative mt-5 flex items-baseline justify-between">
            <p className="text-3xl lg:text-4xl font-serif font-extrabold text-navy-950 tracking-tight">
              {loading ? '...' : (stats?.users?.total || 0).toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 shadow-xs">
              <TrendingUp className="w-3 h-3" />
              <span>100% {isEn ? 'Live' : 'Activos'}</span>
            </span>
          </div>

          <div className="relative mt-5 pt-3.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200"></span>
              {t('dashboard.activeInNetwork', 'Activos en red')}
            </span>
            <Link
              href="/users"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 font-bold hover:bg-sky-100 hover:text-sky-950 transition-colors group/link"
            >
              <span>{t('common.manage', 'Gestionar')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Points Distributed & Liability */}
        <div className="relative bg-gradient-to-b from-white to-amber-50/40 rounded-3xl p-6 border border-amber-200/90 shadow-[0_4px_20px_-4px_rgba(212,160,23,0.15)] hover:shadow-[0_12px_30px_-6px_rgba(212,160,23,0.28)] hover:border-gold-400 transition-all duration-300 overflow-hidden group">
          {/* Ambient Glow & Watermark */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-gold-400/20 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute -right-3 -bottom-3 w-28 h-28 text-gold-500/[0.09] group-hover:text-gold-500/[0.18] group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <Coins className="w-full h-full" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900/80 font-sans">
                {t('dashboard.issuedPoints', 'Puntos Emitidos')}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEn ? 'Circulating Balance' : 'Balance en Circulación'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-gold-500 to-amber-300 text-navy-950 flex items-center justify-center shadow-lg shadow-gold-500/30 ring-4 ring-amber-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          <div className="relative mt-5 flex items-baseline justify-between">
            <p className="text-3xl lg:text-4xl font-serif font-extrabold text-navy-950 tracking-tight">
              {loading ? '...' : (stats?.points?.totalDistributed || 0).toLocaleString()}
            </p>
            <span className="text-xs font-black text-amber-900 bg-gradient-to-r from-amber-100 to-gold-100 px-3 py-1 rounded-full border border-gold-300 shadow-xs">
              PTS
            </span>
          </div>

          <div className="relative mt-5 pt-3.5 border-t border-amber-200/50 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 truncate max-w-[140px]">
              {t('dashboard.redeemedPoints', 'Redimidos')}: <strong className="text-navy-950">{(stats?.points?.totalRedeemed || 0).toLocaleString()}</strong>
            </span>
            <Link
              href="/points"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100/70 text-amber-900 font-bold hover:bg-amber-200 hover:text-navy-950 transition-colors group/link"
            >
              <span>{t('dashboard.ledger', 'Libro')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Pending Redemptions */}
        <div className="relative bg-gradient-to-b from-white to-rose-50/40 rounded-3xl p-6 border border-rose-200/80 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.12)] hover:shadow-[0_12px_30px_-6px_rgba(244,63,94,0.22)] hover:border-rose-400 transition-all duration-300 overflow-hidden group">
          {/* Ambient Glow & Watermark */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-rose-400/15 via-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute -right-3 -bottom-3 w-28 h-28 text-rose-500/[0.08] group-hover:text-rose-500/[0.16] group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <Gift className="w-full h-full" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-800/80 font-sans">
                {t('dashboard.pendingRedemptions', 'Redenciones')}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEn ? 'Voucher Requests' : 'Solicitudes de Canje'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 ring-4 ring-rose-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          <div className="relative mt-5 flex items-baseline justify-between">
            <p className="text-3xl lg:text-4xl font-serif font-extrabold text-navy-950 tracking-tight">
              {loading ? '...' : (stats?.counts?.pendingRedemptions || 0)}
            </p>
            {stats?.counts?.pendingRedemptions > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-sm shadow-rose-500/30 animate-pulse">
                <Flame className="w-3 h-3 text-amber-200" />
                <span>{t('dashboard.actionRequired', 'Acción')}</span>
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
                ✓ {isEn ? 'Cleared' : 'Al día'}
              </span>
            )}
          </div>

          <div className="relative mt-5 pt-3.5 border-t border-rose-200/50 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              {isEn ? 'Review queue' : 'Por auditar'}
            </span>
            <Link
              href="/redemptions"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-100/80 text-rose-900 font-bold hover:bg-rose-200 hover:text-navy-950 transition-colors group/link"
            >
              <span>{t('dashboard.reviewQueue', 'Revisar')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Metric 4: Active Offers Catalog */}
        <div className="relative bg-gradient-to-b from-white to-emerald-50/40 rounded-3xl p-6 border border-emerald-200/80 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.12)] hover:shadow-[0_12px_30px_-6px_rgba(16,185,129,0.22)] hover:border-emerald-400 transition-all duration-300 overflow-hidden group">
          {/* Ambient Glow & Watermark */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-emerald-400/15 via-teal-500/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute -right-3 -bottom-3 w-28 h-28 text-emerald-500/[0.08] group-hover:text-emerald-500/[0.16] group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <Palmtree className="w-full h-full" />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800/80 font-sans">
                {t('dashboard.featuredOffers', 'Ofertas Destacadas')}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                {isEn ? 'Active Travel Packages' : 'Paquetes Activos'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Palmtree className="w-6 h-6" />
            </div>
          </div>

          <div className="relative mt-5 flex items-baseline justify-between">
            <p className="text-3xl lg:text-4xl font-serif font-extrabold text-navy-950 tracking-tight">
              {loading ? '...' : (stats?.counts?.offers || 0)}
            </p>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300 shadow-xs">
              {isEn ? 'Packages' : 'Destinos'}
            </span>
          </div>

          <div className="relative mt-5 pt-3.5 border-t border-emerald-200/50 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              {t('dashboard.activeCatalog', 'Catálogo activo')}
            </span>
            <Link
              href="/offers"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100/80 text-emerald-900 font-bold hover:bg-emerald-200 hover:text-navy-950 transition-colors group/link"
            >
              <span>{t('common.edit', 'Editar')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Luxury Club Membership Tier Distribution Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-400 text-navy-950 flex items-center justify-center shadow-lg shadow-gold-500/25 ring-4 ring-amber-50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-extrabold text-navy-950 tracking-wide">
                {t('dashboard.tierDistribution', 'Distribución de Membresías en el Club')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {isEn ? 'Real-time breakdown of members by qualifications and commission rights' : 'Desglose en tiempo real de miembros según calificación y derechos de comisión'}
              </p>
            </div>
          </div>

          <Link
            href="/memberships"
            className="inline-flex items-center gap-2 text-xs font-bold text-navy-900 bg-sand-100 hover:bg-gold-50 hover:text-gold-900 hover:border-gold-300 border border-sand-300 px-4 py-2.5 rounded-2xl transition-all shadow-xs self-start sm:self-auto group"
          >
            <span>{t('dashboard.viewCommissionRules', 'Ver Configuración de Comisiones')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Ultra-Attractive VIP Membership Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {membershipTiers.map((tier) => {
            const Icon = tier.icon;
            const count = stats?.users?.[tier.id] || 0;
            const percentage = totalUsersCount > 0 ? ((count / totalUsersCount) * 100).toFixed(1) : 0;

            if (tier.id === 'elite_ambassador') {
              return (
                <div
                  key={tier.id}
                  className="relative rounded-3xl p-6 bg-gradient-to-b from-[#1E110A] via-[#170C07] to-[#0D0704] text-white border-2 border-gold-400/70 shadow-[0_10px_30px_-5px_rgba(212,160,23,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(212,160,23,0.45)] hover:border-gold-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Luxury gold glow highlight */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/15 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 text-gold-400/[0.07] pointer-events-none group-hover:scale-110 transition-transform">
                    <Crown className="w-full h-full" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 to-amber-300 text-navy-950 flex items-center justify-center shadow-md shadow-gold-500/30">
                        <Crown className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-gold-400 via-amber-300 to-gold-400 text-navy-950 shadow-sm border border-gold-200">
                        ★ {tier.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-amber-100 tracking-wide">
                      {tier.name}
                    </h3>
                    <p className="text-[11px] font-bold text-gold-400/90 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-400" />
                      {tier.commission}
                    </p>

                    <div className="mt-5 flex items-baseline justify-between">
                      <div>
                        <p className="text-3xl lg:text-4xl font-serif font-extrabold text-white tracking-tight">
                          {loading ? '...' : count.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-sand-300/80 font-medium mt-0.5">
                          {t('dashboard.qualifiedMembers', 'Miembros Calificados')}
                        </p>
                      </div>
                      <span className="text-sm font-black text-gold-300 bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-5 pt-3.5 border-t border-gold-500/20">
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 via-amber-300 to-gold-200 shadow-sm transition-all duration-1000"
                        style={{ width: `${Math.max(4, percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Tiers (Member, Active Member, Ambassador)
            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 bg-gradient-to-b ${tier.bgGradient} border-2 ${tier.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group`}
              >
                <div className="relative">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tier.iconBg} shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${tier.badgeStyle}`}>
                      {tier.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-extrabold text-navy-950">
                    {tier.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-600 mt-1">
                    {tier.commission}
                  </p>

                  <div className="mt-5 flex items-baseline justify-between">
                    <div>
                      <p className="text-3xl lg:text-4xl font-serif font-extrabold text-navy-950 tracking-tight">
                        {loading ? '...' : count.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {t('dashboard.qualifiedMembers', 'Miembros Calificados')}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
                      {percentage}%
                    </span>
                  </div>
                </div>

                <div className="relative mt-5 pt-3.5 border-t border-black/5">
                  <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${tier.progressColor}`}
                      style={{ width: `${Math.max(4, percentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Lower Columns: Recent Registrations & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Registrations Table Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-ocean-50 text-ocean-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950">
                  {t('dashboard.recentUsers', 'Últimos Miembros Registrados')}
                </h3>
              </div>
              <Link href="/users" className="text-xs font-bold text-ocean-700 hover:text-ocean-950 hover:underline">
                {t('common.viewAll', 'Ver todos')} →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recentUsers?.length > 0 ? (
                stats.recentUsers.map((u) => (
                  <div key={u._id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-navy-950 to-navy-900 text-gold-400 font-bold text-xs flex items-center justify-center ring-2 ring-gold-500/20">
                        {u.fullname?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy-950">{u.fullname}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-navy-800 border border-slate-200">
                        {u.membershipId?.replace('_', ' ')}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">{isEn ? 'No recent users' : 'No hay registros recientes'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Ledger Transactions Table Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950">
                  {t('dashboard.recentLedger', 'Actividad Reciente del Libro Mayor')}
                </h3>
              </div>
              <Link href="/points" className="text-xs font-bold text-gold-800 hover:text-gold-950 hover:underline">
                {t('common.viewAll', 'Ver todos')} →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats?.recentTransactions?.length > 0 ? (
                stats.recentTransactions.map((tx) => (
                  <div key={tx._id} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                    <div>
                      <p className="text-xs font-bold text-navy-950 line-clamp-1">
                        {tx.purchaseDescription || (isEn ? 'Points Transaction' : 'Transacción de Puntos')}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isEn ? 'Beneficiary' : 'Beneficiario'}: <strong className="text-navy-900">{tx.userId?.fullname || 'Usuario'}</strong> • <span className="uppercase font-semibold">{tx.type}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        tx.points >= 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {tx.points >= 0 ? `+${tx.points}` : tx.points} PTS
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">{isEn ? 'No recent transactions' : 'No hay transacciones recientes'}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
