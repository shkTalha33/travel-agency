'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowRight, 
  Plane,
  Coins,
  Ticket,
  TrendingUp,
  Users,
  Share2,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import PointsStat from '@/components/points/PointsStat';
import TransactionList from '@/components/points/TransactionList';
import InviteButton from '@/components/referral/InviteButton';
import PointsGrowthChart from '@/components/dashboard/PointsGrowthChart';
import NetworkBreakdownChart from '@/components/dashboard/NetworkBreakdownChart';
import { PageSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary, fetchPointsTransactions } from '@/store/slices/pointsSlice';
import { fetchNetworkData } from '@/store/slices/networkSlice';
import { fetchMyRedemptions } from '@/store/slices/redemptionsSlice';

export default function DashboardHome() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [copied, setCopied] = useState(false);

  const reduxSummary = useSelector((state) => state.points?.summary || {});
  const reduxTransactions = useSelector((state) => state.points?.transactions || []);
  const reduxNetwork = useSelector((state) => state.network?.network || {});
  const reduxRedemptions = useSelector((state) => state.redemptions?.items || []);

  const dash = copy.dashboard || {};
  const membershipName = copy.levels?.[m?.id]?.name || m?.name || (isEn ? 'Member' : 'Miembro');

  useEffect(() => {
    dispatch(fetchPointsSummary());
    dispatch(fetchPointsTransactions({}));
    dispatch(fetchNetworkData());
    dispatch(fetchMyRedemptions());
  }, [dispatch]);

  const copyRefCode = async () => {
    try {
      await navigator.clipboard.writeText(currentUser?.referralCode || '');
      setCopied(true);
      toast(isEn ? 'Referral code copied!' : '¡Código de referido copiado!');
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      toast(isEn ? 'Could not copy code' : 'No se pudo copiar el código', 'error');
    }
  };

  if (loading || !currentUser) return <PageSkeleton />;

  const userStats = currentUser?.stats || currentUser?.pointsStats || {
    availablePoints: 0,
    totalEarnedPoints: 0,
    redeemedPoints: 0,
    level1Points: 0,
    level2Points: 0,
  };

  const s = {
    availablePoints: reduxSummary.availablePoints ?? (userStats.availablePoints || 0),
    totalEarnedPoints: reduxSummary.totalEarnedPoints ?? (userStats.totalEarnedPoints || 0),
    redeemedPoints: reduxSummary.redeemedPoints ?? (userStats.redeemedPoints || 0),
    level1Points: reduxSummary.level1Points ?? (userStats.level1Points || 0),
    level2Points: reduxSummary.level2Points ?? (userStats.level2Points || 0),
  };

  const net = reduxNetwork || { level1: [], level2: [] };
  const tx = (reduxTransactions || []).slice(0, 4);

  const twoLevels = m.referralLevelsAllowed >= 2;
  const hasPoints = s.availablePoints > 0 || s.totalEarnedPoints > 0;
  const showStats = true;

  const formattedJoinedDate = currentUser?.joinedDate || (currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString(isEn ? 'en-US' : 'es-ES', { month: 'short', year: 'numeric' }) : '');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return (
          <Badge variant="success" size="xs">
            {isEn ? 'Approved' : 'Aprobado'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" size="xs">
            {isEn ? 'Rejected' : 'Rechazado'}
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="gold" size="xs">
            {isEn ? 'Pending Review' : 'En Revisión'}
          </Badge>
        );
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Welcome Hero Banner: Solid White, Flat, Borderless, Shadowless, Attractive */}
      <div className="rounded-2xl bg-white p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* User info & greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative shrink-0">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full ring-2 ring-ocean-500/40 object-cover"
              />
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            <div className="space-y-1">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                {dash.welcome || (isEn ? 'Welcome,' : 'Bienvenido,')} {currentUser?.name ? currentUser.name.split(' ')[0] : (isEn ? 'Member' : 'Miembro')}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-navy-700">
                  <Wallet className="w-3.5 h-3.5 text-ocean-600" />
                  <span>{s.availablePoints.toLocaleString()} PTS {isEn ? 'Available' : 'Disponibles'}</span>
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-semibold">
                  ${(s.availablePoints * 1.5).toLocaleString()} USD {isEn ? 'Travel Credit' : 'Crédito'}
                </span>
                {formattedJoinedDate && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400">
                      {isEn ? 'Member since' : 'Miembro desde'} {formattedJoinedDate}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 border-t border-sand-100 lg:border-0">
            <Link href="/dashboard/redeem">
              <Button variant="primary" size="sm" className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer shrink-0">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-300" />
                <span>{isEn ? 'Redeem Points' : 'Canjear Puntos'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Points Statistics Metrics Grid: Flat, Clean, Borderless */}
      {showStats && (
        <div className={`grid gap-3 sm:grid-cols-2 ${twoLevels ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          <PointsStat 
            label={dash.available || (isEn ? 'Available Points' : 'Disponibles')} 
            value={s.availablePoints} 
            tone="accent" 
            hint={isEn ? `≈ $${(s.availablePoints * 1.5).toLocaleString()} USD Value` : `≈ $${(s.availablePoints * 1.5).toLocaleString()} USD en viajes`}
          />
          <PointsStat 
            label={dash.totalEarned || (isEn ? 'Total Earned' : 'Total ganado')} 
            value={s.totalEarnedPoints} 
            tone="emerald"
            prefix="+"
          />
          <PointsStat 
            label={dash.redeemed || (isEn ? 'Redeemed' : 'Redimidos')} 
            value={s.redeemedPoints} 
            tone="rose"
            prefix={s.redeemedPoints > 0 ? '-' : ''}
          />
          <PointsStat 
            label={dash.l1Points || (isEn ? 'Level 1 Points' : 'Puntos Nivel 1')} 
            value={s.level1Points} 
            tone="ocean"
          />
          {twoLevels && (
            <PointsStat 
              label={dash.l2Points || (isEn ? 'Level 2 Points' : 'Puntos Nivel 2')} 
              value={s.level2Points} 
              tone="purple"
            />
          )}
        </div>
      )}

      {/* Interactive Graphs Section: Points Growth Chart & Network Distribution Chart */}
      <div className="grid gap-5 lg:grid-cols-2">
        <PointsGrowthChart 
          pointsSummary={reduxSummary} 
          transactions={reduxTransactions} 
        />
        <NetworkBreakdownChart 
          network={net} 
          membership={m} 
        />
      </div>

      {/* Activity and Network preview Grid: Flat, Borderless */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent Points Activity */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-ocean-600" />
                <span>{dash.recentActivity || (isEn ? 'Recent Points Activity' : 'Actividad Reciente')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn ? 'Latest rewards earned from your referral network' : 'Últimas recompensas acumuladas de tu red'}
              </p>
            </div>
            <Link href="/dashboard/points" className="text-xs font-bold text-ocean-600 hover:text-ocean-700">
              {dash.viewAll || (isEn ? 'View All' : 'Ver todo')}
            </Link>
          </div>

          {tx.length === 0 ? (
            <EmptyState
              title={dash.noActivityTitle || (isEn ? 'No point activity yet' : 'Aún no tienes actividad de puntos.')}
              description={dash.noActivityDesc || (isEn ? 'Share your referral code or redeem travel perks to start earning.' : 'Invita a una persona o reserva viajes para acumular puntos.')}
              className="border-0 p-4"
            />
          ) : (
            <TransactionList transactions={tx} compact />
          )}
        </div>

        {/* Referral Network Overview */}
        <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-sand-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-ocean-600" />
                <span>{dash.networkPreview || (isEn ? 'Referral Network Overview' : 'Vista Previa de tu Red')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isEn ? 'Recent members generating points across your network' : 'Afiliados activos que generan puntos en tu red'}
              </p>
            </div>
            <Link href="/dashboard/network" className="text-xs font-bold text-ocean-600 hover:text-ocean-700 flex items-center gap-1">
              <span>{dash.viewNetwork || (isEn ? 'View All' : 'Ver todo')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Level Counters Strip */}
          <div className={`grid gap-3 ${twoLevels ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="p-3.5 rounded-2xl bg-sand-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-ocean-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy-950">
                    {dash.level1 || (isEn ? 'Level 1 Directs' : 'Nivel 1 Directos')}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">100% {isEn ? 'points rate' : 'de puntos'}</p>
                </div>
              </div>
              <span className="font-serif text-2xl font-bold text-navy-950">
                {net?.level1?.length || 0}
              </span>
            </div>

            {twoLevels && (
              <div className="p-3.5 rounded-2xl bg-sand-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-ocean-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-navy-950">
                      {dash.level2 || (isEn ? 'Level 2 Sub-network' : 'Nivel 2 Sub-red')}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">50% {isEn ? 'points rate' : 'de puntos'}</p>
                  </div>
                </div>
                <span className="font-serif text-2xl font-bold text-navy-950">
                  {net?.level2?.length || 0}
                </span>
              </div>
            )}
          </div>

          {/* Member Preview List / Empty State */}
          <div className="flex-1">
            {(net?.level1?.length === 0 && (!twoLevels || net?.level2?.length === 0)) ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-navy-950">
                  {isEn ? 'No referrals registered yet' : 'Aún no tienes referidos'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  {isEn 
                    ? 'Share your referral link with friends and start earning points on every trip they book.' 
                    : 'Comparte tu enlace de referido y acumula puntos cada vez que reserven viajes.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-sand-100/80">
                {/* Level 1 Members */}
                {(net?.level1 || []).slice(0, 3).map((person, idx) => (
                  <div key={person.id || `l1-${idx}`} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {person.name ? person.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-950 truncate">
                          {person.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {isEn ? 'Direct Referral' : 'Referido Directo'} {person.joinedDate ? `· ${person.joinedDate}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        +{person.pointsGeneratedToUpline || (person.pointsGenerated || 0)} PTS
                      </span>
                    </div>
                  </div>
                ))}

                {/* Level 2 Members if space permits */}
                {twoLevels && (net?.level2 || []).slice(0, 2).map((person, idx) => (
                  <div key={person.id || `l2-${idx}`} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-sand-200 text-navy-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {person.name ? person.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-950 truncate">
                          {person.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {isEn ? 'Level 2 Sub-network' : 'Nivel 2 Sub-red'} {person.sponsorName ? `(via ${person.sponsorName})` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-ocean-50 text-ocean-700">
                        +{person.pointsGeneratedToUpline || (person.pointsGenerated || 0)} PTS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Referral Code Share Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sand-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">
                {dash.yourCode || (isEn ? 'Your Code:' : 'Tu código:')}
              </span>
              <span className="font-mono text-xs font-bold text-navy-950 px-2.5 py-1 rounded-lg bg-sand-100">
                {currentUser?.referralCode || 'N/A'}
              </span>
              <button
                type="button"
                onClick={copyRefCode}
                className="p-1.5 rounded-lg hover:bg-sand-100 text-slate-500 hover:text-navy-900 transition-colors cursor-pointer border-0 outline-none focus:outline-none focus:ring-0 active:outline-none"
                title={isEn ? 'Copy Referral Code' : 'Copiar Código'}
              >
                {copied ? <Check size={14} className="text-ocean-600" /> : <Copy size={14} />}
              </button>
            </div>
            <InviteButton link={currentUser?.referralLink} variant="secondary" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
