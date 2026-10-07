'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

export default function AdminFaqsPage() {
  const { t, isEn } = useLanguage();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'membership',
    order: 0,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const CATEGORIES = [
    { id: 'all', label: t('faqs.allCategories', 'Todas las Categorías') },
    { id: 'membership', label: t('faqs.catMemberships', 'Membresías') },
    { id: 'points', label: t('faqs.catPoints', 'Puntos y Comisiones') },
    { id: 'travel', label: t('faqs.catTravel', 'Viajes y Reservas') },
    { id: 'referrals', label: t('faqs.catReferrals', 'Red de Referidos') },
    { id: 'general', label: t('faqs.catGeneral', 'General') },
  ];

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getFaqs();
      if (res.data) {
        setFaqs(Array.isArray(res.data) ? res.data : res.data.faqs || []);
      }
    } catch (err) {
      console.error('Error fetching faqs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setErrors({});
    setFormData({
      question: '',
      answer: '',
      category: 'membership',
      order: faqs.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setIsEditing(true);
    setCurrentId(faq._id);
    setErrors({});
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'general',
      order: faq.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.question || !formData.question.trim()) {
      newErrors.question = isEn ? 'Question is required.' : 'La pregunta es obligatoria.';
    }
    if (!formData.answer || !formData.answer.trim()) {
      newErrors.answer = isEn ? 'Detailed answer is required.' : 'La respuesta detallada es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setAlert(null);

    const payload = {
      ...formData,
      order: Number(formData.order) || 0,
    };

    try {
      if (isEditing) {
        await adminApi.updateFaq(currentId, payload);
        setAlert({ type: 'success', text: t('faqs.successUpdated', 'Pregunta frecuente actualizada correctamente.') });
      } else {
        await adminApi.createFaq(payload);
        setAlert({ type: 'success', text: t('faqs.successCreated', 'Nueva pregunta frecuente agregada.') });
      }
      setModalOpen(false);
      loadFaqs();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al guardar la FAQ' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteFaq(id);
      setDeleteConfirmId(null);
      setAlert({ type: 'success', text: t('faqs.successDeleted', 'Pregunta eliminada exitosamente.') });
      loadFaqs();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al eliminar FAQ' });
    }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question?.toLowerCase().includes(search.toLowerCase()) ||
      f.answer?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminShell
      title={t('faqs.title', 'Gestión de Preguntas Frecuentes (FAQs)')}
      subtitle={t('faqs.subtitle', 'Administración del centro de ayuda, respuestas oficiales y categorización')}
      actionButton={
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('faqs.newFaq', 'Nueva FAQ')}</span>
        </button>
      }
    >
      {/* Alert Banner */}
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
          <button onClick={() => setAlert(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Category Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('faqs.searchPlaceholder', 'Buscar en preguntas o respuestas...')}
              className="w-full pl-10 pr-4 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
            />
          </div>
          <span className="text-xs text-navy-500">
            {t('faqs.showing', 'Mostrando')} <span className="font-bold text-navy-950">{filteredFaqs.length}</span> {t('faqs.questions', 'preguntas')}
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-navy-950 text-gold-400 shadow-sm'
                  : 'bg-sand-50 text-navy-600 hover:bg-sand-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">{t('faqs.loadingFaqs', 'Cargando preguntas frecuentes...')}</div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-sand-200">
            <HelpCircle className="w-10 h-10 text-sand-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-navy-800">{t('faqs.noFaqsFound', 'No se encontraron preguntas frecuentes')}</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq._id}
              className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gold-50 text-gold-800 border border-gold-300">
                    {faq.category || 'General'}
                  </span>
                  <span className="text-[10px] text-navy-400 font-mono">
                    {t('faqs.orderLabel', 'Orden')}: #{faq.order || index + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-navy-950">{faq.question}</h3>
                <p className="text-xs text-navy-600 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 text-navy-700 hover:text-gold-700 hover:bg-gold-50 rounded-xl transition-colors cursor-pointer"
                  title={t('common.edit', 'Editar FAQ')}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(faq._id)}
                  className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title={t('common.delete', 'Eliminar FAQ')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal using Portal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setErrors({});
        }}
        title={isEditing ? t('faqs.editFaq', 'Editar Pregunta Frecuente') : t('faqs.createFaq', 'Nueva Pregunta Frecuente')}
        subtitle={isEn ? 'Official answer for members & visitors' : 'Respuesta oficial para miembros y visitantes'}
        icon={HelpCircle}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
              {t('faqs.questionLabel', 'Pregunta')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => {
                setFormData({ ...formData, question: e.target.value });
                if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
              }}
              placeholder="¿Cómo funcionan los puntos por referidos?"
              className={`w-full px-3.5 py-2.5 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                errors.question ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
              }`}
            />
            {errors.question && (
              <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.question}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
              {t('faqs.answerLabel', 'Respuesta Detallada')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="4"
              value={formData.answer}
              onChange={(e) => {
                setFormData({ ...formData, answer: e.target.value });
                if (errors.answer) setErrors((prev) => ({ ...prev, answer: '' }));
              }}
              placeholder="Explique detalladamente la respuesta que verán los usuarios..."
              className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                errors.answer ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
              }`}
            />
            {errors.answer && (
              <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.answer}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomSelect
                label={t('faqs.categoryLabel', 'Categoría')}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={[
                  { value: 'membership', label: t('faqs.catMemberships', 'Membresías') },
                  { value: 'points', label: t('faqs.catPoints', 'Puntos y Comisiones') },
                  { value: 'travel', label: t('faqs.catTravel', 'Viajes y Reservas') },
                  { value: 'referrals', label: t('faqs.catReferrals', 'Red de Referidos') },
                  { value: 'general', label: t('faqs.catGeneral', 'General') },
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('faqs.positionLabel', 'Posición / Orden')}
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-sand-300 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 font-semibold text-navy-950 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer transition-colors"
            >
              {t('common.cancel', 'Cancelar')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl shadow-md disabled:opacity-50 cursor-pointer transition-all"
            >
              {submitting
                ? t('common.loading', 'Guardando...')
                : isEditing
                ? t('faqs.saveChanges', 'Guardar Cambios')
                : t('faqs.saveFaq', 'Crear FAQ')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal using Portal Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t('faqs.deleteConfirmTitle', '¿Eliminar FAQ?')}
        icon={AlertTriangle}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('faqs.deleteConfirmDesc', 'Esta pregunta frecuente ya no se mostrará a los usuarios en la sección de soporte.')}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer"
            >
              {t('common.cancel', 'Cancelar')}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(deleteConfirmId)}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm cursor-pointer"
            >
              {t('offers.yesDelete', 'Sí, Eliminar')}
            </button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
