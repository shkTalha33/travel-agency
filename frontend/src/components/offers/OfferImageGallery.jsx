'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';

export default function OfferImageGallery({ images = [], title = '', badge = '' }) {
  const [failedUrls, setFailedUrls] = useState(new Set());
  
  // Only include non-empty strings and valid images that haven't failed to load
  const rawList = Array.isArray(images) ? images : [images];
  const safeImages = rawList
    .filter((img) => Boolean(img) && typeof img === 'string' && img.trim().length > 0)
    .filter((img) => !failedUrls.has(img));

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef(null);

  const handleImageError = (failedSrc) => {
    if (!failedSrc) return;
    setFailedUrls((prev) => {
      const next = new Set(prev);
      next.add(failedSrc);
      return next;
    });
  };

  // Adjust activeIndex if safeImages length shrinks
  useEffect(() => {
    if (activeIndex >= safeImages.length && safeImages.length > 0) {
      setActiveIndex(0);
    }
  }, [safeImages.length, activeIndex]);

  // Auto-scroll slideshow timer (runs only if multiple images)
  useEffect(() => {
    if (safeImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [safeImages.length, isHovered]);

  // Keep thumbnail in view inside the horizontal thumbnail container without scrolling the window
  useEffect(() => {
    if (thumbnailsRef.current && safeImages.length > 1) {
      const container = thumbnailsRef.current;
      const activeThumb = container.children[activeIndex];
      if (activeThumb) {
        const targetLeft = activeThumb.offsetLeft - (container.clientWidth - activeThumb.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden rounded-3xl bg-slate-100 flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-400">No Image Available</span>
      </div>
    );
  }

  const currentImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="space-y-4">
      {/* Main Single Image Viewport */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden rounded-3xl bg-slate-100 group select-none"
      >
        <SafeImage
          key={currentImage}
          src={currentImage}
          alt={`${title} - Photo ${activeIndex + 1}`}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* Optional Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md shadow-md border border-gold-400/40">
              <Sparkles size={12} className="text-gold-400" />
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Small Thumbnails Strip Underneath (ONLY shown if multiple images exist) */}
      {safeImages.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex items-center gap-3 overflow-x-auto py-1 px-0.5 scrollbar-none"
        >
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 aspect-[4/3] w-20 sm:w-24 md:w-28 overflow-hidden rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-navy-950 ring-offset-2 ring-offset-white opacity-100 scale-102'
                    : 'opacity-65 hover:opacity-100 border border-slate-200 hover:border-slate-400'
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  onError={handleImageError}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
