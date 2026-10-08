'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Calculator,
  CheckCircle2,
  Compass,
  Waves,
  Award,
  Crown,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Coins,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Shield,
  Star,
  Check,
  Info,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import TagInput from '@/components/ui/TagInput';
import { useToast } from '@/components/ui/Toast';

const ICON_MAP = {
  Compass: Compass,
  Waves: Waves,
  Award: Award,
  Crown: Crown,
  Sparkles: Sparkles,
  Zap: Zap,
  Shield: Shield,
  Star: Star,
};

const CATEGORY_META = {
  member: {
    labelEs: 'Miembro',
    labelEn: 'Member',
    descEs: 'Nivel base al registrarse (0% N1, 0% N2)',
    descEn: 'Base rank upon sign up (0% L1, 0% L2)',
    defaultIcon: 'Compass',
    defaultColor: '#64748b',
  },
  active_member: {
    labelEs: 'Miembro Activo',
    labelEn: 'Active Member',
    descEs: '1ra compra realizada (100% N1, 0% N2)',
    descEn: '1st purchase completed (100% L1, 0% L2)',
    defaultIcon: 'Waves',
    defaultColor: '#059669',
  },
  ambassador: {
    labelEs: 'Embajador',
    labelEn: 'Ambassador',
    descEs: 'Líder 2 niveles (100% N1, 50% N2)',
    descEn: '2-Tier Leader (100% L1, 50% L2)',
    defaultIcon: 'Award',
    defaultColor: '#0284c7',
  },
  elite_ambassador: {
    labelEs: 'Embajador Élite',
    labelEn: 'Elite Ambassador',
    descEs: 'Rango Máximo VIP (100% N1, 100% N2)',
    descEn: 'Top VIP Master rank (100% L1, 100% L2)',
    defaultIcon: 'Crown',
    defaultColor: '#AA303E',
  },
};

const ALL_CATEGORIES = ['member', 'active_member', 'ambassador', 'elite_ambassador'];

