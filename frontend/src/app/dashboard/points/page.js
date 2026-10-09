'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Coins, Sparkles, TrendingUp, Wallet, Gift, Users, Share2, Percent } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import PointsStat from '@/components/points/PointsStat';
import TransactionList from '@/components/points/TransactionList';
import { ListSkeleton, PointsSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary, fetchPointsTransactions } from '@/store/slices/pointsSlice';
import { getTransactions } from '@/lib/memberData';

export default function PointsPage() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const dispatch = useDispatch();

  const reduxSummary = useSelector((state) => state.points.summary);
  const reduxTransactions = useSelector((state) => state.points.transactions);

  const pv = copy.pointsView || {};
  const dash = copy.dashboard || {};
  const membershipName = copy.levels?.[m?.id]?.name || m?.name || (isEn ? 'Member' : 'Miembro');

  useEffect(() => {
    dispatch(fetchPointsSummary());
    dispatch(fetchPointsTransactions({}));
  }, [dispatch]);

  if (loading || !currentUser) return <PointsSkeleton />;

  const userStats = currentUser?.stats || currentUser?.pointsStats || {
    availablePoints: 0,
    totalEarnedPoints: 0,
    redeemedPoints: 0,
    level1Points: 0,
    level2Points: 0,
  };

  const s = {
    availablePoints: reduxSummary.availablePoints > 0 ? reduxSummary.availablePoints : (userStats.availablePoints || 0),
    totalEarnedPoints: reduxSummary.totalEarnedPoints > 0 ? reduxSummary.totalEarnedPoints : (userStats.totalEarnedPoints || 0),
    redeemedPoints: reduxSummary.redeemedPoints > 0 ? reduxSummary.redeemedPoints : (userStats.redeemedPoints || 0),
    level1Points: reduxSummary.level1Points > 0 ? reduxSummary.level1Points : (userStats.level1Points || 0),
    level2Points: reduxSummary.level2Points > 0 ? reduxSummary.level2Points : (userStats.level2Points || 0),
  };

  const tx = (reduxTransactions && reduxTransactions.length > 0)
    ? reduxTransactions
    : getTransactions(currentUser);

  const twoLevels = m.referralLevelsAllowed >= 2;
  const hasPoints = s.availablePoints > 0 || s.totalEarnedPoints > 0;
  const showWallet = hasPoints || m.referralLevelsAllowed > 0;

  if (!showWallet) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-bold text-navy-950">{t('panel.points')}</h1>
        <EmptyState
          icon={<Coins size={28} />}
          title={pv.notYetTitle || (isEn ? 'You do not have points yet' : 'Aún no generas puntos')}
          description={pv.notYetDesc || (isEn ? 'Points accumulate from purchases and your referral network activity.' : 'Los puntos se acumulan por compras y actividad de tu red de referidos.')}
        />
        <Link href="/membership">
          <Button variant="primary">{dash.viewMemberships || (isEn ? 'View Memberships' : 'Ver membresías')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Top Balance Hero: Solid Obsidian, Flat, Borderless, Shadowless */}
      <div className="rounded-2xl bg-navy-950 p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {pv.vipBalance || (isEn ? 'AVAILABLE POINTS BALANCE' : 'BALANCE VIP ACUMULADO')}
              </span>
              <Badge variant={m?.id || 'active'}>{membershipName}</Badge>
            </div>

            <div className="flex items-baseline gap-2.5">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {s.availablePoints.toLocaleString()}
              </h1>
              <span className="text-base sm:text-lg font-bold text-gold-400">PTS</span>
            </div>

            <p className="text-xs sm:text-sm text-sand-300 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-400 shrink-0" />
              <span>
                {(pv.usdEquiv || (isEn ? 'Estimated value:' : 'Equivalente aproximado a'))}{' '}
                <strong className="text-white font-bold font-mono">
                  ${(s.availablePoints * 1.5).toLocaleString()} USD
                </strong>{' '}
                {(pv.usdEquivSuffix || (isEn ? 'in travel rewards' : 'en descuentos de viaje.'))}
              </span>
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 pt-2 md:pt-0 border-t border-white/10 md:border-0">
            <div className="rounded-2xl bg-navy-900 p-4 text-left sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {pv.totalHistorical || (isEn ? 'Lifetime Points Earned' : 'Total Histórico Generado')}
              </p>
              <p className="font-serif text-2xl font-bold text-gold-300 mt-0.5">
                +{s.totalEarnedPoints.toLocaleString()} PTS
              </p>
            </div>

            <Link href="/dashboard/redeem">
              <Button variant="primary" size="sm" className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer">
                <Sparkles size={13} className="mr-1.5 text-gold-300" />
                <span>{pv.redeemBtn || (isEn ? 'Redeem Points' : 'Redimir Puntos')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Points Stats Grid: Flat, Clean, Borderless */}
      <div className={`grid gap-3 sm:grid-cols-2 ${twoLevels ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        <PointsStat 
          label={pv.redeemedPoints || (isEn ? 'Points Redeemed' : 'Puntos Redimidos')} 
          value={s.redeemedPoints} 
          tone="rose"
          prefix={s.redeemedPoints > 0 ? '-' : ''}
          icon={<Gift className="w-4 h-4 text-rose-600" />}
        />
        <PointsStat 
          label={pv.l1DirectPoints || (isEn ? 'Level 1 Points (Direct)' : 'Puntos Nivel 1 (Directos)')} 
          value={s.level1Points} 
          tone="ocean"
          icon={<Users className="w-4 h-4 text-ocean-600" />}
        />
        {twoLevels && (
          <PointsStat 
            label={pv.l2SubPoints || (isEn ? 'Level 2 Points (Sub-network)' : 'Puntos Nivel 2 (Sub-red)')} 
            value={s.level2Points} 
            tone="purple"
            icon={<Share2 className="w-4 h-4 text-purple-600" />}
          />
        )}
        <PointsStat 
          label={pv.conversionRate || (isEn ? 'Redemption Rate' : 'Tasa de Conversión')} 
          value="1.5x USD" 
          suffix=""
          tone="gold"
          icon={<Percent className="w-4 h-4 text-gold-600" />}
        />
      </div>

      {/* History: Flat, Clean, Borderless */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        <div className="border-b border-sand-100 pb-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-950">
            {pv.historyTitle || (isEn ? 'Points & Rewards History' : 'Historial de movimientos y acreditaciones')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEn 
              ? 'Complete ledger of all point credits and redemptions across your membership' 
              : 'Registro completo de todas las acreditaciones y canjes de puntos de tu membresía'}
          </p>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : tx.length === 0 ? (
          <EmptyState
            title={pv.noMovementsTitle || (isEn ? 'No transaction activity yet' : 'Aún no tienes movimientos')}
            description={pv.noMovementsDesc || (isEn ? 'When your network generates points or you make travel bookings, they will appear here.' : 'Cuando tu red genere puntos o realices compras, aparecerán aquí.')}
            className="border-0 py-10"
          />
        ) : (
          <TransactionList transactions={tx} />
        )}
      </div>
    </div>
  );
}
