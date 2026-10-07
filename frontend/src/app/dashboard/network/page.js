'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import CardSpotlight from '@/components/ui/CardSpotlight';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import NetworkTree from '@/components/referral/NetworkTree';
import MemberRow from '@/components/referral/MemberRow';
import MemberDetailModal from '@/components/referral/MemberDetailModal';
import InviteButton from '@/components/referral/InviteButton';
import { ListSkeleton } from '@/components/common/Skeletons';
import Button from '@/components/ui/Button';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchNetworkData } from '@/store/slices/networkSlice';
import { getNetwork } from '@/lib/memberData';

export default function NetworkPage() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy } = useLanguage();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('tree');
  const [selected, setSelected] = useState(null);

  const reduxNetwork = useSelector((state) => state.network.network);
  const nv = copy.networkView || {};
  const dash = copy.dashboard || {};

  useEffect(() => {
    dispatch(fetchNetworkData());
  }, [dispatch]);

  if (m.referralLevelsAllowed === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">{t('panel.network')}</h1>
        <EmptyState
          icon={<Users size={28} />}
          title={nv.notAvailableTitle || 'Tu red aún no está disponible'}
          description={nv.notAvailableDesc || 'Los beneficios de referidos se habilitan al convertirte en Miembro Activo. Conoce los niveles de membresía.'}
        />
        <Link href="/membership"><Button>{dash.viewMemberships || 'Ver membresías'}</Button></Link>
      </div>
    );
  }

  const net = (reduxNetwork.level1 && reduxNetwork.level1.length > 0)
    ? reduxNetwork
    : getNetwork(currentUser);
  const twoLevels = m.referralLevelsAllowed >= 2;
  const tabs = [
    { id: 'tree', label: nv.tabTree || 'Jerarquía' },
    { id: 'l1', label: nv.tabL1 || 'Nivel 1', count: net.level1.length },
    ...(twoLevels ? [{ id: 'l2', label: nv.tabL2 || 'Nivel 2', count: net.level2.length }] : []),
  ];
  const flat = tab === 'l1' ? net.level1 : net.level2;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">{t('panel.network')}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {nv.descL1 || 'Nivel 1: tus referidos directos.'}
          {twoLevels && (nv.descL2 || ' Nivel 2: los referidos de tus referidos.')}
        </p>
      </div>

      <CardSpotlight className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-ocean-50/20 to-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 px-3 py-0.5 text-xs font-bold text-ocean-700">
              {nv.inviteCardPill || 'Tu enlace exclusivo de invitación'}
            </span>
            <p className="mt-2 text-sm text-slate-600">
              {(nv.inviteCardDesc || 'Comparte tu enlace o tu código')} <strong className="font-bold text-navy-900 text-base">{currentUser.referralCode}</strong> {(nv.inviteCardDescSuffix || 'para ganar puntos cuando viajen.')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InviteButton link={currentUser.referralLink} variant="primary" size="md" className="shadow-sm" />
          </div>
        </div>
      </CardSpotlight>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} className="w-fit max-w-full" label={nv.tabsAria || 'Vista de la red'} />

      <Card className="rounded-3xl border-slate-200/80 shadow-soft">
        {loading ? (
          <ListSkeleton />
        ) : net.level1.length === 0 ? (
          <EmptyState
            title={dash.noActivityTitle || 'Aún no tienes actividad de referidos.'}
            description={dash.noActivityDesc || 'Invita a una persona para comenzar a construir tu red.'}
            className="border-0"
          />
        ) : tab === 'tree' ? (
          <NetworkTree level1={net.level1} level2={net.level2} showLevel2={twoLevels} onSelect={setSelected} />
        ) : (
          <ul className="divide-y divide-slate-100">
            {flat.map((p) => (
              <li key={p.id}>
                <MemberRow
                  person={p}
                  onSelect={setSelected}
                  subtitle={tab === 'l1' ? `${nv.joinedOn || 'Se unió el'} ${p.joinedDate}` : `${nv.referredBy || 'Referido por'} ${p.sponsorName}`}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <MemberDetailModal person={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
