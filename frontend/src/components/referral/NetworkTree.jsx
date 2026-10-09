'use client';

import React, { useState } from 'react';
import { ChevronDown, CornerDownRight, Network, Users } from 'lucide-react';
import MemberRow from './MemberRow';
import AnimatedTooltip from '@/components/ui/AnimatedTooltip';
import { useLanguage } from '@/context/LanguageContext';

/** Expandable hierarchy: Level 1 members with their Level 2 children nested beneath. */
export default function NetworkTree({ level1 = [], level2 = [], showLevel2 = false, onSelect }) {
  const { copy } = useLanguage();
  const nv = copy.networkView || {};
  const [open, setOpen] = useState({});
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));

  const avatarPreview = level1.slice(0, 5).map((m) => ({
    name: m.name,
    role: `${copy.common.level} 1 · +${m.pointsGeneratedToUpline} ${copy.common.pts}`,
    avatar: m.avatar,
  }));

  if (level1.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-sand-50/70 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-100 text-slate-400">
          <Users size={24} aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-semibold text-navy-900">{nv.noDirectTitle || 'Aún no tienes referidos directos'}</p>
        <p className="mt-1 text-xs text-slate-500">{nv.noDirectDesc || 'Comparte tu código o enlace para comenzar a ganar puntos.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Network Overview Bar with Aceternity Animated Tooltip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand-100/70 p-3 text-xs text-slate-600 sm:px-4">
        <span className="flex items-center gap-1.5 font-bold text-navy-900">
          <Network size={15} className="text-ocean-600" aria-hidden="true" />
          {nv.treeActiveTitle || 'Árbol de Referidos Activo'}
        </span>

        {avatarPreview.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">{nv.leadersLabel || 'Líderes de tu red:'}</span>
            <AnimatedTooltip items={avatarPreview} />
          </div>
        )}

        <div className="flex items-center gap-3 font-semibold">
          <span className="rounded-lg bg-white px-2 py-0.5 border border-sand-200 text-navy-900">
            <strong>{level1.length}</strong> {nv.directLabel || 'Directos'}
          </span>
          {showLevel2 && (
            <span className="rounded-lg bg-white px-2 py-0.5 border border-sand-200 text-ocean-700">
              <strong>{level2.length}</strong> {nv.subNetworkLabel || 'Sub-red'}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {level1.map((p) => {
          const children = showLevel2 ? level2.filter((c) => c.sponsorId === p.id) : [];
          const expanded = !!open[p.id];
          const panelId = `tree-${p.id}`;

          return (
            <li key={p.id} className="rounded-2xl border border-sand-200/80 bg-white/70 p-1.5 shadow-soft transition-all duration-200 hover:border-ocean-300 hover:bg-white sm:p-2">
              <div className="flex items-center gap-1">
                {children.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggle(p.id)}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    aria-label={`${expanded ? (nv.collapseAria || 'Contraer') : (nv.expandAria || 'Expandir')} referidos de ${p.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-slate-600 transition-colors hover:bg-ocean-100 hover:text-ocean-700"
                  >
                    <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`} aria-hidden="true" />
                  </button>
                ) : (
                  <span className="w-8 shrink-0" aria-hidden="true" />
                )}

                <MemberRow
                  person={p}
                  onSelect={onSelect}
                  className="flex-1"
                  subtitle={`${copy.common.level} 1${showLevel2 ? ` · ${children.length} ${children.length === 1 ? (nv.directReferralSingular || 'referido directo') : (nv.directReferralPlural || 'referidos directos')}` : ''}`}
                />
              </div>

              {children.length > 0 && expanded && (
                <div id={panelId} className="relative mb-2 ml-6 mt-1 space-y-1 sm:ml-10">
                  {/* Visual tree vertical branch */}
                  <div className="absolute -left-3 bottom-4 top-1 w-px bg-gradient-to-b from-ocean-400 to-sand-300" aria-hidden="true" />

                  <ul className="space-y-1 pl-2">
                    {children.map((c) => (
                      <li key={c.id} className="relative flex items-center">
                        <CornerDownRight size={14} className="mr-1 text-ocean-500 shrink-0" aria-hidden="true" />
                        <MemberRow
                          person={c}
                          onSelect={onSelect}
                          subtitle={nv.subReferralLabel || 'Nivel 2 (Sub-referido)'}
                          className="flex-1 rounded-xl bg-sand-50/70 border border-sand-200/50 hover:bg-white"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
