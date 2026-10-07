'use client';

import React from 'react';
import { Award, Check, Compass, Crown, Sparkles, Waves, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import CardSpotlight from '@/components/ui/CardSpotlight';
import { useLanguage } from '@/context/LanguageContext';

const ICONS = {
  member: Compass,
  active_member: Waves,
  ambassador: Award,
  elite_ambassador: Crown,
};

const SKIN = {
  member: {
    wrap: 'border-slate-200/90 bg-white text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300',
    iconBg: 'bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs',
    rateBg: 'bg-slate-50 border-slate-100',
    spotlight: 'rgba(0, 0, 0, 0.03)',
  },
  active_member: {
    wrap: 'border-slate-200/90 bg-white text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300',
    iconBg: 'bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs',
    rateBg: 'bg-slate-50 border-slate-100',
    spotlight: 'rgba(0, 0, 0, 0.03)',
  },
  ambassador: {
    wrap: 'border-slate-200/90 bg-white text-slate-700 shadow-sm hover:shadow-md hover:border-slate-300',
    iconBg: 'bg-gradient-to-br from-navy-900 to-navy-950 text-gold-300 border border-gold-400/20 shadow-xs',
    rateBg: 'bg-slate-50 border-slate-100',
    spotlight: 'rgba(0, 0, 0, 0.03)',
  },
  elite_ambassador: {
    wrap: 'border-navy-900 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 text-white shadow-md hover:shadow-lg relative overflow-hidden',
    iconBg: 'bg-gold-500 text-navy-950 border-gold-400 shadow-xs',
    rateBg: 'bg-navy-800/80 border-white/10 backdrop-blur-sm',
    spotlight: 'rgba(212, 180, 90, 0.15)',
  },
};

function pct(n) {
  return n ? `${Math.round(n * 100)}%` : '—';
}

export default function MembershipCard({ level, current = false }) {
  const { copy } = useLanguage();
  const i18n = copy.levels[level.id] || level;
  const m = copy.membershipPage;
  const skin = SKIN[level.id] || SKIN.member;
  const Icon = ICONS[level.id] || Compass;
  const dark = level.id === 'elite_ambassador';

  return (
    <CardSpotlight
      color={skin.spotlight}
      radius={260}
      className={`lift relative flex h-full flex-col rounded-3xl border transition-all duration-200 ${skin.wrap}`}
    >
      {/* Decorative glow for elite */}
      {dark && (
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" aria-hidden="true" />
      )}

      {current && (
        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
          <Sparkles size={11} aria-hidden="true" />
          {copy.common.yourLevel}
        </span>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${skin.iconBg}`}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <Badge variant={dark ? 'gold' : level.id} size="md" className="rounded-full px-3 py-0.5 text-xs font-semibold">
            {i18n.tag}
          </Badge>
        </div>

        <h3 className={`mt-5 font-serif text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
          {i18n.name}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {i18n.description}
        </p>

        {/* Rates pill box */}
        <div className={`mt-6 grid grid-cols-2 gap-2 rounded-2xl border p-3 ${skin.rateBg}`}>
          <div className="text-center">
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {m.colL1}
            </p>
            <p className={`mt-0.5 font-serif text-2xl font-bold ${dark ? 'text-gold-300' : 'text-navy-900'}`}>
              {pct(level.level1Rate)}
            </p>
          </div>
          <div className={`border-l text-center ${dark ? 'border-white/10' : 'border-sand-200'}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              {m.colL2}
            </p>
            <p className={`mt-0.5 font-serif text-2xl font-bold ${dark ? 'text-gold-300' : 'text-navy-900'}`}>
              {pct(level.level2Rate)}
            </p>
          </div>
        </div>

        {/* Feature checklist */}
        <ul className="mt-6 flex-1 space-y-3 text-sm">
          {i18n.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-gold-400/20 text-gold-300' : 'bg-ocean-100 text-ocean-700'}`}>
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className={dark ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
            </li>
          ))}
          {i18n.limitations.map((f) => (
            <li key={f} className={`flex items-start gap-2.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                <X size={12} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardSpotlight>
  );
}
