'use client';

import React, { useEffect } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import OffersExplorer from '@/components/offers/OffersExplorer';
import { PageSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchOffers } from '@/store/slices/offersSlice';
import { TRAVEL_OFFERS } from '@/data/offers';

export default function DashboardOffersPage() {
  const loading = useMockLoading(300);
  const { copy } = useLanguage();
  const dispatch = useDispatch();

  const reduxOffers = useSelector((state) => state.offers?.items || []);
  const p = copy.offersPage || {
    eyebrow: 'Ofertas',
    title: 'Ofertas de viaje',
    desc: 'Elige un destino y consulta los detalles. Las reservas se coordinan con nuestros asesores.',
  };

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const offers = (reduxOffers && reduxOffers.length > 0) ? reduxOffers : TRAVEL_OFFERS;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-5">
      <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.desc} />
      <OffersExplorer offers={offers} />
    </div>
  );
}
