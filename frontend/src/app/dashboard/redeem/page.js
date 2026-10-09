'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gift, Sparkles, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary } from '@/store/slices/pointsSlice';
import { fetchMyRedemptions, requestRedemption } from '@/store/slices/redemptionsSlice';

export default function RedeemPage() {
  const { currentUser, currentMembership: m, refreshUser } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const rv = copy.redeemView || {};

  const reduxSummary = useSelector((state) => state.points?.summary || {});
  const redemptionsState = useSelector((state) => state.redemptions || {});
  const redemptionsList = redemptionsState.items || [];

  const userStats = currentUser?.stats || currentUser?.pointsStats || {};
  const available = (reduxSummary.availablePoints !== undefined && reduxSummary.availablePoints > 0)
    ? reduxSummary.availablePoints 
    : (userStats.availablePoints || 0);

  const initialOffer = searchParams?.get('offer') || searchParams?.get('title') || '';

  const [amount, setAmount] = useState('');
  const [rewardType, setRewardType] = useState('travel_credit');
  const [paymentDetails, setPaymentDetails] = useState(initialOffer ? decodeURIComponent(initialOffer) : '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPointsSummary());
    dispatch(fetchMyRedemptions());
  }, [dispatch]);

  useEffect(() => {
    if (initialOffer && !paymentDetails) {
      setPaymentDetails(decodeURIComponent(initialOffer));
    }
  }, [initialOffer]);

  const handleOpenConfirm = (e) => {
    e?.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 50) {
      const msg = rv.errMin50 || (isEn ? 'Minimum redemption is 50 points.' : 'La cantidad mínima de redención es de 50 puntos.');
      setError(msg);
      toast(msg, 'error');
      return;
    }
    if (n > available) {
      const msg = rv.errMax || (isEn ? 'Cannot redeem more than your available points.' : 'No puedes redimir más de tus puntos disponibles.');
      setError(msg);
      toast(msg, 'error');
      return;
    }
    setError('');
    setConfirm(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const n = Number(amount);
      await dispatch(
        requestRedemption({
          points: n,
          rewardType,
          paymentDetails: paymentDetails.trim() || undefined,
          notes: notes.trim() || undefined,
        })
      );
      setLoading(false);
      setConfirm(false);
      setAmount('');
      setPaymentDetails('');
      setNotes('');
      toast(rv.successToast || (isEn ? 'Redemption request submitted successfully!' : '¡Solicitud de redención enviada con éxito!'));
      dispatch(fetchPointsSummary(true));
      dispatch(fetchMyRedemptions(true));
    } catch (err) {
      setLoading(false);
      setConfirm(false);
      toast(err.message || (isEn ? 'Error submitting redemption request' : 'Error al enviar la solicitud'), 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <Badge variant="success" size="xs">{isEn ? 'Approved' : 'Aprobado'}</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="xs">{isEn ? 'Rejected' : 'Rechazado'}</Badge>;
      case 'pending':
      default:
        return <Badge variant="gold" size="xs">{isEn ? 'Pending Review' : 'En Revisión'}</Badge>;
    }
  };

  const rewardTypeOptions = [
    { value: 'travel_credit', label: isEn ? 'Travel Credit / Package Discount' : 'Crédito de Viaje / Descuento en Paquete' },
    { value: 'hotel_upgrade', label: isEn ? 'Hotel Room Upgrade' : 'Mejora de Habitación de Hotel' },
    { value: 'gift_card', label: isEn ? 'VIP Experience / Activity' : 'Experiencia VIP / Excursión' },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-navy-950">{rv.title || (isEn ? 'Redeem points' : 'Redimir puntos')}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rv.subtitle || (isEn ? 'Submit a request. Our team will review it and contact you promptly.' : 'Envía una solicitud. Nuestro equipo la revisará y te contactará a la brevedad.')}
        </p>
      </div>

      {/* Points Summary & Redemption Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left balance summary card */}
        <div className="lg:col-span-1 rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-7 text-white shadow-lg border border-navy-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold-400 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {isEn ? 'REDEEMABLE BALANCE' : 'BALANCE REDIMIBLE'}
              </span>
            </div>
            <p className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              {available.toLocaleString()} <span className="text-lg font-sans font-semibold text-gold-400">PTS</span>
            </p>
            <p className="mt-3 text-xs text-slate-300">
              {isEn ? 'Approximate value' : 'Equivalente aproximado'}: <strong className="text-gold-300">${(available * 1.5).toLocaleString()} USD</strong> {isEn ? 'in travel credit.' : 'en crédito de viaje.'}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-slate-300">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {isEn ? 'Min. 50 PTS per redemption' : 'Mín. 50 PTS por redención'}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              {isEn ? 'Fast review by concierge' : 'Revisión rápida por concierge'}
            </p>
          </div>
        </div>

        {/* Right redemption form */}
        <Card className="lg:col-span-2 rounded-3xl p-6 sm:p-8">
          <h2 className="font-bold text-lg text-navy-950 mb-1 flex items-center gap-2">
            <Gift className="w-5 h-5 text-ocean-600" />
            {isEn ? 'New Redemption Request' : 'Nueva Solicitud de Canje'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isEn ? 'Enter the amount of points you want to redeem.' : 'Indica la cantidad de puntos que deseas canjear para tu reserva.'}
          </p>

          <form onSubmit={handleOpenConfirm} className="space-y-4">
            <div>
              <Input
                id="amount"
                label={rv.amountLabel || (isEn ? 'Amount Of Points (Minimum 50)' : 'Cantidad de Puntos (Mínimo 50)')}
                type="number"
                min="50"
                max={available}
                placeholder={rv.amountPlaceholder || 'Ej. 65'}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                required
              />
            </div>

            <div>
              <Select
                id="rewardType"
                label={isEn ? 'Reward Type' : 'Tipo de Recompensa'}
                options={rewardTypeOptions}
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1.5">
                {isEn ? 'Destination or Package Details (Optional)' : 'Detalles de Destino o Paquete (Opcional)'}
              </label>
              <input
                type="text"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder={isEn ? 'e.g. Cancún Riviera Maya, Punta Cana Resort...' : 'e.g. Cancún Riviera Maya, Punta Cana Resort...'}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-ocean-600 rounded-xl outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="ocean"
                size="lg"
                type="submit"
                className="w-full sm:w-auto"
                disabled={available < 50}
              >
                {rv.submitBtn || (isEn ? 'Redeem points' : 'Redimir puntos')}
              </Button>
            </div>

            {available < 50 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{rv.min50ReqHint || (isEn ? 'You need at least 50 points accumulated to submit a redemption request.' : 'Se requiere un mínimo de 50 puntos acumulados para solicitar un canje.')}</span>
              </div>
            )}
          </form>
        </Card>
      </div>

      {/* Redemption History Card */}
      <Card className="rounded-3xl p-6 sm:p-8">
        <h2 className="font-bold text-lg text-navy-950 mb-1 flex items-center gap-2">
          <Clock className="w-5 h-5 text-navy-700" />
          {rv.historyTitle || (isEn ? 'Redemption History' : 'Historial de Redenciones')}
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          {isEn ? 'Record of your past point redemption requests and their approval statuses.' : 'Registro de tus solicitudes de canje de puntos y estado de aprobación.'}
        </p>

        {redemptionsList.length === 0 ? (
          <EmptyState
            icon={<Gift className="w-7 h-7 text-sand-400" />}
            title={rv.noHistory || (isEn ? 'No redemptions yet' : 'Aún no has realizado solicitudes de redención.')}
            description={isEn ? 'When you request a points redemption, it will appear here.' : 'Tus solicitudes de canje aparecerán aquí con su estado en tiempo real.'}
            className="border-0 py-8"
          />
        ) : (
          <div className="divide-y divide-sand-100 overflow-hidden">
            {redemptionsList.map((item) => (
              <div
                key={item._id || item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-bold text-navy-950 capitalize">
                      {item.rewardType?.replace(/_/g, ' ') || 'Crédito de Viaje'}
                    </span>
                  </div>
                  {item.paymentDetails && (
                    <p className="text-xs text-navy-600 mt-1 font-medium">{item.paymentDetails}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-bold text-rose-600 text-sm">
                    -{item.points} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleSubmit}
        loading={loading}
        title={rv.confirmDialogTitle || (isEn ? 'Confirm Redemption Request' : 'Confirmar Solicitud de Canje')}
        message={
          isEn
            ? `You are requesting to redeem ${amount} points. Our concierge will review your request.`
            : `Solicitarás redimir ${amount} puntos para descuentos de viaje. El equipo revisará tu solicitud.`
        }
        confirmText={rv.confirmDialogBtn || (isEn ? 'Confirm & Submit' : 'Confirmar y Enviar')}
      />
    </div>
  );
}
