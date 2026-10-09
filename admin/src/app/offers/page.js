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
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import ImageUpload from '@/components/ui/ImageUpload';
import Checkbox from '@/components/ui/Checkbox';
import CountrySelect from '@/components/ui/CountrySelect';
import TagInput from '@/components/ui/TagInput';
import { useToast } from '@/components/ui/Toast';
import { getCountryByName, getCountryFlag } from '@/data/countries';

const INITIAL_OFFER_FORM = {
  title: '',
  titleEn: '',
  slug: '',
  destination: '',
  destinationEn: '',
  country: 'República Dominicana',
  countryEn: 'Dominican Republic',
  priceUSD: '',
  pointsReward: '',
  duration: '',
  durationEn: '',
  hotelCategory: '',
  hotelCategoryEn: '',
  badge: '',
  badgeEn: '',
  image: '',
  summary: '',
  summaryEn: '',
  description: '',
  descriptionEn: '',
  highlights: [],
  highlightsEn: [],
  included: [],
  includedEn: [],
  notIncluded: [],
  notIncludedEn: [],
  isFeatured: false,
};

export default function AdminOffersPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_OFFER_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
      titleEn: offer.titleEn || offer.en?.title || '',
      slug: offer.slug || '',
      destination: offer.destination || '',
      destinationEn: offer.destinationEn || offer.en?.destination || '',
      country: offer.country || 'República Dominicana',
      countryEn: offer.countryEn || offer.en?.country || 'Dominican Republic',
      priceUSD: offer.priceUSD || 0,
      pointsReward: offer.pointsReward || 0,
      duration: offer.duration || '',
      durationEn: offer.durationEn || offer.en?.duration || '',
      hotelCategory: offer.hotelCategory || '',
      hotelCategoryEn: offer.hotelCategoryEn || offer.en?.hotelCategory || '',
      badge: offer.badge || '',
      badgeEn: offer.badgeEn || offer.en?.badge || '',
      image: offer.image || '',
      summary: offer.summary || '',
      summaryEn: offer.summaryEn || offer.en?.summary || '',
      description: offer.description || '',
      descriptionEn: offer.descriptionEn || offer.en?.description || '',
      highlights: Array.isArray(offer.highlights)
        ? offer.highlights
        : (typeof offer.highlights === 'string' ? offer.highlights.split(',').map((s) => s.trim()).filter(Boolean) : []),
      highlightsEn: Array.isArray(offer.highlightsEn || offer.en?.highlights)
        ? (offer.highlightsEn || offer.en?.highlights)
        : [],
      included: Array.isArray(offer.included)
        ? offer.included
        : (typeof offer.included === 'string' ? offer.included.split(',').map((s) => s.trim()).filter(Boolean) : []),
      includedEn: Array.isArray(offer.includedEn || offer.en?.included)
        ? (offer.includedEn || offer.en?.included)
        : [],
      notIncluded: Array.isArray(offer.notIncluded)
        ? offer.notIncluded
        : (typeof offer.notIncluded === 'string' ? offer.notIncluded.split(',').map((s) => s.trim()).filter(Boolean) : []),
      notIncludedEn: Array.isArray(offer.notIncludedEn || offer.en?.notIncluded)
        ? (offer.notIncludedEn || offer.en?.notIncluded)
        : [],
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
    if (!formData.country || !formData.country.trim()) {
      newErrors.country = isEn ? 'Country is required.' : 'El país es obligatorio.';
    }
    if (formData.priceUSD === '' || Number(formData.priceUSD) <= 0 || isNaN(Number(formData.priceUSD))) {
      newErrors.priceUSD = isEn ? 'Valid price in USD greater than 0 is required.' : 'Ingrese un precio válido en USD mayor a 0.';
    }
    if (!formData.duration || !formData.duration.trim()) {
      newErrors.duration = isEn ? 'Trip duration is required (e.g. 5 days / 4 nights).' : 'La duración es obligatoria (ej: 5 días / 4 noches).';
    }
    if (!formData.image || !formData.image.trim()) {
      newErrors.image = isEn ? 'Primary image URL is required.' : 'La URL de la imagen principal es requerida.';
    }
    if (!formData.summary || !formData.summary.trim()) {
      newErrors.summary = isEn ? 'Short summary is required.' : 'El resumen corto es obligatorio.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const countryObj = getCountryByName(formData.country);
    const countryName = countryObj ? countryObj.name : formData.country.trim();
    const countryNameEn = countryObj ? countryObj.nameEn : formData.country.trim();
    const countryCode = countryObj ? countryObj.code : '';

    const highlightsArr = Array.isArray(formData.highlights)
      ? formData.highlights.filter(Boolean)
      : typeof formData.highlights === 'string'
      ? formData.highlights.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const highlightsEnArr = Array.isArray(formData.highlightsEn)
      ? formData.highlightsEn.filter(Boolean)
      : typeof formData.highlightsEn === 'string'
      ? formData.highlightsEn.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const includedArr = Array.isArray(formData.included)
      ? formData.included.filter(Boolean)
      : typeof formData.included === 'string'
      ? formData.included.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const includedEnArr = Array.isArray(formData.includedEn)
      ? formData.includedEn.filter(Boolean)
      : typeof formData.includedEn === 'string'
      ? formData.includedEn.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const notIncludedArr = Array.isArray(formData.notIncluded)
      ? formData.notIncluded.filter(Boolean)
      : typeof formData.notIncluded === 'string'
      ? formData.notIncluded.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const notIncludedEnArr = Array.isArray(formData.notIncludedEn)
      ? formData.notIncludedEn.filter(Boolean)
      : typeof formData.notIncludedEn === 'string'
      ? formData.notIncludedEn.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      title: formData.title.trim(),
      titleEn: formData.titleEn?.trim() || formData.title.trim(),
      destination: formData.destination.trim(),
      destinationEn: formData.destinationEn?.trim() || formData.destination.trim(),
      country: countryName,
      countryEn: countryNameEn,
      countryCode: countryCode,
      priceUSD: Number(formData.priceUSD),
      pointsReward: Number(formData.pointsReward),
      duration: formData.duration.trim(),
      durationEn: formData.durationEn?.trim() || formData.duration.trim(),
      summary: formData.summary.trim(),
      summaryEn: formData.summaryEn?.trim() || formData.summary.trim(),
      description: (formData.description || formData.summary).trim(),
      descriptionEn: (formData.descriptionEn || formData.summaryEn || formData.description || formData.summary).trim(),
      hotelCategory: formData.hotelCategory || 'Resort 4 estrellas',
      hotelCategoryEn: formData.hotelCategoryEn || '4-Star Resort',
      badge: formData.badge?.trim() || '',
      badgeEn: formData.badgeEn?.trim() || formData.badge?.trim() || '',
      highlights: highlightsArr,
      highlightsEn: highlightsEnArr.length > 0 ? highlightsEnArr : highlightsArr,
      included: includedArr,
      includedEn: includedEnArr.length > 0 ? includedEnArr : includedArr,
      notIncluded: notIncludedArr,
      notIncludedEn: notIncludedEnArr.length > 0 ? notIncludedEnArr : notIncludedArr,
      en: {
        title: formData.titleEn?.trim() || formData.title.trim(),
        destination: formData.destinationEn?.trim() || formData.destination.trim(),
        country: countryNameEn,
        duration: formData.durationEn?.trim() || formData.duration.trim(),
        hotelCategory: formData.hotelCategoryEn || formData.hotelCategory || '4-star resort',
        badge: formData.badgeEn?.trim() || formData.badge || '',
        summary: formData.summaryEn?.trim() || formData.summary.trim(),
        description: (formData.descriptionEn || formData.description || formData.summary).trim(),
        highlights: highlightsEnArr.length > 0 ? highlightsEnArr : highlightsArr,
        included: includedEnArr.length > 0 ? includedEnArr : includedArr,
        notIncluded: notIncludedEnArr.length > 0 ? notIncludedEnArr : notIncludedArr,
      },
    };

    try {
      if (isEditing) {
        await adminApi.updateOffer(currentId, payload);
        toast({
          type: 'success',
          message: t('offers.successUpdated', '¡Oferta de viaje actualizada exitosamente!'),
        });
      } else {
        await adminApi.createOffer(payload);
        toast({
          type: 'success',
          message: t('offers.successCreated', '¡Nueva oferta de viaje creada con éxito!'),
        });
      }
      setModalOpen(false);
      loadOffers();
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || 'Error al guardar la oferta',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteOffer(id);
      setDeleteConfirmId(null);
      toast(t('offers.successDeleted', 'Oferta eliminada permanentemente.'), 'success');
      loadOffers();
    } catch (err) {
      toast(err.message || 'Error al eliminar oferta', 'error');
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
        <Button
          variant="ocean"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          {t('offers.newOffer', 'Nueva Oferta')}
        </Button>
      }
    >
      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('offers.searchPlaceholder', 'Buscar por destino o título...')}
            icon={<Search className="w-4 h-4" />}
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
          <div className="col-span-full">
            <EmptyState
              icon={<Palmtree className="w-8 h-8 text-sand-400" />}
              title={t('offers.noOffersFound', 'No se encontraron ofertas')}
              description={t('offers.clickNewOffer', "Haga clic en 'Nueva Oferta' para crear el primer paquete.")}
              actionText={t('offers.newOffer', 'Nueva Oferta')}
              actionIcon={<Plus className="w-4 h-4" />}
              onAction={handleOpenCreate}
            />
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
                    src={
                      offer.image?.startsWith('/uploads')
                        ? `http://localhost:5000${offer.image}`
                        : offer.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      if (offer.image && offer.image.includes('travel_agency/')) {
                        const pathSuffix = offer.image.substring(offer.image.indexOf('travel_agency/'));
                        const localFallback = `http://localhost:5000/uploads/${pathSuffix}`;
                        if (e.currentTarget.src !== localFallback) {
                          e.currentTarget.src = localFallback;
                          return;
                        }
                      }
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {offer.badge && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-ocean-600 text-white shadow-md">
                        {offer.badge}
                      </span>
                    )}
                    {offer.isFeatured && (
                      <Badge variant="primary" size="xs">
                        {t('offers.featured', 'Destacada')}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-navy-950/90 text-gold-400 font-bold text-xs backdrop-blur-md border border-gold-500/30">
                    +{offer.pointsReward} PTS
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-ocean-700 mb-1">
                    <span className="text-sm leading-none" role="img" aria-label={offer.country}>
                      {getCountryFlag(offer.country)}
                    </span>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{offer.destination ? `${offer.destination}, ` : ''}{offer.country || 'República Dominicana'}</span>
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
                <span className="text-[10px] text-navy-500">ID: {offer._id.slice(-6)}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleOpenEdit(offer)}
                    title={t('common.edit', 'Editar')}
                  >
                    <Edit2 className="w-4 h-4 text-navy-700 hover:text-gold-700" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setDeleteConfirmId(offer._id)}
                    title={t('common.delete', 'Eliminar')}
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 hover:text-rose-800" />
                  </Button>
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
              variant="ocean"
              size="sm"
              type="submit"
              form="offer-form"
              disabled={submitting}
              isLoading={submitting}
            >
              {isEditing ? t('offers.updateOffer', 'Actualizar Oferta') : t('offers.publishOffer', 'Publicar Oferta')}
            </Button>
          </>
        }
      >
        <form
          id="offer-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
              // Allow TagInput and textareas to handle Enter, prevent accidental full form submission
              if (e.target.getAttribute('type') !== 'submit' && !e.target.getAttribute('data-allow-enter')) {
                // If not in TagInput
              }
            }
          }}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Offer Title (Spanish)' : 'Título de la Oferta (Español)'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.title ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
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
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Offer Title (English)' : 'Título de la Oferta (Inglés)'}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-gold-500 rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Punta Cana All Inclusive 5-Star Resort"
              />
            </div>

            <div>
              <CountrySelect
                label={t('offers.country', 'País de Destino')}
                required
                value={formData.country}
                error={errors.country}
                onChange={(e) => {
                  setFormData({ ...formData, country: e.target.value });
                  if (errors.country) setErrors((prev) => ({ ...prev, country: '' }));
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Destination / City (Spanish)' : 'Destino / Ciudad (Español)'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => {
                  setFormData({ ...formData, destination: e.target.value });
                  if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.destination ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
                }`}
                placeholder="Punta Cana / Cancún"
              />
              {errors.destination && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.destination}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Destination / City (English)' : 'Destino / Ciudad (Inglés)'}
              </label>
              <input
                type="text"
                value={formData.destinationEn}
                onChange={(e) => setFormData({ ...formData, destinationEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-gold-500 rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
                placeholder="Punta Cana / Cancun"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
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
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.priceUSD ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
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
              <label className="block text-xs font-bold text-navy-800 mb-1">
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
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.pointsReward ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
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
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Duration (Spanish)' : 'Duración (Español)'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => {
                  setFormData({ ...formData, duration: e.target.value });
                  if (errors.duration) setErrors((prev) => ({ ...prev, duration: '' }));
                }}
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                  errors.duration ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
                }`}
                placeholder="5 días / 4 noches"
              />
              {errors.duration && (
                <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.duration}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Duration (English)' : 'Duración (Inglés)'}
              </label>
              <input
                type="text"
                value={formData.durationEn}
                onChange={(e) => setFormData({ ...formData, durationEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-gold-500 rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
                placeholder="5 days / 4 nights"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Hotel Category (Spanish)' : 'Categoría de Hotel (Español)'}
              </label>
              <input
                type="text"
                value={formData.hotelCategory}
                onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="Resort 5 estrellas / Hotel Boutique 4*"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Hotel Category (English)' : 'Categoría de Hotel (Inglés)'}
              </label>
              <input
                type="text"
                value={formData.hotelCategoryEn}
                onChange={(e) => setFormData({ ...formData, hotelCategoryEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="5-Star Resort / 4-Star Boutique Hotel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Badge / Tag (Spanish)' : 'Distintivo / Badge (Español)'}
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="Más Solicitado / Exclusivo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Badge / Tag (English)' : 'Distintivo / Badge (Inglés)'}
              </label>
              <input
                type="text"
                value={formData.badgeEn}
                onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0"
                placeholder="Most Requested / Exclusive"
              />
            </div>
          </div>

          <ImageUpload
            label={t('offers.imageURL', 'Imagen Principal')}
            required
            value={formData.image}
            onChange={(url) => {
              setFormData({ ...formData, image: url });
              if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
            }}
            folder="offers"
            error={errors.image}
          />

          {/* Summaries */}
          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Short Summary (Spanish)' : 'Resumen Corto (Español)'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="2"
              value={formData.summary}
              onChange={(e) => {
                setFormData({ ...formData, summary: e.target.value });
                if (errors.summary) setErrors((prev) => ({ ...prev, summary: '' }));
              }}
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
                errors.summary ? 'border-rose-400 focus:border-rose-500 bg-white' : 'border-sand-200 focus:border-gold-500 bg-white'
              }`}
              placeholder="Resort frente al mar con todo incluido, playas de arena blanca y traslados privados..."
            />
            {errors.summary && (
              <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.summary}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Short Summary (English)' : 'Resumen Corto (Inglés)'}
            </label>
            <textarea
              rows="2"
              value={formData.summaryEn}
              onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 focus:border-gold-500 rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              placeholder="Beachfront all-inclusive resort with white-sand beaches, private transfers..."
            />
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Detailed Description (Spanish)' : 'Descripción Detallada (Español)'}
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              placeholder="Descripción completa de la estancia, servicios, vistas y amenidades..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Detailed Description (English)' : 'Descripción Detallada (Inglés)'}
            </label>
            <textarea
              rows="3"
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors"
              placeholder="Full detailed itinerary, services, views and resort amenities..."
            />
          </div>

          {/* Highlights Spanish & English */}
          <div className="pt-1">
            <TagInput
              label={isEn ? 'Highlights (Spanish)' : 'Lo Más Destacado (Español)'}
              value={formData.highlights}
              onChange={(tags) => setFormData({ ...formData, highlights: tags })}
              placeholder="Escriba un destacado en español y presione Enter o +..."
              variant="ocean"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          <div className="pt-1">
            <TagInput
              label={isEn ? 'Highlights (English)' : 'Lo Más Destacado (Inglés)'}
              value={formData.highlightsEn}
              onChange={(tags) => setFormData({ ...formData, highlightsEn: tags })}
              placeholder="Type a highlight in English and press Enter or +..."
              variant="ocean"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          {/* Included Spanish & English */}
          <div className="pt-1">
            <TagInput
              label={isEn ? 'What is Included (Spanish)' : 'Qué Incluye (Español)'}
              value={formData.included}
              onChange={(tags) => setFormData({ ...formData, included: tags })}
              placeholder="Escriba qué incluye en español y presione Enter..."
              variant="emerald"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          <div className="pt-1">
            <TagInput
              label={isEn ? 'What is Included (English)' : 'Qué Incluye (Inglés)'}
              value={formData.includedEn}
              onChange={(tags) => setFormData({ ...formData, includedEn: tags })}
              placeholder="Type what is included in English and press Enter..."
              variant="emerald"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          {/* Not Included Spanish & English */}
          <div className="pt-1">
            <TagInput
              label={isEn ? 'What is NOT Included (Spanish)' : 'Qué NO Incluye (Español)'}
              value={formData.notIncluded}
              onChange={(tags) => setFormData({ ...formData, notIncluded: tags })}
              placeholder="Escriba qué NO incluye en español y presione Enter..."
              variant="rose"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          <div className="pt-1">
            <TagInput
              label={isEn ? 'What is NOT Included (English)' : 'Qué NO Incluye (Inglés)'}
              value={formData.notIncludedEn}
              onChange={(tags) => setFormData({ ...formData, notIncludedEn: tags })}
              placeholder="Type what is NOT included in English and press Enter..."
              variant="rose"
              addButtonLabel={t('offers.addTag', 'Agregar')}
            />
          </div>

          <div className="pt-2">
            <Checkbox
              id="isFeatured"
              label={t('offers.featuredCheckbox', 'Destacar esta oferta en la página principal')}
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            />
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
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(deleteConfirmId)}
            >
              {t('offers.yesDelete', 'Sí, Eliminar')}
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('offers.deleteConfirmDesc', 'Esta acción eliminará permanentemente la oferta de viaje del catálogo público.')}
          </p>
        </div>
      </Modal>
    </AdminShell>
  );
}
