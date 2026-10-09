'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Share2, Sparkles, Copy, Check } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import NetworkTree from '@/components/referral/NetworkTree';
import MemberRow from '@/components/referral/MemberRow';
import MemberDetailModal from '@/components/referral/MemberDetailModal';
import InviteButton from '@/components/referral/InviteButton';
import { ListSkeleton, NetworkSkeleton } from '@/components/common/Skeletons';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import useMockLoading from '@/hooks/useMockLoading';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchNetworkData } from '@/store/slices/networkSlice';
import { getNetwork } from '@/lib/memberData';

export default function NetworkPage() {
  const loading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('tree');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);

  const reduxNetwork = useSelector((state) => state.network.network);
  const nv = copy.networkView || {};
  const dash = copy.dashboard || {};
  const membershipName = copy.levels?.[m?.id]?.name || m?.name || (isEn ? 'Member' : 'Miembro');

  useEffect(() => {
    dispatch(fetchNetworkData());
  }, [dispatch]);

  if (loading || !currentUser) return <NetworkSkeleton />;

  const copyRefCode = async () => {
    try {
      await navigator.clipboard.writeText(currentUser?.referralCode || '');
      setCopied(true);
      toast(nv.copyCodeSuccess || (isEn ? 'Referral code copied!' : '¡Código de referido copiado!'));
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      toast(nv.copyCodeFail || (isEn ? 'Could not copy code' : 'No se pudo copiar el código'), 'error');
    }
  };

  const copyRefLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUser?.referralLink || '');
      toast(nv.copySuccess || (isEn ? 'Referral link copied!' : '¡Enlace de referido copiado!'));
    } catch (_) {
      toast(nv.copyFail || (isEn ? 'Could not copy link' : 'No se pudo copiar el enlace'), 'error');
    }
  };

  const net = (reduxNetwork?.level1 && reduxNetwork?.level1.length > 0)
    ? reduxNetwork
    : getNetwork(currentUser);
  const twoLevels = (m?.referralLevelsAllowed || 0) >= 2;
  const isFreeMember = (m?.referralLevelsAllowed || 0) === 0;

  const tabs = [
    { id: 'tree', label: nv.tabTree || 'Hierarchy' },
    { id: 'l1', label: nv.tabL1 || 'Level 1', count: net?.level1?.length || 0 },
    ...(twoLevels ? [{ id: 'l2', label: nv.tabL2 || 'Level 2', count: net?.level2?.length || 0 }] : []),
  ];
  const flat = tab === 'l1' ? (net?.level1 || []) : (net?.level2 || []);

  return (
    <div className="w-full space-y-5">
      {/* Top Banner: Solid Obsidian, Flat, Borderless */}
      <div className="rounded-2xl bg-navy-950 p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {nv.referralNetworkEyebrow || 'REFERRAL NETWORK'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t('panel.network')}
            </h1>

            <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
              {nv.descL1}
              {twoLevels && nv.descL2}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 pt-2 md:pt-0 border-t border-white/10 md:border-0">
            <div className="rounded-2xl bg-navy-900 p-4 flex items-center gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {nv.yourReferralCode || 'YOUR REFERRAL CODE'}
                </p>
                <p className="font-mono text-lg font-bold text-gold-300 mt-0.5">
                  {currentUser?.referralCode || 'N/A'}
                </p>
              </div>
              <button
                type="button"
                onClick={copyRefCode}
                className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white transition-all cursor-pointer border-0 outline-none focus:outline-none focus:ring-0 active:outline-none"
                title={nv.copyCode || (isEn ? 'Copy Referral Code' : 'Copiar Código de Referido')}
              >
                {copied ? <Check size={16} className="text-ocean-400" /> : <Copy size={16} />}
              </button>
            </div>

            <InviteButton link={currentUser?.referralLink} variant="primary" size="md" className="rounded-xl font-bold" />
          </div>
        </div>
      </div>

      {/* Upgrade Banner for Standard Members */}
      {isFreeMember && (
        <div className="rounded-2xl bg-white px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-bold text-sm text-navy-900">
                {nv.unlockPointRewards}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {nv.unlockPointRewardsDesc}
              </p>
            </div>
          </div>
          <Link href="/membership" className="shrink-0">
            <Button variant="primary" size="sm" className="rounded-xl">
              {dash.viewMemberships || 'View Memberships'}
            </Button>
          </Link>
        </div>
      )}

      {/* Tabs Switcher */}
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} className="w-fit max-w-full" label={nv.tabsAria || 'Vista de la red'} />

      {/* Network Tree / Table Container: Flat, Borderless */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        {loading ? (
          <ListSkeleton />
        ) : (!net?.level1 || net.level1.length === 0) ? (
          <EmptyState
            icon={<Users size={28} />}
            title={dash.noActivityTitle}
            description={dash.noActivityDesc}
            actionText={nv.copyLink || 'Copy Referral Link'}
            onAction={copyRefLink}
            className="py-10"
          />
        ) : tab === 'tree' ? (
          <NetworkTree level1={net.level1} level2={net.level2} showLevel2={twoLevels} onSelect={setSelected} />
        ) : (
          <ul className="divide-y divide-sand-100">
            {flat.map((p) => (
              <li key={p.id}>
                <MemberRow
                  person={p}
                  onSelect={setSelected}
                  subtitle={tab === 'l1' ? `${nv.joinedOn || 'Joined on'} ${p.joinedDate}` : `${nv.referredBy || 'Referred by'} ${p.sponsorName}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <MemberDetailModal person={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
