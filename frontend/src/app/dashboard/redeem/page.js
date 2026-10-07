'use client';

import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { List, ListItem } from '@/components/ui/List';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { requestRedemption } from '@/store/slices/redemptionsSlice';
import { getRedemptions } from '@/lib/memberData';

export default function RedeemPage() {
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy } = useLanguage();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const rv = copy.redeemView || {};

  // Prefer cached Redux points if available, fallback to user stats
  const reduxSummary = useSelector((state) => state.points.summary);
  const available = reduxSummary.availablePoints > 0 ? reduxSummary.availablePoints : currentUser?.stats?.availablePoints || 0;

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = getRedemptions(currentUser);

  if (m.referralLevelsAllowed === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-navy-900">{t('panel.redeem')}</h1>
        <EmptyState
          icon={<Gift size={28} />}
          title={rv.noPointsTitle || 'No tienes puntos para redimir'}
          description={rv.noPointsDesc || 'Genera puntos de referido como Miembro Activo o superior para poder solicitar una redención.'}
        />
      </div>
    );
  }

  const open = () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 50) {
      const msg = rv.errMin50 || 'La cantidad mínima de redención es de 50 puntos.';
      setError(msg);
      toast(msg, 'error');
      return;
    }
    if (n > available) {
      const msg = rv.errMax || 'No puedes redimir más de tus puntos disponibles.';
      setError(msg);
      toast(msg, 'error');
      return;
    }
    setError('');
    setConfirm(true);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const n = Number(amount);
      await dispatch(requestRedemption({ points: n, rewardType: 'travel_credit' }));
      setLoading(false);
      setConfirm(false);
      setAmount('');
      toast(rv.successToast || 'Solicitud de redención enviada y procesada correctamente.');
    } catch (err) {
      setLoading(false);
      setConfirm(false);
      toast(err.message || rv.failToast || 'Error al enviar la solicitud', 'error');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">{rv.title || 'Redimir puntos'}</h1>
        <p className="mt-1 text-sm text-slate-600">{rv.subtitle || 'Envía una solicitud. Nuestro equipo la revisará y te contactará.'}</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{rv.available || 'Disponibles'}</p>
            <p className="mt-1 text-4xl font-bold text-navy-900">{available}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{rv.redeemable || 'Redimibles'}</p>
            <p className="mt-1 text-4xl font-bold text-ocean-600">{available}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
          <Input
            id="cantidad"
            label={rv.amountLabel || 'Cantidad de puntos (mínimo 50)'}
            type="number"
            min="50"
            placeholder={rv.amountPlaceholder || 'Ej. 100'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={error}
            className="sm:flex-1"
          />
          <Button variant="gold" size="lg" className="sm:mt-[1.4rem]" onClick={open} disabled={available < 50}>
            {rv.submitBtn || 'Redimir puntos'}
          </Button>
        </div>
        {available < 50 && (
          <p className="mt-3 text-sm text-slate-500">
            {rv.min50ReqHint || 'Se requiere un mínimo de 50 puntos acumulados para solicitar un canje.'}
          </p>
        )}
      </Card>

      <Card>
        <h2 className="mb-2 font-sans text-lg font-bold text-navy-900">{rv.historyTitle || 'Historial de redenciones'}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">{rv.noHistory || 'Aún no has realizado redenciones.'}</p>
        ) : (
          <List>
            {history.map((t) => (
              <ListItem
                key={t.id}
                title={t.purchaseDescription}
                subtitle={t.date}
                trailing={<strong className="text-sm text-rose-600">{t.points} {copy.common.points}</strong>}
              />
            ))}
          </List>
        )}
      </Card>

      <ConfirmDialog
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={submit}
        loading={loading}
        title={rv.confirmDialogTitle || 'Confirmar solicitud'}
        message={typeof rv.confirmDialogMsg === 'function' ? rv.confirmDialogMsg(amount) : `Solicitarás redimir ${amount} puntos.`}
        confirmText={rv.confirmDialogBtn || 'Enviar solicitud'}
      />
    </div>
  );
}
