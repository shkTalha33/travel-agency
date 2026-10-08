'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

/** Image with a graceful branded fallback if the remote image fails to load. */
export default function SafeImage({ src, alt, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);

  const resolveSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  const handleError = (e) => {
    if (src && src.includes('travel_agency/')) {
      const pathSuffix = src.substring(src.indexOf('travel_agency/'));
      const localFallback = `http://localhost:5000/uploads/${pathSuffix}`;
      if (e.currentTarget.src !== localFallback) {
        e.currentTarget.src = localFallback;
        return;
      }
    }
    setFailed(true);
  };

  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-navy-800 to-ocean-700 text-white/70 ${className}`}>
        <MapPin size={32} aria-hidden="true" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={resolveSrc(src)} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={handleError} className={className} />;
}
