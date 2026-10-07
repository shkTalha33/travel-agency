'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Coins,
  PlusCircle,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

export default function AdminPointsPage() {
  const { t, isEn } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Purchase Points Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [offerTitle, setOfferTitle] = useState('Punta Cana Todo Incluido');
  const [purchasePoints, setPurchasePoints] = useState(150);
  const [submitting, setSubmitting] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTransactions();
  }, [typeFilter, pagination.page]);

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      const [usersRes, offersRes] = await Promise.all([
        adminApi.getUsers('limit=100'),
        adminApi.getOffers('limit=50'),
      ]);
      if (usersRes.data && usersRes.data.users) {
        setUsers(usersRes.data.users);
      }
      if (offersRes.data && offersRes.data.offers) {
        setOffers(offersRes.data.offers);
      }
    } catch (err) {
      console.error('Error loading prerequisites:', err);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      params.append('page', pagination.page);
      params.append('limit', 20);

      const res = await adminApi.getTransactions(params.toString());
      if (res.data) {
        setTransactions(res.data.transactions || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferSelectChange = (e) => {
    const offId = e.target.value;
    setSelectedOfferId(offId);
    const matched = offers.find((o) => o._id === offId);
    if (matched) {
      setOfferTitle(matched.title);
      setPurchasePoints(matched.pointsReward || 100);
    }
  };

  const handleAssignPoints = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!selectedUserId) {
      newErrors.user = isEn ? 'Please select the purchasing member.' : 'Por favor seleccione al miembro comprador.';
    }

    if (!offerTitle || !offerTitle.trim()) {
      newErrors.title = isEn ? 'Package description is required.' : 'La descripción del paquete o viaje es obligatoria.';
    }

    if (!purchasePoints || Number(purchasePoints) <= 0 || isNaN(Number(purchasePoints))) {
      newErrors.points = isEn ? 'Please enter a valid points amount greater than 0.' : 'Ingrese una cantidad válida de puntos mayor a 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setAlert(null);
    setResultData(null);

    try {
      const res = await adminApi.assignPurchasePoints({
        purchaserUserId: selectedUserId,
        purchasePoints: Number(purchasePoints),
        offerTitle: offerTitle.trim(),
        offerId: selectedOfferId || undefined,
      });

      setResultData(res.data);
      setAlert({ type: 'success', text: t('points.successDistributed', '¡Puntos asignados y comisiones multinivel calculadas con éxito!') });
      loadTransactions();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al asignar puntos de compra' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUser = users.find((u) => u._id === selectedUserId);

  return (
    <AdminShell
      title={t('points.title', 'Libro Mayor de Puntos & Asignación de Comisiones')}
      subtitle={t('points.subtitle', 'Registro de compras offline, activación de miembros y liquidación de comisiones multinivel (L1 / L2)')}
      actionButton={
        <button
          onClick={() => {
            setResultData(null);
            setErrors({});
            setAssignModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('points.assignBtn', 'Asignar Puntos de Venta')}</span>
        </button>
      }
    >
      {/* Alert */}
      {alert && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in ${
            alert.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            <span className="font-semibold">{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="p-1 hover:opacity-75 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rules Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border border-navy-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                {t('points.rulesTitle', 'Reglas de Comisiones Multinivel')}
              </span>
            </div>
            <p className="text-xs text-sand-300">
              {t('points.rulesDesc', 'Al registrar una compra: el patrocinador directo (Nivel 1) recibe el 100% de los puntos y el patrocinador superior (Nivel 2) recibe el 50%, sujeto al nivel de membresía.')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-gold-500/20 border border-gold-500/30 text-gold-400 font-bold text-xs">
              N1: 100%
            </span>
            <span className="px-3 py-1 rounded-lg bg-ocean-500/20 border border-ocean-500/30 text-ocean-300 font-bold text-xs">
              N2: 50%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Status tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: '', label: t('points.allTransactions', 'Todas las Transacciones') },
            { id: 'referral_l1', label: t('points.l1Commissions', 'Comisión Nivel 1 (100%)') },
            { id: 'referral_l2', label: t('points.l2Commissions', 'Comisión Nivel 2 (50%)') },
            { id: 'purchase_points', label: t('points.purchases', 'Compras de Paquetes') },
            { id: 'redemption', label: t('points.redemptions', 'Redenciones') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTypeFilter(tab.id);
                setPagination({ ...pagination, page: 1 });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-navy-950 text-gold-400 shadow-sm'
                  : 'bg-sand-50 text-navy-600 hover:bg-sand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-navy-500 shrink-0">
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{pagination.total}</span> {t('points.ledgerRecords', 'registros en ledger')}
        </span>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-100/70 border-b border-sand-200 text-navy-800 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{t('points.colDescription', 'Descripción / Paquete')}</th>
                <th className="px-5 py-3.5">{t('points.colType', 'Tipo de Movimiento')}</th>
                <th className="px-5 py-3.5">{t('points.colBeneficiary', 'Beneficiario')}</th>
                <th className="px-5 py-3.5">{t('points.colSource', 'Miembro Origen')}</th>
                <th className="px-5 py-3.5">{t('points.colPoints', 'Puntos')}</th>
                <th className="px-5 py-3.5">{t('points.colDate', 'Fecha')}</th>
                <th className="px-5 py-3.5">{t('points.colStatus', 'Estado')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-navy-500">
                    {t('points.loadingLedger', 'Cargando movimientos del libro mayor...')}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-navy-500">
                    {t('points.noTransactions', 'No se encontraron transacciones registradas.')}
                  </td>
                </tr>
              ) : (
                transactions.map((tItem) => (
                  <tr key={tItem._id} className="hover:bg-sand-50/80 transition-colors">
                    {/* Description */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy-950">{tItem.purchaseDescription || 'Transacción'}</p>
                      <p className="text-[10px] text-navy-400 font-mono">TX: {tItem._id.slice(-8)}</p>
                    </td>

                    {/* Movement Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          tItem.type === 'referral_l1'
                            ? 'bg-gold-50 text-gold-900 border border-gold-300'
                            : tItem.type === 'referral_l2'
                            ? 'bg-ocean-50 text-ocean-900 border border-ocean-300'
                            : tItem.type === 'purchase_points'
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                            : tItem.type === 'redemption'
                            ? 'bg-rose-50 text-rose-900 border border-rose-300'
                            : 'bg-sand-100 text-navy-800'
                        }`}
                      >
                        {tItem.type?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Beneficiary */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy-950">{tItem.userId?.fullname || 'Usuario'}</p>
                      <p className="text-[11px] text-navy-500">{tItem.userId?.email}</p>
                    </td>

                    {/* Source Person */}
                    <td className="px-5 py-4 text-[11px] text-navy-600">
                      {tItem.sourceUserId?.fullname || tItem.sourcePersonName || 'Sistema'}
                    </td>

                    {/* Points */}
                    <td className="px-5 py-4 font-mono">
                      <span
                        className={`font-bold text-sm ${
                          tItem.points >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {tItem.points >= 0 ? `+${tItem.points}` : tItem.points} PTS
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-[11px] text-navy-500">
                      {new Date(tItem.createdAt).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {tItem.status || 'Completado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Offline Purchase Modal using Portal Modal Component */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setResultData(null);
          setErrors({});
        }}
        title={t('points.modalTitle', 'Asignar Puntos de Compra Offline')}
        subtitle={isEn ? 'Assign points & distribute upline commissions' : 'Asigna puntos y calcula comisiones multinivel'}
        icon={Coins}
        maxWidth="max-w-xl"
      >
        {resultData ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <h4 className="font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t('points.successDistributed', '¡Comisiones Distribuidas Exitosamente!')}
              </h4>
              <p className="text-xs mt-1">
                {isEn ? 'Purchaser' : 'Comprador'}: <strong>{resultData.purchaser?.name}</strong> • {isEn ? 'Points awarded' : 'Puntos asignados'}:{' '}
                <strong>{resultData.purchasePoints} PTS</strong>
              </p>
            </div>

            <div className="border border-sand-200 rounded-xl p-4 bg-sand-50 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-800">
                {t('points.uplinesAwarded', 'Comisiones Multinivel Asignadas a la Línea Ascendente:')}
              </p>
              {resultData.distributedCommissions?.length > 0 ? (
                resultData.distributedCommissions.map((comm) => (
                  <div
                    key={comm.userId}
                    className="p-3 bg-white rounded-lg border border-sand-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-navy-950">{isEn ? 'Level' : 'Nivel'} {comm.level}: {comm.name}</span>
                      <span className="text-[10px] text-navy-500 block font-semibold">{t('points.appliedRate', 'Tasa aplicada')}: {(comm.rate * 100)}%</span>
                    </div>
                    <span className="text-sm font-bold text-gold-700 font-mono">
                      +{comm.points} PTS
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-navy-500 italic">
                  {t('points.noUpline', 'El comprador no tiene patrocinadores calificados en su línea ascendente.')}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setResultData(null);
                setAssignModalOpen(false);
              }}
              className="w-full py-2.5 bg-navy-950 text-gold-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md hover:bg-navy-900 transition-colors"
            >
              {t('common.close', 'Cerrar')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAssignPoints} className="space-y-4" noValidate>
            {/* Select Purchaser with Custom Luxury Dropdown & Error */}
            <div>
              <CustomSelect
                label={t('points.selectPurchaser', 'Seleccionar Miembro Comprador')}
                required
                placeholder={t('points.selectPurchaserPlaceholder', '-- Seleccionar Miembro --')}
                value={selectedUserId}
                error={errors.user}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  if (errors.user) setErrors((prev) => ({ ...prev, user: '' }));
                }}
                options={users.map((u) => ({
                  value: u._id,
                  label: `${u.fullname} (${u.email})`,
                  sublabel: `${isEn ? 'Code' : 'Código'}: ${u.referralCode || 'N/A'} • ${isEn ? 'Sponsor' : 'Patrocinador'}: ${u.sponsorId?.fullname || 'Directo'}`,
                  badge: u.membershipId?.replace('_', ' '),
                }))}
              />
            </div>

            {/* Select Travel Package with Custom Luxury Dropdown & Description Input with Error */}
            <div>
              <CustomSelect
                label={t('points.selectOffer', 'Paquete / Oferta de Viaje')}
                placeholder={t('points.customPackagePlaceholder', '-- Paquete Personalizado --')}
                value={selectedOfferId}
                onChange={handleOfferSelectChange}
                options={[
                  {
                    value: '',
                    label: t('points.customPackagePlaceholder', '-- Paquete Personalizado --'),
                    sublabel: isEn ? 'Enter custom description & points below' : 'Ingrese descripción y puntos personalizados abajo',
                  },
                  ...offers.map((o) => ({
                    value: o._id,
                    label: `${o.title} — ${o.destination}`,
                    sublabel: `$${o.priceUSD} USD • ${o.duration || 'Flexible'}`,
                    badge: `+${o.pointsReward} PTS`,
                  })),
                ]}
              />

              <div className="mt-2.5">
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => {
                    setOfferTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="Descripción del paquete comprado..."
                  className={`w-full px-4 py-2.5 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 text-navy-900 font-medium transition-colors ${
                    errors.title
                      ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                      : 'border-sand-300 focus:border-gold-500'
                  }`}
                />
                {errors.title && (
                  <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Purchase Points Input with Field-Level Error */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('points.purchasePoints', 'Puntos Base de la Compra (PTS)')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={purchasePoints}
                onChange={(e) => {
                  setPurchasePoints(e.target.value);
                  if (errors.points) setErrors((prev) => ({ ...prev, points: '' }));
                }}
                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 font-bold text-navy-950 font-mono transition-colors ${
                  errors.points
                    ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                    : 'border-sand-300 focus:border-gold-500'
                }`}
              />
              {errors.points && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.points}</span>
                </p>
              )}
            </div>

            {/* Commission Calculation Preview */}
            {purchasePoints > 0 && selectedUser && (
              <div className="p-3.5 rounded-xl bg-gold-50/70 border border-gold-300/80 space-y-1.5 text-xs text-navy-900">
                <p className="font-bold text-gold-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  {t('points.previewTitle', 'Vista Previa de Liquidación Automática:')}
                </p>
                <p className="text-[11px] text-navy-700">
                  {t('points.buyerWillReceive', '• Comprador recibirá: ')}<strong>{purchasePoints} PTS</strong>{t('points.buyerQualify', ' (calificación para Miembro Activo)')}
                </p>
                <p className="text-[11px] text-navy-700">
                  {t('points.l1WillReceive', '• Patrocinador Directo (L1) recibirá hasta: ')}<strong>{purchasePoints} PTS (100%)</strong>
                </p>
                <p className="text-[11px] text-navy-700">
                  {t('points.l2WillReceive', '• Patrocinador Superior (L2) recibirá hasta: ')}<strong>{Math.round(purchasePoints * 0.5)} PTS (50%)</strong>
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer transition-colors"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl shadow-md disabled:opacity-50 cursor-pointer transition-all"
              >
                {submitting ? t('points.calculating', 'Calculando y Asignando...') : t('points.confirmAndAssign', 'Confirmar y Asignar Puntos')}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </AdminShell>
  );
}
