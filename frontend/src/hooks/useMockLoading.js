'use client';

import { useEffect, useState } from 'react';

/** Simulates an API round-trip so loading states are exercised. Replace with real fetch state later. */
export default function useMockLoading(ms = 600) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
