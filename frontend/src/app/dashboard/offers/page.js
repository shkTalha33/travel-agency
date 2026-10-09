'use client';

import React, { useEffect } from 'react';
import { Compass } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import OffersExplorer from '@/components/offers/OffersExplorer';
import { OffersPageSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSelector, useDispatch } from '@/store';
import { fetchOffers } from '@/store/slices/offersSlice';
import { TRAVEL_OFFERS } from '@/data/offers';

export default function DashboardOffersPage() {
  const loading = useMockLoading(300);
  const { t, copy, isEn } = useLanguage();
  const { currentMembership: m } = useAuth();
  const dispatch = useDispatch();

  const reduxOffers = useSelector((state) => state.offers?.items || []);
  const p = copy.offersPage || {};
  const membershipName = copy.levels?.[m?.id]?.name || m?.name || (isEn ? 'Member' : 'Miembro');

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const offers = (reduxOffers && reduxOffers.length > 0) ? reduxOffers : TRAVEL_OFFERS;

  if (loading) return <OffersPageSkeleton />;

  return (
    <div className="w-full space-y-5">
      {/* Top Banner: Solid Obsidian, Flat, Borderless, Shadowless */}
      <div className="rounded-2xl bg-navy-950 p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {p.eyebrow || (isEn ? 'TRAVEL PORTFOLIO' : 'CATÁLOGO DE VIAJES')}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {p.title || (isEn ? 'Travel Offers' : 'Ofertas de Viaje')}
            </h1>

            <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
              {p.desc || (isEn ? 'Explore destinations, VIP perks, and points reward opportunities.' : 'Elige un destino y consulta los detalles. Las reservas se coordinan con nuestros asesores.')}
            </p>
          </div>
        </div>
      </div>

      <OffersExplorer offers={offers} />
    </div>
  );
}
