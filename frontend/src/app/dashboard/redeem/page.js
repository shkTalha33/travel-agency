'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Gift, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plane,
  Building2,
  Ticket,
  FileText,
  MapPin,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { RedeemSkeleton } from '@/components/common/Skeletons';
import useMockLoading from '@/hooks/useMockLoading';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationContext';
import { useSelector, useDispatch } from '@/store';
import { fetchPointsSummary } from '@/store/slices/pointsSlice';
import { fetchMyRedemptions, requestRedemption } from '@/store/slices/redemptionsSlice';

export default function RedeemPage() {
  const pageLoading = useMockLoading();
  const { currentUser, currentMembership: m } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const rv = copy.redeemView || {};
  const membershipName = copy.levels?.[m?.id]?.name || (isEn ? (m?.id === 'ambassador' ? 'Ambassador' : m?.id === 'elite_ambassador' ? 'Elite Ambassador' : 'Member') : (m?.name || 'Miembro'));

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

  if (pageLoading || !currentUser) return <RedeemSkeleton />;

  const handleQuickAmount = (val) => {
    const num = Math.min(val, available);
    setAmount(String(num));
    if (error) setError('');
  };

  const handleOpenConfirm = (e) => {
    e?.preventDefault();
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 50) {
      const msg = rv.errMin50 || (isEn ? 'The minimum redemption amount is 50 points.' : 'La cantidad mínima de redención es de 50 puntos.');
      setError(msg);
      toast(msg, 'error');
      return;
    }
    if (n > available) {
      const msg = rv.errMax || (isEn ? 'You cannot redeem more than your available points.' : 'No puedes redimir más de tus puntos disponibles.');
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
      
      const nLoc = copy.notifications || {};
      addNotification({
        type: 'redeem',
        title: nLoc.redemptionSubmittedTitle || (isEn ? 'Redemption Request Submitted' : 'Solicitud de Canje Enviada'),
        message: typeof nLoc.redemptionSubmittedMsg === 'function'
          ? nLoc.redemptionSubmittedMsg(n)
          : (isEn ? `Your request to redeem ${n} PTS is under review.` : `Tu solicitud de canje de ${n} PTS está en revisión.`),
        link: '/dashboard/redeem',
        read: false,
      });

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
        return <Badge variant="success" size="xs">{rv.statusApproved || (isEn ? 'Approved' : 'Aprobado')}</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="xs">{rv.statusRejected || (isEn ? 'Rejected' : 'Rechazado')}</Badge>;
      case 'pending':
      default:
        return <Badge variant="gold" size="xs">{rv.statusPending || (isEn ? 'Pending Review' : 'En Revisión')}</Badge>;
    }
  };

  const rewardTypeOptions = [
    { 
      value: 'travel_credit', 
      label: rv.optTravelCredit || (isEn ? 'Travel Credit / Package Discount' : 'Crédito de Viaje / Descuento en Paquete'),
      icon: <Plane className="w-4 h-4 text-ocean-600" />
    },
    { 
      value: 'hotel_upgrade', 
      label: rv.optHotelUpgrade || (isEn ? 'Hotel Room Upgrade' : 'Mejora de Habitación de Hotel'),
      icon: <Building2 className="w-4 h-4 text-ocean-600" />
    },
    { 
      value: 'gift_card', 
      label: rv.optGiftCard || (isEn ? 'VIP Experience / Activity' : 'Experiencia VIP / Excursión'),
      icon: <Ticket className="w-4 h-4 text-ocean-600" />
    },
  ];

  const formatRewardType = (type) => {
    switch (type) {
      case 'travel_credit':
        return rv.optTravelCredit || (isEn ? 'Travel Credit / Package Discount' : 'Crédito de Viaje / Descuento en Paquete');
      case 'hotel_upgrade':
        return rv.optHotelUpgrade || (isEn ? 'Hotel Room Upgrade' : 'Mejora de Habitación de Hotel');
      case 'gift_card':
        return rv.optGiftCard || (isEn ? 'VIP Experience / Activity' : 'Experiencia VIP / Excursión');
      default:
        return type ? type.replace(/_/g, ' ') : (isEn ? 'Travel Credit' : 'Crédito de Viaje');
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Banner: Solid Obsidian, Flat, Borderless, Shadowless */}
      <div className="rounded-2xl bg-navy-950 p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-gold-400">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gold-300">
                {rv.balanceTitle || (isEn ? 'REDEEMABLE BALANCE' : 'BALANCE REDIMIBLE')}
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {available.toLocaleString()}
              </h1>
              <span className="text-base sm:text-lg font-bold text-gold-400 tracking-wider">PTS</span>
            </div>

            <p className="text-xs sm:text-sm text-sand-300">
              {rv.approxValue || (isEn ? 'Estimated equivalent:' : 'Equivalente estimado:')}{' '}
              <strong className="text-gold-300 font-bold font-mono">
                ${(available * 1.5).toLocaleString()} USD
              </strong>{' '}
              {rv.inTravelCredit || (isEn ? 'in travel credit.' : 'en crédito de viaje.')}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap sm:flex-col gap-2 pt-2 md:pt-0 border-t border-white/10 md:border-0 text-xs text-sand-200">
            <div className="flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-medium">{rv.minPtsPerRedemption || (isEn ? 'Min. 50 PTS per redemption' : 'Mín. 50 PTS por canje')}</span>
            </div>
            <div className="flex items-center gap-2 bg-navy-900 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0" />
              <span className="font-medium">{rv.fastReview || (isEn ? 'Priority review by concierge' : 'Revisión prioritaria por concierge')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Redemption Form */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 space-y-5">
          <div className="border-b border-sand-100 pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-950 flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-ocean-600" />
              <span>{rv.formCardTitle || (isEn ? 'New Redemption Request' : 'Nueva Solicitud de Canje')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {rv.formCardSubtitle || (isEn ? 'Enter the points you wish to redeem for your reservation.' : 'Indica la cantidad de puntos que deseas canjear para tu reserva.')}
            </p>
          </div>

          <form onSubmit={handleOpenConfirm} className="space-y-5" noValidate>
            {/* Amount input & Quick selectors */}
            <div className="space-y-2.5">
              <Input
                id="amount"
                label={rv.amountLabel || (isEn ? 'Amount of points (minimum 50)' : 'Cantidad de puntos (mínimo 50)')}
                type="number"
                min="50"
                max={available}
                placeholder={rv.amountPlaceholder || 'Ej. 100'}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                required
              />

              {available >= 50 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {rv.quickPresets || (isEn ? 'Quick select:' : 'Selección rápida:')}
                  </span>
                  {[50, 100, 200, 500].filter((val) => val <= available).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAmount(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        Number(amount) === val
                          ? 'bg-navy-950 text-white'
                          : 'bg-sand-100 hover:bg-sand-200 text-navy-900'
                      }`}
                    >
                      {val} PTS
                    </button>
                  ))}
                  {available > 50 && (
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(available)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        Number(amount) === available
                          ? 'bg-navy-950 text-white'
                          : 'bg-gold-100 hover:bg-gold-200 text-gold-900'
                      }`}
                    >
                      {rv.allPoints || (isEn ? 'All balance' : 'Todo el balance')} ({available.toLocaleString()} PTS)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Reward Type Dropdown */}
            <div>
              <Select
                id="rewardType"
                label={rv.rewardType || (isEn ? 'Reward type' : 'Tipo de recompensa')}
                options={rewardTypeOptions}
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
                required
              />
            </div>

            {/* Destination / Offer details */}
            <div>
              <Input
                id="paymentDetails"
                label={rv.detailsLabel || (isEn ? 'Destination or Package Details (Optional)' : 'Detalles de Destino o Paquete (Opcional)')}
                type="text"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder={rv.detailsPlaceholder || (isEn ? 'e.g. Cancún Riviera Maya, Punta Cana Resort...' : 'Ej. Cancún Riviera Maya, Resort Punta Cana...')}
              />
            </div>

            {/* Notes / Special Instructions */}
            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-navy-800 mb-1.5">
                {rv.notesLabel || (isEn ? 'Additional Notes / Special Preferences (Optional)' : 'Notas Adicionales / Preferencias Especiales (Opcional)')}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={rv.notesPlaceholder || (isEn ? 'Specify any special requests or trip preferences...' : 'Especifica cualquier requerimiento o preferencia para tu viaje...')}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-sand-300 focus:border-ocean-600 rounded-xl outline-none transition-colors resize-none font-medium text-navy-900"
              />
            </div>

            {available < 50 && (
              <div className="p-3.5 bg-amber-50 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{rv.min50ReqHint || (isEn ? 'A minimum of 50 accumulated points is required to request a redemption.' : 'Se requiere un mínimo de 50 puntos acumulados para solicitar un canje.')}</span>
              </div>
            )}

            {/* Submit Action with Primary Red Button */}
            <div className="pt-2 flex items-center justify-end">
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={available < 50 || loading}
                className="rounded-xl px-7 font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2 text-gold-300 shrink-0" />
                <span>{rv.submitBtn || (isEn ? 'Redeem points' : 'Redimir puntos')}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Quick Summary & Perks */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 space-y-3.5">
            <div className="border-b border-sand-100 pb-2.5">
              <h3 className="font-serif text-base font-bold text-navy-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ocean-600" />
                <span>{rv.perksTitle || (isEn ? 'Redemption Perks' : 'Beneficios de Canje')}</span>
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sand-100 text-navy-950 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[10px]">
                  1
                </span>
                <span>
                  <strong className="text-navy-950 block">{rv.perk1Title || (isEn ? 'Real Travel Savings' : 'Ahorro Real en Viajes')}</strong>
                  {rv.perk1Desc || (isEn ? 'Apply points directly toward hotels, tours, or full vacation packages.' : 'Aplica tus puntos en hoteles, tours o paquetes vacacionales completos.')}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sand-100 text-navy-950 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[10px]">
                  2
                </span>
                <span>
                  <strong className="text-navy-950 block">{rv.perk2Title || (isEn ? 'Concierge Assistance' : 'Asistencia de Concierge')}</strong>
                  {rv.perk2Desc || (isEn ? 'Our booking specialists handle your reservations smoothly and quickly.' : 'Nuestros especialistas se encargan de tus reservas de forma rápida y personalizada.')}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sand-100 text-navy-950 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[10px]">
                  3
                </span>
                <span>
                  <strong className="text-navy-950 block">{rv.perk3Title || (isEn ? 'No Hidden Fees' : 'Sin Cargos Ocultos')}</strong>
                  {rv.perk3Desc || (isEn ? 'Clear point-to-dollar valuation with transparent redemption history.' : 'Valoración clara de puntos a dólares con historial transparente.')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Redemption History: Flat, Clean, Borderless Container */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        <div className="border-b border-sand-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-950 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-ocean-600" />
              <span>{rv.historyTitle || (isEn ? 'Redemption History' : 'Historial de Redenciones')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {rv.historySubtitle || (isEn ? 'Record of your past point redemption requests and approval status.' : 'Registro de tus solicitudes de canje de puntos y estado de aprobación.')}
            </p>
          </div>
          {redemptionsList.length > 0 && (
            <Badge variant="ocean" size="sm">
              {redemptionsList.length} {isEn ? (redemptionsList.length === 1 ? 'request' : 'requests') : (redemptionsList.length === 1 ? 'solicitud' : 'solicitudes')}
            </Badge>
          )}
        </div>

        {redemptionsList.length === 0 ? (
          <EmptyState
            icon={<Gift className="w-8 h-8 text-sand-400" />}
            title={rv.noHistory || (isEn ? 'No redemption requests yet' : 'Aún no has realizado solicitudes de redención.')}
            description={rv.noHistoryDesc || (isEn ? 'When you submit a redemption request, it will appear here with its real-time status.' : 'Cuando solicites un canje de puntos, aparecerá aquí con su estado en tiempo real.')}
            className="border-0 py-10"
          />
        ) : (
          <div className="divide-y divide-sand-100">
            {redemptionsList.map((item) => (
              <div
                key={item._id || item.id}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-bold text-navy-950 capitalize">
                      {formatRewardType(item.rewardType)}
                    </span>
                  </div>
                  {item.paymentDetails && (
                    <p className="text-xs text-navy-700 font-medium flex items-center gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-ocean-600 shrink-0" />
                      <span>{item.paymentDetails}</span>
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-[11px] text-slate-500 italic pl-5">
                      "{item.notes}"
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 pl-5">
                    {new Date(item.createdAt).toLocaleString(isEn ? 'en-US' : 'es-ES', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="font-bold text-rose-600 font-mono text-sm sm:text-base">
                    -{item.points?.toLocaleString()} PTS
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleSubmit}
        loading={loading}
        title={rv.confirmDialogTitle || (isEn ? 'Confirm Redemption Request' : 'Confirmar Solicitud de Canje')}
        message={
          typeof rv.confirmDialogMsg === 'function'
            ? rv.confirmDialogMsg(amount)
            : (isEn
                ? `You are requesting to redeem ${amount} points. This request will be reviewed by our concierge team.`
                : `Solicitarás redimir ${amount} puntos. Esta solicitud será revisada por nuestro equipo de concierge.`)
        }
        confirmText={rv.confirmDialogBtn || (isEn ? 'Confirm & Submit' : 'Confirmar y Enviar')}
      />
    </div>
  );
}
