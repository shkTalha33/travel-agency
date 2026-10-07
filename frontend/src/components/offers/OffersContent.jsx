'use client';

import React, { useEffect } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import OffersExplorer from '@/components/offers/OffersExplorer';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchOffers } from '@/store/slices/offersSlice';

export default function OffersContent() {
  const { copy } = useLanguage();
  const dispatch = useDispatch();
  const offers = useSelector((state) => state.offers.items);
  const p = copy.offersPage;

  useEffect(() => {
    // Only fetches from API if not already cached in Redux
    dispatch(fetchOffers());
  }, [dispatch]);

  return (
    <section className="bg-sand-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} description={p.desc} />
        <div className="mt-10">
          <OffersExplorer offers={offers} />
        </div>
      </div>
    </section>
  );
}

