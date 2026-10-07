'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { Calendar, Network, Sparkles, UserCheck } from 'lucide-react';
import { STATUS_LABEL } from './MemberRow';
import { useLanguage } from '@/context/LanguageContext';

export default function MemberDetailModal({ person, onClose }) {
  const { copy } = useLanguage();
  const nv = copy.networkView || {};
  const statusName = copy.levels[person?.status]?.name || STATUS_LABEL[person?.status] || 'Miembro';

  return (
    <Modal
      isOpen={!!person}
      onClose={onClose}
      title={person?.name}
      description={nv.detailModalTitle || 'Detalle del miembro de tu red de afiliados'}
      maxWidth="max-w-md"
    >
      {person && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <Avatar src={person.avatar} name={person.name} size="lg" className="ring-2 ring-white shadow-sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-bold text-navy-900">{person.name}</p>
                <Badge variant={person.status} size="sm">{statusName}</Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">{person.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Network size={14} className="text-ocean-600" />
                <span>{nv.detailNetworkLevel || 'Nivel de red'}</span>
              </div>
              <p className="mt-1.5 font-serif text-lg font-bold text-navy-900">{copy.common.level} {person.level}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Calendar size={14} className="text-ocean-600" />
                <span>{nv.detailJoined || 'Se unió'}</span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-navy-900">{person.joinedDate}</p>
            </div>

            <div className="col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>{nv.detailPtsGenerated || 'Puntos generados para ti'}</span>
                </div>
                <span className="font-serif text-xl font-bold text-emerald-700">+{person.pointsGeneratedToUpline} {copy.common.pts}</span>
              </div>
            </div>

            {person.sponsorName && (
              <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <UserCheck size={14} className="text-gold-600" />
                  <span>{nv.detailSponsoredBy || 'Patrocinado por'}</span>
                </div>
                <p className="mt-1 text-sm font-bold text-navy-900">{person.sponsorName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
