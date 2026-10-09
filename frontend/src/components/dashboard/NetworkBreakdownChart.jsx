'use client';

import React, { useState } from 'react';
import { Users, ShieldCheck, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NetworkBreakdownChart({ network = {}, membership = {} }) {
  const { isEn } = useLanguage();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const l1Count = network?.level1?.length || 0;
  const l2Count = network?.level2?.length || 0;
  const totalMembers = l1Count + l2Count;

  // Real percentages from API
  const l1Pct = totalMembers > 0 ? (l2Count > 0 ? Math.round((l1Count / totalMembers) * 100) : 100) : 0;
  const l2Pct = totalMembers > 0 && l2Count > 0 ? 100 - l1Pct : 0;

  // Donut chart math
  const size = 150;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Stroke Dasharray for segments
  const l1Dash = totalMembers === 0 ? 0 : (l1Pct / 100) * circumference;
  const l2Dash = totalMembers === 0 ? 0 : (l2Pct / 100) * circumference;

  const twoLevels = (membership?.referralLevelsAllowed || 1) >= 2;

  // Brand Reddish Color Palette
  const PRIMARY_RED = '#AA303E'; // Primary Brand Crimson Red
  const SECONDARY_RED = '#DF7987'; // Soft Rose Reddish Tone

  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sand-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-ocean-50 text-ocean-600">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-xl font-bold text-navy-950">
              {isEn ? 'Network Distribution' : 'Distribución de Red'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isEn ? 'Active referral tiers & network depth breakdown.' : 'Desglose de afiliados directos y sub-red.'}
          </p>
        </div>

        <Link
          href="/dashboard/network"
          className="text-xs font-bold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
        >
          <span>{isEn ? 'View Tree' : 'Ver Red'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-1">
        {/* SVG Donut in Brand Reddish Shades */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Subtle background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f8fafc"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {totalMembers === 0 ? (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
            ) : (
              <>
                {/* Level 1 Segment (Primary Brand Red: #AA303E) */}
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={PRIMARY_RED}
                  strokeWidth={hoveredSegment === 'l1' ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={`${l1Dash} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap={l2Count > 0 ? 'round' : 'butt'}
                  fill="transparent"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredSegment('l1')}
                  onMouseLeave={() => setHoveredSegment(null)}
                />

                {/* Level 2 Segment (Secondary Rose Red: #DF7987) */}
                {twoLevels && l2Count > 0 && (
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={SECONDARY_RED}
                    strokeWidth={hoveredSegment === 'l2' ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={`${l2Dash} ${circumference}`}
                    strokeDashoffset={-l1Dash}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment('l2')}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                )}
              </>
            )}
          </svg>

          {/* Center Info Count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-serif text-3xl font-bold text-navy-950">
              {totalMembers}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {isEn ? (totalMembers === 1 ? 'Member' : 'Members') : (totalMembers === 1 ? 'Afiliado' : 'Afiliados')}
            </span>
          </div>
        </div>

        {/* Legend / Breakdown List in Reddish Styles */}
        <div className="w-full sm:flex-1 space-y-3">
          {/* Level 1 Item */}
          <div
            className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
              hoveredSegment === 'l1' ? 'bg-ocean-50/90 ring-1 ring-ocean-200' : 'bg-sand-50 hover:bg-sand-100/70'
            }`}
            onMouseEnter={() => setHoveredSegment('l1')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ocean-600 shrink-0" />
                <span className="text-xs font-bold text-navy-950">
                  {isEn ? 'Level 1 (Direct Referrals)' : 'Nivel 1 (Referidos Directos)'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-ocean-700">{l1Count}</span>
            </div>
            <div className="w-full bg-sand-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-ocean-600 h-full rounded-full transition-all duration-500" style={{ width: `${l1Pct}%` }} />
            </div>
          </div>

          {/* Level 2 Item */}
          {twoLevels && (
            <div
              className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                hoveredSegment === 'l2' ? 'bg-ocean-50/90 ring-1 ring-ocean-200' : 'bg-sand-50 hover:bg-sand-100/70'
              }`}
              onMouseEnter={() => setHoveredSegment('l2')}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-ocean-400 shrink-0" />
                  <span className="text-xs font-bold text-navy-950">
                    {isEn ? 'Level 2 (Sub-network)' : 'Nivel 2 (Sub-red)'}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-ocean-600">{l2Count}</span>
              </div>
              <div className="w-full bg-sand-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-ocean-400 h-full rounded-full transition-all duration-500" style={{ width: `${l2Pct}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Capacity */}
      <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isEn ? 'Network Capacity' : 'Capacidad de Red'}</span>
        </span>
        <span className="font-bold text-navy-900">
          {twoLevels ? (isEn ? '2 Referral Levels' : '2 Niveles de Referidos') : (isEn ? '1 Referral Level' : '1 Nivel de Referidos')}
        </span>
      </div>
    </div>
  );
}
