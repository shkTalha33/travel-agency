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
  Loader2,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

export default function AdminFaqsPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    questionEn: '',
    answer: '',
    answerEn: '',
    category: 'membership',
    order: 0,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      questionEn: '',
      answer: '',
      answerEn: '',
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
      questionEn: faq.questionEn || faq.en?.question || '',
      answer: faq.answer || '',
      answerEn: faq.answerEn || faq.en?.answer || '',
      category: faq.category || 'general',
      order: faq.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.question || !formData.question.trim()) {
      newErrors.question = isEn ? 'Spanish question is required.' : 'La pregunta en español es obligatoria.';
    }
    if (!formData.answer || !formData.answer.trim()) {
      newErrors.answer = isEn ? 'Spanish answer is required.' : 'La respuesta en español es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const payload = {
      ...formData,
      questionEn: formData.questionEn.trim() || formData.question.trim(),
      answerEn: formData.answerEn.trim() || formData.answer.trim(),
      en: {
        question: formData.questionEn.trim() || formData.question.trim(),
        answer: formData.answerEn.trim() || formData.answer.trim(),
      },
      order: Number(formData.order) || 0,
    };

    try {
      if (isEditing) {
        await adminApi.updateFaq(currentId, payload);
        toast(t('faqs.successUpdated', 'Pregunta frecuente actualizada correctamente.'), 'success');
      } else {
        await adminApi.createFaq(payload);
        toast(t('faqs.successCreated', 'Nueva pregunta frecuente agregada.'), 'success');
      }
      setModalOpen(false);
      loadFaqs();
    } catch (err) {
      toast(err.message || (isEn ? 'Error saving FAQ' : 'Error al guardar la FAQ'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || deleting) return;
    try {
      setDeleting(true);
      await adminApi.deleteFaq(id);
      await loadFaqs();
      setDeleteConfirmId(null);
      toast(t('faqs.successDeleted', 'Pregunta eliminada exitosamente.'), 'success');
    } catch (err) {
      toast(err.message || (isEn ? 'Error deleting FAQ' : 'Error al eliminar FAQ'), 'error');
    } finally {
      setDeleting(false);
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
        <Button
          variant="gold"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          {t('faqs.newFaq', 'Nueva FAQ')}
        </Button>
      }
    >
      {/* Filter and Category Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('faqs.searchPlaceholder', 'Buscar en preguntas o respuestas...')}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <span className="text-xs text-navy-500">
            {t('faqs.showing', 'Mostrando')} <span className="font-bold text-navy-950">{filteredFaqs.length}</span> {t('faqs.questions', 'preguntas')}
          </span>
        </div>

        {/* Category Tabs */}
        <Tabs
          activeTab={selectedCategory}
          onChange={setSelectedCategory}
          tabs={CATEGORIES}
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-navy-500">{t('faqs.loadingFaqs', 'Cargando preguntas frecuentes...')}</div>
        ) : filteredFaqs.length === 0 ? (
          <EmptyState
            icon={<HelpCircle className="w-8 h-8 text-sand-400" />}
            title={t('faqs.noFaqsFound', 'No se encontraron preguntas frecuentes')}
            description={isEn ? 'Try adjusting your search query or category filter.' : 'Intente ajustar su búsqueda o cambie el filtro de categoría.'}
            actionText={t('faqs.newFaq', 'Nueva FAQ')}
            actionIcon={<Plus className="w-4 h-4" />}
            onAction={handleOpenCreate}
          />
        ) : (
          filteredFaqs.map((faq, index) => {
            const catObj = CATEGORIES.find((c) => c.id === faq.category);
            const catLabel = catObj ? catObj.label : (faq.category || 'General');

            return (
              <div
                key={faq._id}
                className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <Badge variant="ocean" size="xs">
                      {catLabel}
                    </Badge>
                    <span className="text-[10px] text-navy-400 font-medium">
                      {t('faqs.orderLabel', 'Orden')}: #{faq.order || index + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-950">
                    {isEn ? (faq.questionEn || faq.question) : faq.question}
                  </h3>
                  <p className="text-xs text-navy-600 leading-relaxed">
                    {isEn ? (faq.answerEn || faq.answer) : faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleOpenEdit(faq)}
                    title={t('common.edit', 'Editar FAQ')}
                  >
                    <Edit2 className="w-4 h-4 text-navy-700 hover:text-gold-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setDeleteConfirmId(faq._id)}
                    title={t('common.delete', 'Eliminar FAQ')}
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 hover:text-rose-800" />
                  </Button>
                </div>
              </div>
            );
          })
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
        subtitle={isEn ? 'Bilingual official answer for members & visitors' : 'Respuesta oficial bilingüe para miembros y visitantes'}
        icon={HelpCircle}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              variant="gold"
              size="sm"
              type="submit"
              form="faq-form"
              disabled={submitting}
              isLoading={submitting}
            >
              {isEditing ? t('faqs.saveChanges', 'Guardar Cambios') : t('faqs.saveFaq', 'Crear FAQ')}
            </Button>
          </>
        }
      >
        <form id="faq-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Question in Spanish */}
          <div>
            <Input
              label={isEn ? 'Question (Spanish)' : 'Pregunta (Español)'}
              required
              value={formData.question}
              onChange={(e) => {
                setFormData({ ...formData, question: e.target.value });
                if (errors.question) setErrors((prev) => ({ ...prev, question: '' }));
              }}
              placeholder="¿Cómo funcionan los puntos por referidos?"
              error={errors.question}
            />
          </div>

          {/* Question in English */}
          <div>
            <Input
              label={isEn ? 'Question (English)' : 'Pregunta (Inglés)'}
              value={formData.questionEn}
              onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
              placeholder="How do referral points work?"
            />
          </div>

          {/* Answer in Spanish */}
          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Detailed Answer (Spanish)' : 'Respuesta Detallada (Español)'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              value={formData.answer}
              onChange={(e) => {
                setFormData({ ...formData, answer: e.target.value });
                if (errors.answer) setErrors((prev) => ({ ...prev, answer: '' }));
              }}
              placeholder="Explique detalladamente la respuesta que verán los usuarios en español..."
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                errors.answer ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
              }`}
            />
            {errors.answer && (
              <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.answer}</span>
              </p>
            )}
          </div>

          {/* Answer in English */}
          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Detailed Answer (English)' : 'Respuesta Detallada (Inglés)'}
            </label>
            <textarea
              rows="3"
              value={formData.answerEn}
              onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
              placeholder="Explain the answer in detail for English visitors..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-gold-500 rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
            />
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
              <Input
                label={t('faqs.positionLabel', 'Posición / Orden')}
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal using Portal Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => {
          if (!deleting) setDeleteConfirmId(null);
        }}
        title={t('faqs.deleteConfirmTitle', '¿Eliminar FAQ?')}
        icon={AlertTriangle}
        maxWidth="max-w-sm"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={deleting}
              onClick={() => setDeleteConfirmId(null)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleting}
              isLoading={deleting}
              onClick={() => handleDelete(deleteConfirmId)}
            >
              {t('offers.yesDelete', 'Sí, Eliminar')}
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('faqs.deleteConfirmDesc', 'Esta pregunta frecuente ya no se mostrará a los usuarios en la sección de soporte.')}
          </p>
        </div>
      </Modal>
    </AdminShell>
  );
}
