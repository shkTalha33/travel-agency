'use client';

import React from 'react';
import { Award, Check, Compass, Crown, Sparkles, Waves, X, Zap } from 'lucide-react';
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
    wrap: 'border-slate-200/90 bg-white text-slate-700 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300',
    iconBg: 'bg-slate-900 text-slate-100 shadow-md ring-4 ring-slate-100',
    rateBg: 'bg-slate-50/90 border border-slate-200/80',
    spotlight: 'rgba(0, 0, 0, 0.03)',
    checkIcon: 'bg-slate-100 text-slate-700',
    badge: 'bg-slate-100 text-slate-800 border-slate-200/80',
  },
  active_member: {
    wrap: 'border-emerald-200/90 bg-white text-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300',
    iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50',
    rateBg: 'bg-emerald-50/50 border border-emerald-100',
    spotlight: 'rgba(5, 150, 105, 0.05)',
    checkIcon: 'bg-emerald-100 text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  },
  ambassador: {
    wrap: 'border-sky-200/90 bg-white text-slate-700 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300',
    iconBg: 'bg-gradient-to-tr from-sky-600 to-blue-500 text-white shadow-md shadow-sky-500/20 ring-4 ring-sky-50',
    rateBg: 'bg-sky-50/50 border border-sky-100',
    spotlight: 'rgba(2, 132, 199, 0.05)',
    checkIcon: 'bg-sky-100 text-sky-700',
    badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
  },
  elite_ambassador: {
    wrap: 'border-amber-400/80 bg-gradient-to-b from-[#1C1009] via-[#150B06] to-[#0A0503] text-white shadow-xl shadow-amber-950/20 hover:shadow-2xl hover:border-gold-300 transition-all duration-300 relative overflow-hidden',
    iconBg: 'bg-gradient-to-tr from-[#AA303E] via-rose-500 to-amber-400 text-white shadow-lg shadow-rose-900/40 ring-4 ring-gold-500/20',
    rateBg: 'bg-white/5 border border-gold-500/30 backdrop-blur-md',
    spotlight: 'rgba(212, 160, 23, 0.2)',
    checkIcon: 'bg-gold-500/20 text-gold-300',
    badge: 'bg-gold-500/20 text-gold-300 border-gold-500/40',
  },
};

function pct(n) {
  if (n === undefined || n === null || n === '' || n === 0 || n === '0' || Number(n) === 0) return '—';
  const num = Number(n);
  if (isNaN(num)) return '—';
  if (num >= 1) return `${Math.round(num)}%`;
  return `${Math.round(num * 100)}%`;
}

export default function MembershipCard({ level, current = false }) {
  const { copy, isEn } = useLanguage();
  const i18n = copy.levels?.[level.id] || {};
  const m = copy.membershipPage || {};
  const skin = SKIN[level.id] || SKIN.member;
  const Icon = ICONS[level.id] || Compass;
  const dark = level.id === 'elite_ambassador';

  const name = level.name || i18n.name || 'Member';
  const tag = level.tag || i18n.tag || '';
  const description = level.description || i18n.description || '';
  const perksList = Array.isArray(level.perks) && level.perks.length > 0
    ? level.perks
    : (Array.isArray(i18n.features) ? i18n.features : []);
  const limitationsList = (!level.perks || level.perks.length === 0) && Array.isArray(i18n.limitations)
    ? i18n.limitations
    : [];

  const l1Rate = level.level1Rate ?? (level.directRate || 0);
  const l2Rate = level.level2Rate ?? (level.indirectRate || 0);

  return (
    <CardSpotlight
      color={skin.spotlight}
      radius={260}
      className={`lift relative flex h-full flex-col rounded-3xl border transition-all duration-300 ${skin.wrap}`}
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
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${skin.iconBg}`}>
            <Icon size={20} aria-hidden="true" />
          </span>
          {tag && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border whitespace-nowrap leading-none ${skin.badge}`}>
              {tag}
            </span>
          )}
        </div>

        <h3 className={`mt-5 font-serif text-2xl font-bold tracking-tight ${dark ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-amber-100' : 'text-navy-950'}`}>
          {name}
        </h3>
        {description && (
          <p className={`mt-1.5 text-xs font-medium leading-relaxed ${dark ? 'text-sand-300/80' : 'text-slate-500'}`}>
            {description}
          </p>
        )}

        {/* Rates pill box */}
        <div className={`mt-5 grid grid-cols-2 gap-3 rounded-2xl p-3.5 transition-all ${skin.rateBg}`}>
          <div className="text-center">
            <p className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-sand-300/80' : 'text-slate-500'}`}>
              {m.colL1 || (isEn ? 'Direct (L1)' : 'Directo (N1)')}
            </p>
            <p className={`mt-1 font-serif text-2xl font-black ${dark ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-amber-300' : 'text-navy-950'}`}>
              {pct(l1Rate)}
            </p>
          </div>
          <div className={`border-l text-center ${dark ? 'border-gold-500/20' : 'border-slate-200'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-sand-300/80' : 'text-slate-500'}`}>
              {m.colL2 || (isEn ? 'Indirect (L2)' : 'Indirecto (N2)')}
            </p>
            <p className={`mt-1 font-serif text-2xl font-black ${dark ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-200 to-amber-300' : 'text-navy-950'}`}>
              {pct(l2Rate)}
            </p>
          </div>
        </div>

        {/* Feature checklist */}
        <ul className="mt-6 flex-1 space-y-2.5 text-xs">
          {perksList.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${skin.checkIcon}`}>
                <Check size={10} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className={dark ? 'text-sand-200' : 'text-slate-700'}>{f}</span>
            </li>
          ))}
          {limitationsList.map((f, idx) => (
            <li key={idx} className={`flex items-start gap-2.5 leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                <X size={10} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {level.qualification && (
          <div className={`mt-6 pt-4 border-t text-xs ${dark ? 'border-gold-500/20 text-sand-300' : 'border-slate-200/80 text-slate-600'}`}>
            <div className="flex items-start gap-1.5">
              <Zap className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${dark ? 'text-gold-400' : 'text-[#AA303E]'}`} />
              <div>
                <strong className={`capitalize ${dark ? 'text-gold-300' : 'text-navy-950'} mr-1`}>
                  {m.qualificationLabel || (isEn ? 'Qualification:' : 'Calificación:')}
                </strong>
                <span className="text-[11px] leading-relaxed opacity-90">{level.qualification}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardSpotlight>
  );
}
