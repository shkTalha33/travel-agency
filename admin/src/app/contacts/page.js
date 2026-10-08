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
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

export default function AdminContactsPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const STATUS_CONFIG = {
    new: { label: isEn ? 'New' : 'Nuevo', variant: 'danger' },
    read: { label: isEn ? 'Read' : 'Leído', variant: 'ocean' },
    replied: { label: isEn ? 'Replied' : 'Respondido', variant: 'success' },
    archived: { label: isEn ? 'Archived' : 'Archivado', variant: 'default' },
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
      toast({
        type: 'success',
        message: isEn
          ? `Message updated to '${STATUS_CONFIG[statusToSet]?.label || statusToSet}'.`
          : `Mensaje actualizado a '${STATUS_CONFIG[statusToSet]?.label || statusToSet}'.`,
      });
      setSelectedMessage(null);
      loadContacts();
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || (isEn ? 'Error updating message' : 'Error al actualizar mensaje'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell
      title={t('contacts.title', 'Bandeja de Mensajes de Contacto')}
      subtitle={t('contacts.subtitle', 'Atención de consultas, solicitudes de membresía y soporte de viajeros')}
    >
      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          activeTab={statusFilter}
          onChange={setStatusFilter}
          tabs={[
            { id: '', label: t('contacts.allMessages', 'Todos los Mensajes') },
            { id: 'new', label: t('contacts.newMessages', 'Nuevos / Sin Leer') },
            { id: 'read', label: t('contacts.readMessages', 'Leídos') },
            { id: 'replied', label: t('contacts.repliedMessages', 'Respondidos') },
            { id: 'archived', label: t('contacts.archivedMessages', 'Archivados') },
          ]}
        />

        <span className="text-xs text-navy-500 shrink-0">
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{contacts.length}</span> {t('contacts.totalMessages', 'mensajes')}
        </span>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">{t('contacts.loadingInbox', 'Cargando bandeja de entrada...')}</div>
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={<Mail className="w-8 h-8 text-sand-400" />}
            title={t('contacts.noMessages', 'No hay mensajes en esta bandeja.')}
            description={isEn ? 'No contact messages found for this filter.' : 'No se encontraron mensajes de contacto con este filtro.'}
          />
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
                    <Badge variant={badge.variant} size="xs" dot={msg.status === 'new'}>
                      {badge.label}
                    </Badge>
                    <span className="text-[11px] text-navy-400 font-medium">
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
        footer={
          selectedMessage ? (
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Consulta Viajes Dominicana')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-950 text-gold-400 rounded-xl font-bold text-xs hover:bg-navy-900 transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>{t('contacts.replyEmail', 'Responder por Correo')}</span>
              </a>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {t('contacts.markReplied', 'Marcar Respondido')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleUpdateStatus(selectedMessage._id, 'archived')}
                >
                  {t('contacts.archive', 'Archivar')}
                </Button>
              </div>
            </div>
          ) : null
        }
      >
        {selectedMessage && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-navy-400 block">{t('contacts.sender', 'Remitente')}</span>
                <p className="font-bold text-navy-950 text-sm">{selectedMessage.fullname}</p>
                <p className="text-navy-600">{selectedMessage.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-navy-400 block">{t('contacts.phoneDate', 'Teléfono / Fecha')}</span>
                <p className="font-semibold text-navy-800">{selectedMessage.phone || t('common.notSpecified', 'No especificado')}</p>
                <p className="text-navy-500 text-[11px]">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-navy-400 block mb-1">{t('contacts.subject', 'Asunto')}</span>
              <p className="font-bold text-navy-950 text-sm">{selectedMessage.subject}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-navy-400 block mb-1">{t('contacts.message', 'Mensaje')}</span>
              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-navy-800 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {t('contacts.internalNotes', 'Notas de Seguimiento Interno')}
              </label>
              <textarea
                rows="2"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={isEn ? 'e.g. Contacted via WhatsApp and sent travel quote...' : 'Ej: Se contactó por WhatsApp y se le envió propuesta de viaje...'}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
