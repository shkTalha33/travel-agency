'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import OfferCard from '@/components/offers/OfferCard';
import PointsStat from '@/components/points/PointsStat';
import TransactionList from '@/components/points/TransactionList';
import InviteButton from '@/components/referral/InviteButton';
import { PageSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary, fetchPointsTransactions } from '@/store/slices/pointsSlice';
import { fetchOffers } from '@/store/slices/offersSlice';
import { fetchNetworkData } from '@/store/slices/networkSlice';
import { TRAVEL_OFFERS } from '@/data/offers';
import { getNetwork, getTransactions } from '@/lib/memberData';

export default function DashboardHome() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy } = useLanguage();
  const dispatch = useDispatch();

  const reduxSummary = useSelector((state) => state.points.summary);
  const reduxTransactions = useSelector((state) => state.points.transactions);
  const reduxNetwork = useSelector((state) => state.network.network);
  const reduxOffers = useSelector((state) => state.offers.items);

  const dash = copy.dashboard || {};
  const membershipName = copy.levels[m?.id]?.name || m?.name;

  useEffect(() => {
    dispatch(fetchPointsSummary());
    dispatch(fetchPointsTransactions());
    dispatch(fetchOffers());
    dispatch(fetchNetworkData());
  }, [dispatch]);

  if (loading) return <PageSkeleton />;

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

  const net = (reduxNetwork.level1 && reduxNetwork.level1.length > 0)
    ? reduxNetwork
    : getNetwork(currentUser);

  const tx = reduxTransactions.length > 0
    ? reduxTransactions.slice(0, 4)
    : getTransactions(currentUser).slice(0, 4);

  const twoLevels = m.referralLevelsAllowed >= 2;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">
          {dash.welcome || 'Bienvenido,'} {currentUser.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {dash.currentLevel || 'Tu nivel actual:'} <Badge variant={m.id}>{membershipName}</Badge>
        </p>
      </div>

      {m.referralLevelsAllowed === 0 ? (
        <Card variant="flat" className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-900">
              {dash.exploreOffersTitle || 'Explora las ofertas de viaje'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {dash.exploreOffersDesc || 'Como Miembro tienes acceso al catálogo. Conoce cómo activar los beneficios de referidos.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/offers"><Button>{dash.viewOffers || 'Ver ofertas'}</Button></Link>
            <Link href="/membership"><Button variant="secondary">{dash.viewMemberships || 'Ver membresías'}</Button></Link>
          </div>
        </Card>
      ) : (
        <>
          <div className={`grid gap-4 sm:grid-cols-2 ${twoLevels ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
            <PointsStat label={dash.available || 'Disponibles'} value={s.availablePoints} tone="accent" />
            <PointsStat label={dash.totalEarned || 'Total ganado'} value={s.totalEarnedPoints} />
            <PointsStat label={dash.redeemed || 'Redimidos'} value={s.redeemedPoints} />
            <PointsStat label={dash.l1Points || 'Puntos Nivel 1'} value={s.level1Points} />
            {twoLevels && <PointsStat label={dash.l2Points || 'Puntos Nivel 2'} value={s.level2Points} />}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-sans text-lg font-bold text-navy-900">
                  {dash.recentActivity || 'Actividad reciente'}
                </h2>
                <Link href="/dashboard/points" className="text-sm font-semibold text-ocean-600 hover:underline">
                  {dash.viewAll || 'Ver todo'}
                </Link>
              </div>
              {tx.length === 0 ? (
                <EmptyState
                  title={dash.noActivityTitle || 'Aún no tienes actividad de referidos.'}
                  description={dash.noActivityDesc || 'Invita a una persona para comenzar a construir tu red.'}
                  className="border-0 p-4"
                />
              ) : (
                <TransactionList transactions={tx} compact />
              )}
            </Card>

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-sans text-lg font-bold text-navy-900">
                  {dash.networkPreview || 'Vista previa de tu red'}
                </h2>
                <Link href="/dashboard/network" className="text-sm font-semibold text-ocean-600 hover:underline">
                  {dash.viewNetwork || 'Ver red'}
                </Link>
              </div>
              <div className={`mb-4 grid gap-3 text-center ${twoLevels ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div className="rounded-xl bg-sand-100 p-4">
                  <p className="text-2xl font-bold text-navy-900">{net.level1.length}</p>
                  <p className="text-xs text-slate-500">{dash.level1 || 'Nivel 1'}</p>
                </div>
                {twoLevels && (
                  <div className="rounded-xl bg-sand-100 p-4">
                    <p className="text-2xl font-bold text-navy-900">{net.level2.length}</p>
                    <p className="text-xs text-slate-500">{dash.level2 || 'Nivel 2'}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  {dash.yourCode || 'Tu código:'} <strong className="text-navy-900">{currentUser.referralCode}</strong>
                </p>
                <InviteButton link={currentUser.referralLink} variant="secondary" size="sm" />
              </div>
            </Card>
          </div>
        </>
      )}

      <section aria-labelledby="ofertas-panel">
        <h2 id="ofertas-panel" className="mb-4 text-xl font-bold text-navy-900">
          {dash.availableOffers || 'Ofertas disponibles'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {TRAVEL_OFFERS.slice(0, 3).map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </section>
    </div>
  );
}
