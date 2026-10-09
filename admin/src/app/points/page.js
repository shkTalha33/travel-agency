'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Coins,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  User,
  Users,
  Calendar,
  Layers,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';

export default function AdminPointsPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
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
    setResultData(null);

    try {
      const res = await adminApi.assignPurchasePoints({
        purchaserUserId: selectedUserId,
        purchasePoints: Number(purchasePoints),
        offerTitle: offerTitle.trim(),
        offerId: selectedOfferId || undefined,
      });

      setResultData(res.data);
      toast({
        type: 'success',
        message: t('points.successDistributed', '¡Puntos asignados y comisiones multinivel calculadas con éxito!'),
      });
      loadTransactions();
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || (isEn ? 'Error assigning purchase points' : 'Error al asignar puntos de compra'),
      });
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
        <Button
          variant="ocean"
          size="sm"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => {
            setResultData(null);
            setErrors({});
            setAssignModalOpen(true);
          }}
        >
          {t('points.assignBtn', 'Asignar Puntos de Venta')}
        </Button>
      }
    >
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
            <Badge variant="gold" size="xs">
              N1: 100%
            </Badge>
            <Badge variant="ocean" size="xs">
              N2: 50%
            </Badge>
          </div>
        </div>
      </div>

      {/* Filter and Status tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          activeTab={typeFilter}
          onChange={(val) => {
            setTypeFilter(val);
            setPagination({ ...pagination, page: 1 });
          }}
          tabs={[
            { id: '', label: t('points.allTransactions', 'Todas las Transacciones') },
            { id: 'referral_l1', label: t('points.l1Commissions', 'Comisión Nivel 1 (100%)') },
            { id: 'referral_l2', label: t('points.l2Commissions', 'Comisión Nivel 2 (50%)') },
            { id: 'purchase_points', label: t('points.purchases', 'Compras de Paquetes') },
            { id: 'redemption', label: t('points.redemptions', 'Redenciones') },
          ]}
        />

        <span className="text-xs text-navy-500 shrink-0">
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{pagination.total}</span> {t('points.ledgerRecords', 'registros en ledger')}
        </span>
      </div>

      {/* Transactions Ledger Table matching Users Management Table Style */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-navy-900 border-b border-navy-800 text-white font-bold text-[11px] tracking-wider uppercase">
                <th className="px-5 py-4 min-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('points.colDescription', 'Descripción / Paquete')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[150px]">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('points.colType', 'Tipo de Movimiento')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[180px]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('points.colBeneficiary', 'Beneficiario')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[160px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('points.colSource', 'Miembro Origen')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t('points.colPoints', 'Puntos')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('points.colDate', 'Fecha')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[120px]">
                  <span>{t('points.colStatus', 'Estado')}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sand-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-white">
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-48 mb-1.5" />
                      <div className="h-3 bg-sand-100 rounded w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-32 mb-1.5" />
                      <div className="h-3 bg-sand-100 rounded w-40" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-sand-200 rounded w-28" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-20" />
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-navy-500 text-xs">
                    {t('points.noTransactions', 'No se encontraron transacciones registradas.')}
                  </td>
                </tr>
              ) : (
                transactions.map((tItem) => {
                  return (
                    <tr
                      key={tItem._id}
                      className="hover:bg-sand-50/80 transition-colors group border-b border-sand-100 last:border-0"
                    >
                      {/* Description */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-950 text-sm">{tItem.purchaseDescription || 'Transacción'}</p>
                        <p className="text-[11px] text-navy-400 font-mono mt-0.5">TX: {tItem._id.slice(-8)}</p>
                      </td>

                      {/* Movement Type */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-xs text-navy-800 uppercase tracking-wide">
                          {tItem.type?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Beneficiary */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-950 text-xs">{tItem.userId?.fullname || 'Usuario'}</p>
                        <p className="text-[11px] text-navy-400 truncate mt-0.5">{tItem.userId?.email}</p>
                      </td>

                      {/* Source Person */}
                      <td className="px-5 py-4 text-xs font-semibold text-navy-700">
                        {tItem.sourceUserId?.fullname || tItem.sourcePersonName || (
                          <span className="text-navy-400 italic font-normal">
                            {t('common.directSponsor', 'Sistema / Directo')}
                          </span>
                        )}
                      </td>

                      {/* Points */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-950 text-sm flex items-center gap-1">
                          <span className={tItem.points >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                            {tItem.points >= 0 ? `+${tItem.points}` : tItem.points}
                          </span>
                          <span className="text-[10px] font-bold text-gold-700">PTS</span>
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-navy-600 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-navy-400" />
                          <span>{new Date(tItem.createdAt).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              tItem.status === 'completed' || !tItem.status ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <span className="font-bold text-xs text-navy-950 uppercase">
                            {tItem.status || t('common.completed', 'Completado')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar with Pure White Background and Interactive Controls */}
        <div className="px-5 py-4 bg-white border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-600">
          <span className="text-xs">
            {t('common.page', 'Página')}{' '}
            <span className="font-bold text-navy-950">{pagination.page}</span> {t('common.of', 'de')}{' '}
            <span className="font-bold text-navy-950">{pagination.totalPages || 1}</span>{' '}
            <span className="text-navy-400">
              ({pagination.total} {t('points.ledgerRecords', 'registros en ledger')})
            </span>
          </span>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages || 1}
            onChange={(newPage) => setPagination((p) => ({ ...p, page: newPage }))}
          />
        </div>
      </div>

      {/* Assign Offline Purchase Modal */}
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
        footer={
          resultData ? (
            <Button
              variant="navy"
              size="sm"
              onClick={() => {
                setResultData(null);
                setAssignModalOpen(false);
              }}
            >
              {t('common.close', 'Cerrar')}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAssignModalOpen(false)}
              >
                {t('common.cancel', 'Cancelar')}
              </Button>
              <Button
                variant="ocean"
                size="sm"
                type="submit"
                form="assign-points-form"
                disabled={submitting}
                isLoading={submitting}
              >
                {t('points.confirmAndAssign', 'Confirmar y Asignar Puntos')}
              </Button>
            </>
          )
        }
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
              <p className="text-xs font-bold text-navy-800">
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
                    <span className="text-sm font-bold text-gold-700">
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
          </div>
        ) : (
          <form id="assign-points-form" onSubmit={handleAssignPoints} className="space-y-4" noValidate>
            {/* Select Purchaser */}
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

            {/* Select Travel Package */}
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
                <Input
                  value={offerTitle}
                  onChange={(e) => {
                    setOfferTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder={isEn ? 'Purchased package description...' : 'Descripción del paquete comprado...'}
                  error={errors.title}
                />
              </div>
            </div>

            {/* Purchase Points Input */}
            <div>
              <Input
                label={t('points.purchasePoints', 'Puntos Base de la Compra (PTS)')}
                required
                type="number"
                min="1"
                value={purchasePoints}
                onChange={(e) => {
                  setPurchasePoints(e.target.value);
                  if (errors.points) setErrors((prev) => ({ ...prev, points: '' }));
                }}
                error={errors.points}
              />
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
          </form>
        )}
      </Modal>
    </AdminShell>
  );
}
