'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';

export default function OfferImageGallery({ images = [], title = '', badge = '' }) {
  const safeImages = (Array.isArray(images) ? images : [images]).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef(null);

  // Auto-scroll slideshow timer (runs only if multiple images)
  useEffect(() => {
    if (safeImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [safeImages.length, isHovered]);

  // Keep thumbnail in view if scrolling container
  useEffect(() => {
    if (thumbnailsRef.current && safeImages.length > 1) {
      const activeThumb = thumbnailsRef.current.children[activeIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeIndex, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden rounded-3xl bg-sand-200 border border-slate-200/90 shadow-sm flex items-center justify-center">
        <span className="text-sm font-semibold text-slate-400">No Image Available</span>
      </div>
    );
  }

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Single Image Viewport */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden rounded-3xl bg-sand-200 border border-slate-200/90 shadow-sm group select-none"
      >
        <SafeImage
          key={currentImage}
          src={currentImage}
          alt={`${title} - Photo ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Optional Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950/85 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md shadow-md border border-gold-400/40">
              <Sparkles size={12} className="text-gold-400" />
              {badge}
            </span>
          </div>
        )}

        {/* Slide Counter Indicator */}
        {safeImages.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10 shadow-sm">
              {activeIndex + 1} / {safeImages.length}
            </span>
          </div>
        )}

        {/* Navigation Arrows (Only if multiple images) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-navy-950/70 hover:bg-navy-900 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-navy-950/70 hover:bg-navy-900 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Small Thumbnails Strip Underneath (ONLY shown if multiple images) */}
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
                className={`relative shrink-0 aspect-[4/3] w-20 sm:w-24 md:w-28 overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'ring-3 ring-ocean-600 ring-offset-2 ring-offset-sand-100 scale-105 shadow-md opacity-100'
                    : 'opacity-60 hover:opacity-100 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-ocean-600/15 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
