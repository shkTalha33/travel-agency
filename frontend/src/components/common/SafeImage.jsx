'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

/** Image with a graceful branded fallback if the remote image fails to load. */
export default function SafeImage({ src, alt, className = '', priority = false }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-navy-800 to-ocean-700 text-white/70 ${className}`}>
        <MapPin size={32} aria-hidden="true" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} onError={() => setFailed(true)} className={className} />;
}