export default function AdminMembershipsPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    nameEn: '',
    tag: '',
    tagEn: '',
    subtitle: '',
    subtitleEn: '',
    icon: 'Compass',
    color: '#AA303E',
    level1Rate: 100,
    level2Rate: 0,
    qualification: '',
    qualificationEn: '',
    perks: [''],
    perksEn: [''],
  });
  const [errors, setErrors] = useState({});

  // Simulator State
  const [simulationPoints, setSimulationPoints] = useState(150);
  const [simL1Tier, setSimL1Tier] = useState('active_member');
  const [simL2Tier, setSimL2Tier] = useState('ambassador');

  // Load tiers from backend
  const loadTiers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMembershipTiers();
      if (res.data) {
        setTiers(res.data);
      }
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || (isEn ? 'Error loading membership tiers' : 'Error al cargar niveles de membresía'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTiers();
  }, []);

  // Compute available categories (that haven't been created yet)
  const existingCategories = useMemo(() => tiers.map((t) => t.category), [tiers]);
  const availableCategories = useMemo(
    () => ALL_CATEGORIES.filter((cat) => !existingCategories.includes(cat)),
    [existingCategories]
  );
  const isFull = availableCategories.length === 0;

  // Open Create Modal
  const handleOpenCreate = () => {
    if (isFull) {
      toast({
        type: 'error',
        message: isEn
          ? 'All 4 membership categories (Member, Active Member, Ambassador, Elite Ambassador) already exist. You can edit existing tiers.'
          : 'Ya existen las 4 categorías permitidas (Miembro, Miembro Activo, Embajador, Embajador Élite). Puede editar los niveles existentes.',
      });
      return;
    }

    const defaultCat = availableCategories[0] || 'member';
    const meta = CATEGORY_META[defaultCat] || {};
    const defaultName = meta.labelEn || meta.labelEs || 'Member';

    setEditingTier(null);
    setFormData({
      category: defaultCat,
      name: defaultName,
      nameEn: defaultName,
      tag: 'Rank Tier',
      tagEn: 'Rank Tier',
      subtitle: meta.descEn || meta.descEs || '',
      subtitleEn: meta.descEn || meta.descEs || '',
      icon: meta.defaultIcon || 'Compass',
      color: meta.defaultColor || '#AA303E',
      level1Rate: defaultCat === 'member' ? 0 : 100,
      level2Rate: defaultCat === 'ambassador' ? 50 : defaultCat === 'elite_ambassador' ? 100 : 0,
      qualification: '',
      qualificationEn: '',
      perks: [],
      perksEn: [],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tier) => {
    setEditingTier(tier);
    const chosenName = tier.nameEn || tier.name || '';
    const chosenTag = tier.tagEn || tier.tag || '';
    const chosenSubtitle = tier.subtitleEn || tier.subtitle || '';
    const chosenQual = tier.qualificationEn || tier.qualification || '';
    const chosenPerks = Array.isArray(tier.perksEn) && tier.perksEn.length > 0
      ? tier.perksEn
      : (Array.isArray(tier.perks) ? tier.perks : []);

    setFormData({
      category: tier.category,
      name: chosenName,
      nameEn: chosenName,
      tag: chosenTag,
      tagEn: chosenTag,
      subtitle: chosenSubtitle,
      subtitleEn: chosenSubtitle,
      icon: tier.icon || 'Compass',
      color: tier.color || '#AA303E',
      level1Rate: tier.level1Rate ?? 0,
      level2Rate: tier.level2Rate ?? 0,
      qualification: chosenQual,
      qualificationEn: chosenQual,
      perks: chosenPerks,
      perksEn: chosenPerks,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Category select change on Create
  const handleCategorySelectChange = (cat) => {
    const meta = CATEGORY_META[cat] || {};
    const defaultName = meta.labelEn || meta.labelEs || '';
    const defaultSubtitle = meta.descEn || meta.descEs || '';
    setFormData((prev) => ({
      ...prev,
      category: cat,
      name: defaultName,
      nameEn: defaultName,
      subtitle: defaultSubtitle,
      subtitleEn: defaultSubtitle,
      icon: meta.defaultIcon || prev.icon,
      color: meta.defaultColor || prev.color,
      level1Rate: cat === 'member' ? 0 : 100,
      level2Rate: cat === 'ambassador' ? 50 : cat === 'elite_ambassador' ? 100 : 0,
    }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: '' }));
    }
  };

  // Submit Create / Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = isEn ? 'Category is required.' : 'La categoría es obligatoria.';
    }
    if (!formData.name.trim()) {
      newErrors.name = isEn ? 'Tier name is required.' : 'El nombre del nivel es obligatorio.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    const cleanPerks = Array.isArray(formData.perks)
      ? formData.perks.map((p) => String(p).trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      name: formData.name.trim(),
      nameEn: formData.nameEn?.trim() || formData.name.trim(),
      tag: formData.tag?.trim() || '',
      tagEn: formData.tagEn?.trim() || formData.tag?.trim() || '',
      subtitle: formData.subtitle || '',
      subtitleEn: formData.subtitleEn || formData.subtitle || '',
      icon: formData.icon || CATEGORY_META[formData.category]?.defaultIcon || 'Award',
      color: formData.color || CATEGORY_META[formData.category]?.defaultColor || '#AA303E',
      qualification: formData.qualification || '',
      qualificationEn: formData.qualificationEn || formData.qualification || '',
      level1Rate: Number(formData.level1Rate),
      level2Rate: Number(formData.level2Rate),
      perks: cleanPerks,
      perksEn: cleanPerks,
    };

    try {
      if (editingTier) {
        await adminApi.updateMembershipTier(editingTier._id, payload);
        toast({
          type: 'success',
          message: isEn ? 'Membership tier updated successfully!' : '¡Nivel de membresía actualizado con éxito!',
        });
      } else {
        await adminApi.createMembershipTier(payload);
        toast({
          type: 'success',
          message: isEn ? 'New membership tier created successfully!' : '¡Nivel de membresía creado con éxito!',
        });
      }
      setIsModalOpen(false);
      loadTiers();
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || (isEn ? 'Error saving tier' : 'Error al guardar el nivel de membresía'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Tier
  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await adminApi.deleteMembershipTier(id);
      toast({
        type: 'success',
        message: isEn ? 'Membership tier deleted successfully!' : '¡Nivel de membresía eliminado exitosamente!',
      });
      setDeleteConfirmId(null);
      loadTiers();
    } catch (err) {
      toast({
        type: 'error',
        message: err.message || (isEn ? 'Error deleting tier' : 'Error al eliminar nivel de membresía'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic Rate for simulator based on active tiers
  const getSimRate = (cat, level) => {
    const tier = tiers.find((t) => t.category === cat);
    if (!tier) return 0;
    if (level === 1) return (tier.level1Rate || 0) / 100;
    if (level === 2) return (tier.level2Rate || 0) / 100;
    return 0;
  };

  const l1Earned = Math.round(simulationPoints * getSimRate(simL1Tier, 1));
  const l2Earned = Math.round(simulationPoints * getSimRate(simL2Tier, 2));

  return (
    <AdminShell
      title={t('memberships.title', 'Estructura de Membresías & Comisiones')}
      subtitle={t('memberships.subtitle', 'Reglas oficiales del club, niveles de referidos y simulador interactivo de liquidación')}
    >
      {/* Top Bar with Actions & Category Constraint Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#AA303E]/10 text-[#AA303E] flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-navy-950">
              {isEn ? 'Membership Tiers Configuration' : 'Configuración de Niveles de Membresía'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEn
                ? `Configured: ${tiers.length}/4 Categories (1 per category: Member, Active Member, Ambassador, Elite Ambassador)`
                : `Configurados: ${tiers.length}/4 Categorías (1 por categoría: Miembro, Miembro Activo, Embajador, Embajador Élite)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            disabled={isFull}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-all ${
              isFull
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-[#AA303E] hover:bg-[#8e2531] text-white cursor-pointer active:scale-95 shadow-md shadow-[#AA303E]/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>
              {isFull
                ? (isEn ? 'All Categories Configured (4/4)' : 'Todas las Categorías Configuradas (4/4)')
                : (isEn ? 'Create Membership Tier' : 'Crear Nivel de Membresía')}
            </span>
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#AA303E]" />
          <p className="text-xs font-bold text-slate-500">
            {isEn ? 'Loading membership tiers...' : 'Cargando niveles de membresía...'}
          </p>
        </div>
      ) : tiers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-sand-200 shadow-sm">
          <Award className="w-12 h-12 text-sand-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-navy-900">
            {isEn ? 'No membership tiers found' : 'No se encontraron niveles de membresía'}
          </p>
          <p className="text-xs text-navy-500 mt-1 max-w-md mx-auto">
            {isEn
              ? "Click 'Create Membership Tier' above to configure your club tiers."
              : "Haga clic en 'Crear Nivel de Membresía' arriba para configurar los niveles del club."}
          </p>
        </div>
      ) : (
        /* Membership Tiers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {tiers.map((tier) => {
            const IconComponent = ICON_MAP[tier.icon] || Award;
            const isElite = tier.category === 'elite_ambassador';

            return (
              <div
                key={tier._id}
                className={`relative rounded-3xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden group ${
                  isElite
                    ? 'bg-gradient-to-b from-[#1C1009] via-[#150B06] to-[#0A0503] text-white border-gold-400/80 shadow-[0_8px_30px_-5px_rgba(212,160,23,0.3)]'
                    : 'bg-white border-slate-200/90 shadow-xs hover:border-[#AA303E]/40'
                }`}
              >
                {/* Background Ambient Icon */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-110 transition-all pointer-events-none">
                  <IconComponent className="w-full h-full" />
                </div>

                <div className="relative">
                  {/* Card Top: Icon, Tag & Action Buttons */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white font-bold shrink-0"
                      style={{ backgroundColor: tier.color || '#AA303E' }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      {tier.tag && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border whitespace-nowrap shrink-0 leading-none ${
                            isElite
                              ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                              : 'bg-slate-100 text-slate-800 border-slate-200/80'
                          }`}
                        >
                          {isEn ? tier.tagEn || tier.tag : tier.tag}
                        </span>
                      )}

                      {/* Action Menu (Edit & Delete) */}
                      <div className="flex items-center gap-1 pl-1 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(tier)}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isElite
                              ? 'bg-gold-500/20 text-gold-300 hover:bg-gold-500 hover:text-navy-950 shadow-xs'
                              : 'bg-[#AA303E]/10 text-[#AA303E] hover:bg-[#AA303E] hover:text-white shadow-xs'
                          }`}
                          title={isEn ? 'Edit Tier' : 'Editar Nivel'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tier._id)}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isElite
                              ? 'text-rose-400 hover:bg-rose-500/20'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={isEn ? 'Delete Tier' : 'Eliminar Nivel'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tier Name & Subtitle */}
                  <h3
                    className={`text-xl font-serif font-black ${
                      isElite
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-amber-100'
                        : 'text-navy-950'
                    }`}
                  >
                    {isEn ? tier.nameEn || tier.name : tier.name}
                  </h3>
                  <p className={`text-xs font-medium mt-1 mb-4 ${isElite ? 'text-sand-300/80' : 'text-slate-500'}`}>
                    {isEn ? tier.subtitleEn || tier.subtitle : tier.subtitle}
                  </p>

                  {/* Commission Rates Breakdown (2-Color Balanced Layout) */}
                  <div className="mb-5 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/5">
                      <span className={`capitalize ${isElite ? 'text-sand-300' : 'text-slate-600'}`}>
                        {t('memberships.networkLevels', 'Niveles de Red:')}
                      </span>
                      <span className={`font-bold capitalize ${isElite ? 'text-gold-300' : 'text-navy-950'}`}>
                        {tier.maxReferralLevel} {isEn ? 'Level(s)' : 'Nivel(es)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-white/5">
                      <span className={`capitalize ${isElite ? 'text-sand-300' : 'text-slate-600'}`}>
                        {t('memberships.commissionN1', 'Comisión N1 (Directo):')}
                      </span>
                      <span className={`font-bold ${isElite ? 'text-gold-300' : 'text-navy-950'}`}>
                        {tier.level1Rate}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className={`capitalize ${isElite ? 'text-sand-300' : 'text-slate-600'}`}>
                        {t('memberships.commissionN2', 'Comisión N2 (Indirecto):')}
                      </span>
                      <span className={`font-bold ${isElite ? 'text-gold-300' : 'text-navy-950'}`}>
                        {tier.level2Rate}%
                      </span>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    <p
                      className={`text-xs font-bold capitalize ${
                        isElite ? 'text-gold-300' : 'text-navy-950'
                      }`}
                    >
                      {t('memberships.benefits', 'Beneficios Clave:')}
                    </p>
                    <ul className="space-y-2 text-xs">
                      {(isEn ? (tier.perksEn?.length ? tier.perksEn : tier.perks) : tier.perks || []).map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isElite ? 'text-gold-400' : 'text-[#AA303E]'
                            }`}
                          />
                          <span className={isElite ? 'text-sand-200' : 'text-slate-700'}>
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Qualification Footer */}
                <div
                  className={`relative mt-6 pt-4 border-t text-xs ${
                    isElite ? 'border-gold-500/20 text-sand-300' : 'border-slate-200/80 text-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <Zap className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isElite ? 'text-gold-400' : 'text-[#AA303E]'}`} />
                    <div>
                      <strong className={`capitalize ${isElite ? 'text-gold-300' : 'text-navy-950'}`}>
                        {t('memberships.qualification', 'Calificación:')}{' '}
                      </strong>
                      <span className="text-[11px] leading-relaxed">
                        {isEn ? tier.qualificationEn || tier.qualification : tier.qualification}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ultra-Modern Interactive Commission Simulator */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-visible">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#AA303E] via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-[#AA303E]/20 ring-4 ring-rose-50">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-extrabold text-navy-950">
              {t('memberships.simulatorTitle', 'Simulador de Comisiones de Compra Multinivel')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t('memberships.simulatorDesc', 'Pruebe cómo el motor de comisiones distribuye los puntos a la línea ascendente según el nivel de cada sponsor')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4 bg-gradient-to-b from-slate-50 to-sand-50/60 p-6 rounded-2xl border border-slate-200 shadow-xs relative z-20">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-navy-900 mb-1.5">
                {t('memberships.simPackagePoints', 'Puntos del Paquete Comprado (PTS)')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={simulationPoints}
                  onChange={(e) => setSimulationPoints(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 text-base font-black bg-white border border-slate-300 rounded-xl focus:border-[#AA303E] outline-none ring-0 text-navy-950 transition-colors"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-black text-slate-400">
                  PTS
                </span>
              </div>
            </div>

            <div>
              <CustomSelect
                label={t('memberships.simL1Tier', 'Membresía Patrocinador Directo (N1)')}
                value={simL1Tier}
                onChange={(e) => setSimL1Tier(e.target.value)}
                placeholder={isEn ? '-- Select --' : '-- Seleccionar --'}
                options={tiers.map((t) => ({
                  value: t.category,
                  label: `${isEn ? t.nameEn || t.name : t.name} (${t.level1Rate}%)`,
                }))}
              />
            </div>

            <div>
              <CustomSelect
                label={t('memberships.simL2Tier', 'Membresía Patrocinador Superior (N2)')}
                value={simL2Tier}
                onChange={(e) => setSimL2Tier(e.target.value)}
                placeholder={isEn ? '-- Select --' : '-- Seleccionar --'}
                options={tiers.map((t) => ({
                  value: t.category,
                  label: `${isEn ? t.nameEn || t.name : t.name} (${t.level2Rate}%)`,
                }))}
              />
            </div>
          </div>

          {/* Results Flow */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Buyer */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block mb-1">
                  {t('memberships.simBuyer', 'Comprador')}
                </span>
                <p className="text-sm font-black text-navy-950">{isEn ? 'Member' : 'Miembro'}</p>
                <p className="text-2xl font-serif font-extrabold text-navy-950 mt-2">
                  {simulationPoints} <span className="text-xs font-sans text-slate-400">PTS</span>
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Qualifies for Active' : 'Califica para Activo'}</span>
                </p>
              </div>

              {/* L1 Sponsor */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-50/40 to-white border border-rose-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#AA303E] block mb-1">
                  {t('memberships.simL1Sponsor', 'Patrocinador Directo (N1)')}
                </span>
                <p className="text-sm font-black text-navy-950 capitalize">{simL1Tier.replace('_', ' ')}</p>
                <p className="text-2xl font-serif font-extrabold text-[#AA303E] mt-2">
                  +{l1Earned} <span className="text-xs font-sans text-rose-600 font-bold">PTS</span>
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-2">
                  {t('points.appliedRate', 'Tasa')}: <strong className="text-navy-950">{getSimRate(simL1Tier, 1) * 100}%</strong>
                </p>
              </div>

              {/* L2 Sponsor */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-sky-50/60 to-white border border-sky-200 shadow-xs">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-900 block mb-1">
                  {t('memberships.simL2Sponsor', 'Patrocinador Indirecto (N2)')}
                </span>
                <p className="text-sm font-black text-navy-950 capitalize">{simL2Tier.replace('_', ' ')}</p>
                <p className="text-2xl font-serif font-extrabold text-sky-700 mt-2">
                  +{l2Earned} <span className="text-xs font-sans text-sky-600 font-bold">PTS</span>
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-2">
                  {t('points.appliedRate', 'Tasa')}: <strong className="text-navy-950">{getSimRate(simL2Tier, 2) * 100}%</strong>
                </p>
              </div>
            </div>

            {/* Total Issued Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-[#1e0d10] to-navy-950 text-white flex items-center justify-between border border-rose-500/20 shadow-lg shadow-navy-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#AA303E]/30 text-rose-300 flex items-center justify-center border border-rose-400/30">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-serif font-bold text-rose-200">
                    {t('memberships.simTotalDistributed', 'Total Puntos de Comisión Emitidos')}
                  </p>
                  <p className="text-xs text-slate-300 font-medium">
                    {t('memberships.simTotalSum', 'Suma distribuida a patrocinadores L1 y L2')}
                  </p>
                </div>
              </div>
              <span className="text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-300 to-amber-100">
                {l1Earned + l2Earned} PTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setErrors({});
        }}
        title={
          editingTier
            ? isEn ? 'Edit Membership Tier' : 'Editar Nivel de Membresía'
            : isEn ? 'New Membership Tier' : 'Nuevo Nivel de Membresía'
        }
        subtitle={
          isEn
            ? 'Configure category, commission rates, and key benefits'
            : 'Configura categoría, tasas de comisión y beneficios clave'
        }
        icon={Award}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer transition-colors"
            >
              {isEn ? 'Cancel' : 'Cancelar'}
            </button>
            <button
              type="submit"
              form="membership-tier-form"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold bg-[#AA303E] hover:bg-[#8e2531] text-white rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer shadow-[#AA303E]/20"
            >
              {submitting
                ? isEn ? 'Saving...' : 'Guardando...'
                : editingTier
                ? isEn ? 'Update Tier' : 'Actualizar Nivel'
                : isEn ? 'Create Tier' : 'Crear Nivel'}
            </button>
          </>
        }
      >
        <form id="membership-tier-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Tier Category Selector */}
          <div>
            <CustomSelect
              label={isEn ? 'Tier Category' : 'Categoría del Nivel'}
              required
              value={formData.category}
              disabled={!!editingTier}
              onChange={(e) => handleCategorySelectChange(e.target.value)}
              placeholder={isEn ? '-- Select Tier Category --' : '-- Seleccionar Categoría --'}
              options={
                editingTier
                  ? [
                      {
                        value: editingTier.category,
                        label: isEn
                          ? CATEGORY_META[editingTier.category]?.labelEn || editingTier.category.replace('_', ' ')
                          : CATEGORY_META[editingTier.category]?.labelEs || editingTier.category.replace('_', ' '),
                        sublabel: isEn
                          ? CATEGORY_META[editingTier.category]?.descEn
                          : CATEGORY_META[editingTier.category]?.descEs,
                      },
                    ]
                  : availableCategories.map((cat) => {
                      const meta = CATEGORY_META[cat] || {};
                      return {
                        value: cat,
                        label: isEn ? meta.labelEn : meta.labelEs,
                        sublabel: isEn ? meta.descEn : meta.descEs,
                      };
                    })
              }
              error={errors.category}
            />
          </div>

          {/* Tier Name & Rank Badge / Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Tier Name' : 'Nombre del Nivel'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value, nameEn: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder={isEn ? 'e.g. Active Member' : 'ej. Miembro Activo'}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 text-navy-950 transition-colors"
              />
              {errors.name && <p className="text-[11px] text-rose-500 font-semibold mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Rank Badge / Tag' : 'Etiqueta / Badge'}
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value, tagEn: e.target.value })}
                placeholder={isEn ? 'e.g. 1st Purchase' : 'ej. 1ra Compra'}
                className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 text-navy-950 transition-colors"
              />
            </div>
          </div>

          {/* Commission Rates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Direct Commission Rate (Level 1)' : 'Comisión Directa (Nivel 1)'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.level1Rate}
                onChange={(e) => setFormData({ ...formData, level1Rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-bold bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 text-navy-950 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-800 mb-1">
                {isEn ? 'Indirect Commission Rate (Level 2)' : 'Comisión Indirecta (Nivel 2)'}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.level2Rate}
                onChange={(e) => setFormData({ ...formData, level2Rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs font-bold bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 text-navy-950 transition-colors"
              />
            </div>
          </div>

          {/* Qualification Requirements */}
          <div>
            <label className="block text-xs font-bold text-navy-800 mb-1">
              {isEn ? 'Qualification Requirements' : 'Requisitos de Calificación'}
            </label>
            <textarea
              rows="2"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value, qualificationEn: e.target.value })}
              placeholder={isEn ? 'e.g. Make at least 1 travel package purchase.' : 'ej. Realizar al menos 1 compra de paquete de viaje.'}
              className="w-full px-3.5 py-2 text-xs bg-white border border-sand-200 rounded-xl focus:border-gold-500 outline-none ring-0 focus:outline-none focus:ring-0 text-navy-950 transition-colors resize-none"
            />
          </div>

          {/* Key Benefits TagInput */}
          <div className="pt-1">
            <TagInput
              label={isEn ? 'Key Benefits & Perks' : 'Beneficios y Ventajas Clave'}
              value={formData.perks}
              onChange={(tags) => setFormData({ ...formData, perks: tags, perksEn: tags })}
              placeholder={isEn ? 'Type a perk and press Enter or +...' : 'Escriba un beneficio y presione Enter o +...'}
              variant="ocean"
              addButtonLabel={isEn ? 'Add' : 'Agregar'}
            />
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={isEn ? 'Delete Membership Tier?' : '¿Eliminar Nivel de Membresía?'}
        subtitle={isEn ? 'This category slot will become available again' : 'Este espacio de categoría volverá a estar disponible'}
        icon={Trash2}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Cancelar'}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(deleteConfirmId)}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEn ? 'Yes, Delete' : 'Sí, Eliminar'}</span>
            </button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-xs text-slate-600">
            {isEn
              ? 'Are you sure you want to delete this membership tier? This will free up the category slot so a new tier can be configured for it.'
              : '¿Estás seguro de que deseas eliminar este nivel de membresía? Esto liberará el espacio de la categoría para que se pueda configurar un nuevo nivel.'}
          </p>
        </div>
      </Modal>
    </AdminShell>
  );
}
