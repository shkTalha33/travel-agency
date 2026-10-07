'use client';

import React, { useState, useEffect } from 'react';
import MembershipCard from '@/components/membership/MembershipCard';
import Reveal from '@/components/common/Reveal';
import Badge from '@/components/ui/Badge';
import LampContainer from '@/components/ui/LampContainer';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles } from 'lucide-react';
import { MEMBERSHIP_LEVELS } from '@/data/memberships';
import { membershipApi } from '@/lib/apiClient';

const pct = (n) => (n !== undefined && n !== null ? `${Math.round(n > 1 ? n : n * 100)}%` : '—');

export default function MembershipContent() {
  const { copy, isEn } = useLanguage();
  const [tiers, setTiers] = useState([]);
  const m = copy.membershipPage || {};

  useEffect(() => {
    membershipApi
      .getAll()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setTiers(res.data);
        }
      })
      .catch(() => {
        // Fallback to local static tiers if network delay
      });
  }, []);

  // Use dynamic tiers if loaded, otherwise fallback to static default levels
  const displayLevels =
    tiers.length > 0
      ? tiers.map((t) => ({
          id: t.category,
          name: isEn ? t.nameEn || t.name : t.name,
          tag: isEn ? t.tagEn || t.tag : t.tag,
          description: isEn ? t.subtitleEn || t.subtitle : t.subtitle,
          level1Rate: t.level1Rate > 1 ? t.level1Rate / 100 : t.level1Rate,
          level2Rate: t.level2Rate > 1 ? t.level2Rate / 100 : t.level2Rate,
          referralLevelsAllowed: t.maxReferralLevel,
          perks: isEn ? (t.perksEn?.length ? t.perksEn : t.perks) : t.perks,
          qualification: isEn ? t.qualificationEn || t.qualification : t.qualification,
        }))
      : Object.values(MEMBERSHIP_LEVELS);

  return (
    <div className="bg-sand-50">
      {/* Aceternity Lamp Spotlight Header */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LampContainer className="py-12 sm:py-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300 border border-gold-400/30">
              <Sparkles size={12} className="text-gold-400" aria-hidden="true" />
              {m.eyebrow}
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
              {m.title}
            </h1>
            <p className="mt-4 max-w-2xl text-center text-sm sm:text-base text-slate-300 leading-relaxed">
              {m.desc}
            </p>
          </LampContainer>
        </div>
      </section>

      <section className="relative overflow-hidden pb-20 lg:pb-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayLevels.map((l, i) => (
              <Reveal key={l.id} delay={i * 70}>
                <MembershipCard level={l} />
              </Reveal>
            ))}
          </div>

          {/* Detailed Comparison Matrix */}
          <Reveal>
            <div className="mt-20 rounded-3xl border border-sand-200/90 bg-white/90 p-6 shadow-card backdrop-blur-sm sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-200/80 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                      <Sparkles size={14} aria-hidden="true" />
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">{m.compare}</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{m.compareHint}</p>
                </div>
                <Badge variant="ocean" size="md">{m.matrixTitle || 'VIP Benefits Matrix'}</Badge>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm" aria-label={m.caption}>
                  <thead>
                    <tr className="border-b border-sand-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="pb-4 pt-2 font-semibold text-slate-700">{m.colLevel}</th>
                      <th className="pb-4 pt-2 font-semibold text-center">{m.colNetwork}</th>
                      <th className="pb-4 pt-2 font-semibold text-center">{m.colL1}</th>
                      <th className="pb-4 pt-2 font-semibold text-center">{m.colL2}</th>
                      <th className="pb-4 pt-2 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {displayLevels.map((lvl) => {
                      const isElite = lvl.id === 'elite_ambassador';
                      return (
                        <tr key={lvl.id} className={`transition-colors hover:bg-sand-50/60 ${isElite ? 'bg-gold-50/20 font-semibold' : ''}`}>
                          <td className="py-4 font-serif text-base font-bold text-navy-900">
                            <div className="flex items-center gap-2">
                              <span>{lvl.name}</span>
                              {lvl.isPopular && <Badge variant="ocean" size="sm">{copy.common.popular || 'Popular'}</Badge>}
                              {isElite && <Badge variant="gold" size="sm">{copy.common.topTier || 'Top Tier'}</Badge>}
                            </div>
                          </td>
                          <td className="py-4 text-center text-slate-700">
                            {lvl.referralLevelsAllowed} {m.levelsSuffix || 'niveles'}
                          </td>
                          <td className="py-4 text-center font-bold text-navy-900">{pct(lvl.level1Rate)}</td>
                          <td className="py-4 text-center font-bold text-navy-900">{pct(lvl.level2Rate)}</td>
                          <td className="py-4 text-center">
                            <Badge variant={lvl.id} size="sm">{lvl.tag}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
