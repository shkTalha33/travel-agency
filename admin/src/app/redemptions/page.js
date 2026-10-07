'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Gift,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

export default function AdminRedemptionsPage() {
  const { t, isEn } = useLanguage();
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [actionModal, setActionModal] = useState(null);
  const [newStatus, setNewStatus] = useState('approved');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const STATUS_BADGES = {
    pending: { label: isEn ? 'Pending' : 'Pendiente', color: 'bg-amber-50 text-amber-800 border-amber-300' },
    approved: { label: isEn ? 'Approved' : 'Aprobada', color: 'bg-ocean-50 text-ocean-800 border-ocean-300' },
    completed: { label: isEn ? 'Completed' : 'Completada', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    rejected: { label: isEn ? 'Rejected' : 'Rechazada', color: 'bg-rose-50 text-rose-800 border-rose-300' },
  };

  useEffect(() => {
    loadRedemptions();
  }, [statusFilter]);

  const loadRedemptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      params.append('limit', 50);

      const res = await adminApi.getRedemptions(params.toString());
      if (res.data) {
        setRedemptions(res.data.redemptions || []);
      }
    } catch (err) {
      console.error('Error loading redemptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (redemption) => {
    setActionModal(redemption);
    setNewStatus(redemption.status === 'pending' ? 'approved' : 'completed');
    setAdminNotes(redemption.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!actionModal) return;

    setSubmitting(true);
    setAlert(null);

    try {
      await adminApi.updateRedemptionStatus(actionModal._id, {
        status: newStatus,
        adminNotes: adminNotes.trim(),
      });

      setAlert({
        type: 'success',
        text: isEn
          ? `Redemption request updated to '${STATUS_BADGES[newStatus]?.label || newStatus}'.`
          : `Solicitud de redención actualizada a '${STATUS_BADGES[newStatus]?.label || newStatus}'.`,
      });
      setActionModal(null);
      loadRedemptions();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al actualizar redención' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell
      title={t('redemptions.title', 'Gestión de Redenciones de Puntos')}
      subtitle={t('redemptions.subtitle', 'Aprobación, liquidación y entrega de beneficios de viaje y recompensas para miembros del club')}
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

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'pending', label: t('redemptions.pendingTab', 'Pendientes por Aprobar') },
            { id: 'approved', label: t('redemptions.approvedTab', 'Aprobadas') },
            { id: 'completed', label: t('redemptions.completedTab', 'Completadas / Pagadas') },
            { id: 'rejected', label: t('redemptions.rejectedTab', 'Rechazadas') },
            { id: 'all', label: t('redemptions.allTab', 'Todas las Solicitudes') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-navy-950 text-gold-400 shadow-sm'
                  : 'bg-sand-50 text-navy-600 hover:bg-sand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-navy-500 shrink-0">
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{redemptions.length}</span> {t('redemptions.totalRequests', 'solicitudes')}
        </span>
      </div>

      {/* Redemptions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">{t('redemptions.loadingRedemptions', 'Cargando solicitudes de redención...')}</div>
        ) : redemptions.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-sand-200">
            <Gift className="w-10 h-10 text-sand-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-navy-800">{t('redemptions.noRedemptions', 'No hay solicitudes en este estado')}</p>
          </div>
        ) : (
          redemptions.map((r) => {
            const badge = STATUS_BADGES[r.status] || STATUS_BADGES.pending;
            return (
              <div
                key={r._id}
                className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-navy-400">ID: {r._id.slice(-8)}</span>
                    <span className="text-[11px] text-navy-500">• {new Date(r.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-950 text-gold-400 font-bold text-sm flex items-center justify-center">
                      {r.userId?.fullname?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-950 text-sm">{r.userId?.fullname || (isEn ? 'Member' : 'Miembro')}</h4>
                      <p className="text-xs text-navy-500">{r.userId?.email} • {isEn ? 'Tier' : 'Nivel'}: <span className="uppercase font-semibold">{r.userId?.membershipId}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                      <span className="text-[10px] uppercase font-bold text-navy-500 block mb-1">
                        {t('redemptions.rewardType', 'Tipo de Recompensa')}
                      </span>
                      <p className="font-bold text-navy-950 capitalize">{r.rewardType?.replace('_', ' ') || (isEn ? 'Travel Credit' : 'Crédito de Viaje')}</p>
                      <p className="text-[11px] text-navy-600 mt-1">{r.paymentDetails || (isEn ? 'No additional details' : 'Sin detalles adicionales')}</p>
                    </div>

                    <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
                      <span className="text-[10px] uppercase font-bold text-navy-500 block mb-1">
                        {t('redemptions.userNotes', 'Notas del Usuario / Viaje')}
                      </span>
                      <p className="text-[11px] text-navy-700 italic">{r.notes || t('redemptions.noNotes', 'Ninguna nota provista por el miembro')}</p>
                      {r.adminNotes && (
                        <p className="text-[11px] text-ocean-800 font-semibold mt-1">
                          {t('redemptions.adminNoteLabel', 'Nota Admin: ')}{r.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-sand-200 gap-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-navy-400 block">
                      {t('redemptions.requestedPoints', 'Puntos Solicitados')}
                    </span>
                    <span className="text-2xl font-serif font-bold text-gold-700">
                      {r.points?.toLocaleString()} PTS
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAction(r)}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {t('redemptions.manageStatus', 'Gestionar Estado')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Modal using Portal Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={t('redemptions.modalTitle', 'Gestionar Solicitud de Redención')}
        subtitle={actionModal ? `${actionModal.userId?.fullname} • ${actionModal.points} PTS` : ''}
        icon={Gift}
        maxWidth="max-w-md"
      >
        {actionModal && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-xs">
              <p className="font-bold text-navy-950">{actionModal.userId?.fullname}</p>
              <p className="text-gold-700 font-bold text-sm mt-0.5">{actionModal.points} PTS</p>
              <p className="text-navy-500 text-[11px] mt-1">{actionModal.paymentDetails}</p>
            </div>

            <div>
              <CustomSelect
                label={t('redemptions.newStatusLabel', 'Nuevo Estado de la Solicitud')}
                required
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { value: 'approved', label: t('redemptions.optApproved', 'Aprobada (En preparación de voucher/crédito)') },
                  { value: 'completed', label: t('redemptions.optCompleted', 'Completada (Entregada / Pagada al miembro)') },
                  { value: 'rejected', label: t('redemptions.optRejected', 'Rechazada (Reembolsa los puntos al miembro)') },
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('redemptions.adminNotes', 'Notas de Administración / Código de Voucher')}
              </label>
              <textarea
                rows="3"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={isEn ? 'e.g. Voucher #VOUCH-882 sent via email...' : 'Ej: Voucher #VOUCH-882 enviado al correo...'}
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl shadow-md disabled:opacity-50 cursor-pointer transition-all"
              >
                {submitting ? t('redemptions.updating', 'Actualizando...') : t('redemptions.confirmStatus', 'Confirmar Estado')}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </AdminShell>
  );
}
