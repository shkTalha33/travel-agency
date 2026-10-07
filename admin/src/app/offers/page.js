'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Palmtree,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

const INITIAL_OFFER_FORM = {
  title: '',
  slug: '',
  destination: 'Punta Cana',
  country: 'República Dominicana',
  priceUSD: 1200,
  pointsReward: 100,
  duration: '4 días / 3 noches',
  hotelCategory: 'Resort 5 Estrellas',
  badge: 'Popular',
  image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
  summary: 'Experiencia todo incluido con traslados y actividades exclusivas.',
  description: 'Disfrute de unas vacaciones de ensueño en los mejores resorts del Caribe.',
  highlights: 'Playa privada, Todo incluido, Excursión en catamarán',
  included: 'Alojamiento 5 estrellas, Todas las comidas y bebidas, Traslado aeropuerto-hotel',
  notIncluded: 'Vuelos internacionales, Gastos personales, Propinas opcionales',
  isFeatured: true,
};

export default function AdminOffersPage() {
  const { t, isEn } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_OFFER_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOffers();
      if (res.data && res.data.offers) {
        setOffers(res.data.offers);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData(INITIAL_OFFER_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setIsEditing(true);
    setCurrentId(offer._id);
    setErrors({});
    setFormData({
      title: offer.title || '',
      slug: offer.slug || '',
      destination: offer.destination || '',
      country: offer.country || 'República Dominicana',
      priceUSD: offer.priceUSD || 0,
      pointsReward: offer.pointsReward || 0,
      duration: offer.duration || '',
      hotelCategory: offer.hotelCategory || '',
      badge: offer.badge || '',
      image: offer.image || '',
      summary: offer.summary || '',
      description: offer.description || '',
      highlights: Array.isArray(offer.highlights) ? offer.highlights.join(', ') : '',
      included: Array.isArray(offer.included) ? offer.included.join(', ') : '',
      notIncluded: Array.isArray(offer.notIncluded) ? offer.notIncluded.join(', ') : '',
      isFeatured: !!offer.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = isEn ? 'Offer title is required.' : 'El título de la oferta es obligatorio.';
    }
    if (!formData.destination || !formData.destination.trim()) {
      newErrors.destination = isEn ? 'Destination is required.' : 'El destino es obligatorio.';
    }
    if (formData.priceUSD === '' || Number(formData.priceUSD) <= 0 || isNaN(Number(formData.priceUSD))) {
      newErrors.priceUSD = isEn ? 'Valid price in USD greater than 0 is required.' : 'Ingrese un precio válido en USD mayor a 0.';
    }
    if (formData.pointsReward === '' || Number(formData.pointsReward) < 0 || isNaN(Number(formData.pointsReward))) {
      newErrors.pointsReward = isEn ? 'Valid reward points (>= 0) is required.' : 'Ingrese una cantidad válida de puntos (>= 0).';
    }
    if (!formData.image || !formData.image.trim()) {
      newErrors.image = isEn ? 'Primary image URL is required.' : 'La URL de la imagen principal es requerida.';
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
      priceUSD: Number(formData.priceUSD),
      pointsReward: Number(formData.pointsReward),
      highlights: formData.highlights.split(',').map((s) => s.trim()).filter(Boolean),
      included: formData.included.split(',').map((s) => s.trim()).filter(Boolean),
      notIncluded: formData.notIncluded.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await adminApi.updateOffer(currentId, payload);
        setAlert({ type: 'success', text: t('offers.successUpdated', '¡Oferta de viaje actualizada exitosamente!') });
      } else {
        await adminApi.createOffer(payload);
        setAlert({ type: 'success', text: t('offers.successCreated', '¡Nueva oferta de viaje creada con éxito!') });
      }
      setModalOpen(false);
      loadOffers();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al guardar la oferta' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteOffer(id);
      setDeleteConfirmId(null);
      setAlert({ type: 'success', text: t('offers.successDeleted', 'Oferta eliminada permanentemente.') });
      loadOffers();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al eliminar oferta' });
    }
  };

  const filteredOffers = offers.filter((o) =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell
      title={t('offers.title', 'Gestión de Ofertas de Viaje')}
      subtitle={t('offers.subtitle', 'Creación, edición y publicación de paquetes turísticos y asignación de recompensas en puntos')}
      actionButton={
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('offers.newOffer', 'Nueva Oferta')}</span>
        </button>
      }
    >
      {/* Notification Alert */}
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

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('offers.searchPlaceholder', 'Buscar por destino o título...')}
            className="w-full pl-10 pr-4 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
          />
        </div>
        <p className="text-xs text-navy-500 font-medium">
          {t('common.total', 'Total')}: <span className="font-bold text-navy-950">{filteredOffers.length}</span> {t('offers.listedOffers', 'ofertas listadas')}
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-navy-500">
            {t('offers.loadingOffers', 'Cargando catálogo de ofertas...')}
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-sand-200">
            <Palmtree className="w-10 h-10 text-sand-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-navy-800">{t('offers.noOffersFound', 'No se encontraron ofertas')}</p>
            <p className="text-[11px] text-navy-500 mt-1">{t('offers.clickNewOffer', "Haga clic en 'Nueva Oferta' para crear el primer paquete.")}</p>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-48 w-full bg-navy-950 overflow-hidden">
                  <img
                    src={offer.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {offer.badge && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 shadow-md">
                        {offer.badge}
                      </span>
                    )}
                    {offer.isFeatured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-navy-950/80 text-white backdrop-blur-sm">
                        {t('offers.featured', 'Destacada')}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-navy-950/90 text-gold-400 font-bold text-xs backdrop-blur-md border border-gold-500/30">
                    +{offer.pointsReward} PTS
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-ocean-700 uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{offer.destination}, {offer.country}</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-navy-950 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-navy-600 mt-2 line-clamp-2 leading-relaxed">
                    {offer.summary || offer.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-navy-400 block uppercase font-bold">{t('offers.price', 'Precio')}</span>
                      <span className="text-sm font-bold text-navy-950">${offer.priceUSD} USD</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-navy-400 block uppercase font-bold">{t('offers.duration', 'Duración')}</span>
                      <span className="text-xs font-semibold text-navy-800">{offer.duration || 'N/D'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-3 bg-sand-50 border-t border-sand-200 flex items-center justify-between">
                <span className="text-[10px] text-navy-500 font-mono">ID: {offer._id.slice(-6)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(offer)}
                    className="p-1.5 text-navy-700 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition-colors cursor-pointer"
                    title={t('common.edit', 'Editar')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(offer._id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={t('common.delete', 'Eliminar')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Offer Modal using Portal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setErrors({});
        }}
        title={isEditing ? t('offers.editOffer', 'Editar Oferta de Viaje') : t('offers.createOffer', 'Crear Nueva Oferta de Viaje')}
        subtitle={isEn ? 'Configure travel details, pricing, and reward points' : 'Configure detalles del viaje, precios y recompensas en puntos'}
        icon={Palmtree}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.offerTitle', 'Título de la Oferta')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.title ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
                }`}
                placeholder="Punta Cana Todo Incluido Resort 5*"
              />
              {errors.title && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.destination', 'Destino')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => {
                  setFormData({ ...formData, destination: e.target.value });
                  if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.destination ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
                }`}
                placeholder="Punta Cana / Samaná"
              />
              {errors.destination && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.destination}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.priceUSD', 'Precio (USD)')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.priceUSD}
                onChange={(e) => {
                  setFormData({ ...formData, priceUSD: e.target.value });
                  if (errors.priceUSD) setErrors((prev) => ({ ...prev, priceUSD: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.priceUSD ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
                }`}
              />
              {errors.priceUSD && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.priceUSD}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.rewardPoints', 'Recompensa en Puntos (PTS)')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.pointsReward}
                onChange={(e) => {
                  setFormData({ ...formData, pointsReward: e.target.value });
                  if (errors.pointsReward) setErrors((prev) => ({ ...prev, pointsReward: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.pointsReward ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
                }`}
              />
              {errors.pointsReward && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.pointsReward}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.duration', 'Duración')}
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="5 días / 4 noches"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('offers.badge', 'Distintivo / Badge')}
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="Más Solicitado / Exclusivo"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
              {t('offers.imageURL', 'URL de Imagen Principal')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => {
                setFormData({ ...formData, image: e.target.value });
                if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
              }}
              className={`w-full px-3.5 py-2 text-xs bg-sand-50 border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                errors.image ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-sand-200 focus:border-gold-500'
              }`}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.image && (
              <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.image}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
              {t('offers.shortSummary', 'Resumen Corto')}
            </label>
            <textarea
              rows="2"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
              {t('offers.included', 'Incluye (Separado por comas)')}
            </label>
            <input
              type="text"
              value={formData.included}
              onChange={(e) => setFormData({ ...formData, included: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
              placeholder="Alojamiento 5 estrellas, Todas las comidas, Traslados"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-navy-900 cursor-pointer">
              {t('offers.featuredCheckbox', 'Destacar esta oferta en la página principal')}
            </label>
          </div>

          <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl transition-colors cursor-pointer"
            >
              {t('common.cancel', 'Cancelar')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? isEditing ? t('offers.updating', 'Actualizando...') : t('offers.publishing', 'Publicando...')
                : isEditing ? t('offers.updateOffer', 'Actualizar Oferta') : t('offers.publishOffer', 'Publicar Oferta')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal using Portal Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t('offers.deleteConfirmTitle', '¿Eliminar Oferta?')}
        icon={AlertTriangle}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('offers.deleteConfirmDesc', 'Esta acción eliminará permanentemente la oferta de viaje del catálogo público.')}
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
