'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Mail,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
  Reply,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function AdminContactsPage() {
  const { t, isEn } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const STATUS_CONFIG = {
    new: { label: isEn ? 'New' : 'Nuevo', color: 'bg-rose-50 text-rose-800 border-rose-300' },
    read: { label: isEn ? 'Read' : 'Leído', color: 'bg-ocean-50 text-ocean-800 border-ocean-300' },
    replied: { label: isEn ? 'Replied' : 'Respondido', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    archived: { label: isEn ? 'Archived' : 'Archivado', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  };

  useEffect(() => {
    loadContacts();
  }, [statusFilter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      params.append('limit', 50);

      const res = await adminApi.getContacts(params.toString());
      if (res.data) {
        setContacts(res.data.contacts || []);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes || '');

    // Automatically mark as read if it's new
    if (msg.status === 'new') {
      try {
        await adminApi.updateContactStatus(msg._id, { status: 'read' });
        loadContacts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdateStatus = async (id, statusToSet) => {
    setSubmitting(true);
    try {
      await adminApi.updateContactStatus(id, {
        status: statusToSet,
        adminNotes: adminNotes.trim(),
      });
      setAlert({
        type: 'success',
        text: isEn
          ? `Message updated to '${STATUS_CONFIG[statusToSet]?.label || statusToSet}'.`
          : `Mensaje actualizado a '${STATUS_CONFIG[statusToSet]?.label || statusToSet}'.`,
      });
      setSelectedMessage(null);
      loadContacts();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al actualizar mensaje' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell
      title={t('contacts.title', 'Bandeja de Mensajes de Contacto')}
      subtitle={t('contacts.subtitle', 'Atención de consultas, solicitudes de membresía y soporte de viajeros')}
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
            { id: '', label: t('contacts.allMessages', 'Todos los Mensajes') },
            { id: 'new', label: t('contacts.newMessages', 'Nuevos / Sin Leer') },
            { id: 'read', label: t('contacts.readMessages', 'Leídos') },
            { id: 'replied', label: t('contacts.repliedMessages', 'Respondidos') },
            { id: 'archived', label: t('contacts.archivedMessages', 'Archivados') },
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
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{contacts.length}</span> {t('contacts.totalMessages', 'mensajes')}
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">{t('contacts.loadingInbox', 'Cargando bandeja de entrada...')}</div>
        ) : contacts.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-sand-200">
            <Mail className="w-10 h-10 text-sand-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-navy-800">{t('contacts.noMessages', 'No hay mensajes en esta bandeja.')}</p>
          </div>
        ) : (
          contacts.map((msg) => {
            const badge = STATUS_CONFIG[msg.status] || STATUS_CONFIG.new;
            return (
              <div
                key={msg._id}
                onClick={() => handleOpenMessage(msg)}
                className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  msg.status === 'new'
                    ? 'border-gold-400/80 shadow-md bg-gold-50/20'
                    : 'border-sand-200 hover:shadow-sm'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-navy-400 font-mono">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-navy-950 truncate">
                    {msg.subject || (isEn ? 'General Inquiry' : 'Consulta General')}
                  </h4>

                  <p className="text-xs text-navy-600 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-sand-100">
                  <span className="font-bold text-navy-950">{msg.fullname}</span>
                  <span className="text-[11px] text-navy-500">{msg.email}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Details Modal using Portal Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={t('contacts.modalTitle', 'Detalle de la Consulta')}
        subtitle={selectedMessage ? `${selectedMessage.fullname} • ${selectedMessage.email}` : ''}
        icon={MessageSquare}
        maxWidth="max-w-xl"
      >
        {selectedMessage && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-navy-400 block">{t('contacts.sender', 'Remitente')}</span>
                <p className="font-bold text-navy-950 text-sm">{selectedMessage.fullname}</p>
                <p className="text-navy-600">{selectedMessage.email}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-navy-400 block">{t('contacts.phoneDate', 'Teléfono / Fecha')}</span>
                <p className="font-semibold text-navy-800">{selectedMessage.phone || t('common.notSpecified', 'No especificado')}</p>
                <p className="text-navy-500 text-[11px]">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-navy-400 block mb-1">{t('contacts.subject', 'Asunto')}</span>
              <p className="font-bold text-navy-950 text-sm">{selectedMessage.subject}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-navy-400 block mb-1">{t('contacts.message', 'Mensaje')}</span>
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-navy-800 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('contacts.internalNotes', 'Notas de Seguimiento Interno')}
              </label>
              <textarea
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={isEn ? 'e.g. Contacted via WhatsApp and sent travel quote...' : 'Ej: Se contactó por WhatsApp y se le envió propuesta de viaje...'}
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-sand-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Consulta Viajes Dominicana')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-950 text-gold-400 rounded-xl font-bold uppercase text-[11px] tracking-wider hover:bg-navy-900 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>{t('contacts.replyEmail', 'Responder por Correo')}</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {t('contacts.markReplied', 'Marcar Respondido')}
                </button>
                <button
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'archived')}
                  className="px-3.5 py-2 bg-sand-200 hover:bg-sand-300 text-navy-800 rounded-xl font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {t('contacts.archive', 'Archivar')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
