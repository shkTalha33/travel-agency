'use client';

import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const STATUS_LABEL = {
  member: 'Miembro',
  active_member: 'Miembro Activo',
  ambassador: 'Embajador',
  elite_ambassador: 'Embajador Élite',
};

/** Presentational row for a person in the network. */
export default function MemberRow({ person, subtitle, onSelect, className = '' }) {
  const { copy } = useLanguage();
  const nv = copy.networkView || {};
  const statusName = copy.levels[person.status]?.name || STATUS_LABEL[person.status] || 'Miembro';
  const isActive = person.status === 'active_member' || person.status === 'ambassador' || person.status === 'elite_ambassador';

  return (
    <div className={`group flex items-center gap-3.5 rounded-2xl p-2.5 transition-all duration-200 hover:bg-white/80 hover:shadow-soft sm:p-3 ${className}`}>
      <div className="relative shrink-0">
        <Avatar src={person.avatar} name={person.name} size="md" className="ring-2 ring-sand-200" />
        {isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-navy-900 group-hover:text-ocean-700 transition-colors">
            {person.name}
          </p>
          <Badge variant={person.status} size="sm" className="hidden rounded-full px-2 py-0.2 sm:inline-flex">
            {statusName}
          </Badge>
        </div>
        <p className="truncate text-xs font-medium text-slate-500">{subtitle}</p>
      </div>

      <Tooltip content={nv.ptsTooltip || 'Puntos de referido que esta persona generó para ti en tu red.'}>
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-xs">
          <Sparkles size={12} className="text-emerald-500" aria-hidden="true" />
          <span>+{person.pointsGeneratedToUpline} {copy.common.pts}</span>
        </div>
      </Tooltip>

      {onSelect && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onSelect(person)}
          aria-label={`${nv.detailBtn || 'Detalle'} ${person.name}`}
          className="rounded-xl px-2.5 text-xs text-slate-600 hover:text-navy-900"
        >
          <span className="hidden sm:inline">{nv.detailBtn || 'Detalle'}</span>
          <ChevronRight size={14} className="sm:-mr-1" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
