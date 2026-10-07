'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Coins, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PointsStat from '@/components/points/PointsStat';
import TransactionList from '@/components/points/TransactionList';
import { ListSkeleton } from '@/components/common/Skeletons';
import CardSpotlight from '@/components/ui/CardSpotlight';
import Meteors from '@/components/ui/Meteors';
import MovingBorderButton from '@/components/ui/MovingBorder';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary, fetchPointsTransactions } from '@/store/slices/pointsSlice';
import { getTransactions } from '@/lib/memberData';

export default function PointsPage() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy } = useLanguage();
  const dispatch = useDispatch();

  const reduxSummary = useSelector((state) => state.points.summary);
  const reduxTransactions = useSelector((state) => state.points.transactions);

  const pv = copy.pointsView || {};
  const dash = copy.dashboard || {};

  useEffect(() => {
    dispatch(fetchPointsSummary());
    dispatch(fetchPointsTransactions());
  }, [dispatch]);

  const userStats = currentUser?.stats || {
    availablePoints: 0,
    totalEarnedPoints: 0,
    redeemedPoints: 0,
    level1Points: 0,
    level2Points: 0,
  };

  const s = {
    availablePoints: reduxSummary.availablePoints > 0 ? reduxSummary.availablePoints : userStats.availablePoints,
    totalEarnedPoints: reduxSummary.totalEarnedPoints > 0 ? reduxSummary.totalEarnedPoints : userStats.totalEarnedPoints,
    redeemedPoints: reduxSummary.redeemedPoints > 0 ? reduxSummary.redeemedPoints : userStats.redeemedPoints,
    level1Points: reduxSummary.level1Points > 0 ? reduxSummary.level1Points : userStats.level1Points,
    level2Points: reduxSummary.level2Points > 0 ? reduxSummary.level2Points : userStats.level2Points,
  };

  const tx = reduxTransactions.length > 0 ? reduxTransactions : getTransactions(currentUser);

  if (m.referralLevelsAllowed === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-navy-900">{t('panel.points')}</h1>
        <EmptyState
          icon={<Coins size={28} />}
          title={pv.notYetTitle || 'Aún no generas puntos'}
          description={pv.notYetDesc || 'Los puntos de referido se habilitan con la membresía de Miembro Activo.'}
        />
        <Link href="/membership"><Button>{dash.viewMemberships || 'Ver membresías'}</Button></Link>
      </div>
    );
  }

  const twoLevels = m.referralLevelsAllowed >= 2;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">{pv.title || 'Billetera de Puntos & Recompensas'}</h1>
          <p className="mt-1 text-sm text-slate-600">{pv.subtitle || 'Aquí se reflejan las ganancias generadas automáticamente por las reservas de tu red.'}</p>
        </div>
        <Link href="/dashboard/redeem">
          <MovingBorderButton borderRadius="1.25rem" className="bg-navy-900 px-5 py-2.5 font-bold text-gold-300 hover:bg-navy-950">
            <Sparkles size={14} className="mr-2 text-gold-400" />
            {pv.redeemBtn || 'Redimir Puntos'}
          </MovingBorderButton>
        </Link>
      </div>

      {/* Aceternity VIP Obsidian Balance Card with Meteors & Spotlight */}
      <CardSpotlight
        color="rgba(212, 180, 90, 0.28)"
        radius={350}
        className="relative overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-7 text-white shadow-elevated sm:p-10"
      >
        <Meteors number={18} />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-gold-400">
              <Wallet size={18} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">{pv.vipBalance || 'Balance VIP Acumulado'}</span>
            </div>
            <p className="mt-2 font-serif text-4xl font-bold text-white sm:text-6xl tracking-tight">
              {s.availablePoints.toLocaleString()} <span className="font-sans text-xl sm:text-2xl text-gold-400 font-semibold">{copy.common.pts.toUpperCase()}</span>
            </p>
            <p className="mt-2 text-xs text-slate-300 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              {(pv.usdEquiv || 'Equivalente aproximado a')} <strong className="text-white">${(s.availablePoints * 1.5).toLocaleString()} {(pv.usdEquivSuffix || 'USD en descuentos de viaje.')}</strong>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{pv.totalHistorical || 'Total Histórico Generado'}</p>
              <p className="font-serif text-2xl font-bold text-gold-300">+{s.totalEarnedPoints.toLocaleString()} {copy.common.pts}</p>
            </div>
          </div>
        </div>
      </CardSpotlight>

      {/* Points Stats Grid */}
      <div className={`grid gap-4 sm:grid-cols-2 ${twoLevels ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <PointsStat label={pv.redeemedPoints || 'Puntos Redimidos'} value={s.redeemedPoints} />
        <PointsStat label={pv.l1DirectPoints || 'Puntos Nivel 1 (Directos)'} value={s.level1Points} tone="accent" />
        {twoLevels && <PointsStat label={pv.l2SubPoints || 'Puntos Nivel 2 (Sub-red)'} value={s.level2Points} tone="accent" />}
        <PointsStat label={pv.conversionRate || 'Tasa de Conversión'} value="100%" />
      </div>

      {/* History */}
      <Card className="rounded-3xl border border-sand-200/90 shadow-card">
        <h2 className="mb-4 font-serif text-xl font-bold text-navy-900">{pv.historyTitle || 'Historial de movimientos y acreditaciones'}</h2>
        {loading ? <ListSkeleton /> : tx.length === 0 ? (
          <EmptyState
            title={pv.noMovementsTitle || 'Aún no tienes movimientos'}
            description={pv.noMovementsDesc || 'Cuando tu red genere puntos, aparecerán aquí.'}
            className="border-0"
          />
        ) : (
          <TransactionList transactions={tx} />
        )}
      </Card>
    </div>
  );
}
