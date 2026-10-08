'use client';

import React, { useState, useEffect } from 'react';
import AdminShell from '@/components/layout/AdminShell';
import { useLanguage } from '@/context/LanguageContext';
import { adminApi } from '@/lib/apiClient';
import {
  Users,
  Search,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Crown,
  Award,
  ShieldCheck,
  User,
  Coins,
  Calendar,
  Sparkles,
  Mail,
  Copy,
  Check,
  Filter,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';

export default function AdminUsersPage() {
  const { t, isEn } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editUserModal, setEditUserModal] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const MEMBERSHIP_CONFIG = {
    member: {
      name: isEn ? 'Member' : 'Miembro',
      icon: User,
      color: 'text-navy-700',
      iconColor: 'text-navy-500',
    },
    active_member: {
      name: isEn ? 'Active Member' : 'Miembro Activo',
      icon: ShieldCheck,
      color: 'text-emerald-700 font-semibold',
      iconColor: 'text-emerald-600',
    },
    ambassador: {
      name: isEn ? 'Ambassador' : 'Embajador',
      icon: Award,
      color: 'text-ocean-700 font-semibold',
      iconColor: 'text-ocean-600',
    },
    elite_ambassador: {
      name: isEn ? 'Elite Ambassador' : 'Embajador Élite',
      icon: Crown,
      color: 'text-gold-700 font-bold',
      iconColor: 'text-gold-600',
    },
  };

  useEffect(() => {
    loadUsers();
  }, [filterTier, filterRole, filterStatus, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (filterTier) params.append('membershipId', filterTier);
      if (filterRole) params.append('role', filterRole);
      if (filterStatus) params.append('status', filterStatus);
      params.append('page', pagination.page);
      params.append('limit', 20);

      const res = await adminApi.getUsers(params.toString());
      if (res.data) {
        setUsers(res.data.users || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    loadUsers();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterTier('');
    setFilterRole('');
    setFilterStatus('');
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast(isEn ? 'Copied to clipboard' : 'Copiado al portapapeles', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (user) => {
    setEditUserModal({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      membershipId: user.role === 'admin' ? null : (user.membershipId || 'member'),
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      availablePoints: user.pointsStats?.availablePoints || 0,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminApi.updateUserStatus(editUserModal.id, {
        role: editUserModal.role,
        membershipId: editUserModal.role === 'admin' ? null : editUserModal.membershipId,
        status: editUserModal.status,
        isEmailVerified: editUserModal.isEmailVerified,
        availablePoints: Number(editUserModal.availablePoints),
      });

      toast(
        `${t('users.successUpdated', 'Usuario actualizado correctamente.')} (${editUserModal.fullname})`,
        'success'
      );
      setEditUserModal(null);
      loadUsers();
    } catch (err) {
      toast(err.message || (isEn ? 'Error updating user' : 'Error al actualizar usuario'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setDeleteConfirmId(null);
      toast(t('users.successDeleted', 'Usuario eliminado permanentemente.'), 'success');
      loadUsers();
    } catch (err) {
      toast(err.message || (isEn ? 'Error deleting user' : 'Error al eliminar usuario'), 'error');
    }
  };

  const hasActiveFilters = search || filterTier || filterRole || filterStatus;

  return (
    <AdminShell
      title={t('users.title', 'Gestión de Miembros y Usuarios')}
      subtitle={t('users.subtitle', 'Administración de cuentas, niveles de membresía del club, roles y supervisión de red')}
    >
      {/* Top Quick Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center text-navy-900 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">
              {isEn ? 'Total Members' : 'Total Miembros'}
            </p>
            <p className="text-lg font-bold text-navy-950 font-serif leading-tight">
              {pagination.total || users.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              {isEn ? 'Current Page' : 'En Esta Página'}
            </p>
            <p className="text-lg font-bold text-navy-950 font-serif leading-tight">
              {users.length} {isEn ? 'users' : 'usuarios'}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-700 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
              {isEn ? 'Tiers Active' : 'Niveles de Club'}
            </p>
            <p className="text-lg font-bold text-navy-950 font-serif leading-tight">
              4 {isEn ? 'Tiers' : 'Niveles'}
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-50 flex items-center justify-center text-ocean-700 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ocean-700">
              {isEn ? 'Reward System' : 'Sistema Puntos'}
            </p>
            <p className="text-lg font-bold text-navy-950 font-serif leading-tight">
              {isEn ? 'Active PTS' : 'PTS Activo'}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-3 mb-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="flex-1 min-w-[220px]">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.searchPlaceholder', 'Buscar por nombre, correo, usuario o código de referido...')}
              icon={<Search className="w-4 h-4 text-navy-400" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex items-center gap-2.5">
            {/* Membership Tier Filter */}
            <div className="w-full lg:w-48">
              <CustomSelect
                value={filterTier}
                onChange={(e) => {
                  setFilterTier(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                options={[
                  { value: '', label: t('users.allTiers', 'Todas las Membresías') },
                  { value: 'member', label: isEn ? 'Member' : 'Miembro' },
                  { value: 'active_member', label: isEn ? 'Active Member' : 'Miembro Activo' },
                  { value: 'ambassador', label: isEn ? 'Ambassador' : 'Embajador' },
                  { value: 'elite_ambassador', label: isEn ? 'Elite Ambassador' : 'Embajador Élite' },
                ]}
                searchable={false}
              />
            </div>

            {/* Role Filter */}
            <div className="w-full lg:w-40">
              <CustomSelect
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                options={[
                  { value: '', label: t('users.allRoles', 'Todos los Roles') },
                  { value: 'user', label: t('users.roleUser', 'Usuario Regular') },
                  { value: 'admin', label: t('users.roleAdmin', 'Administrador') },
                ]}
                searchable={false}
              />
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-40">
              <CustomSelect
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                options={[
                  { value: '', label: t('users.allStatuses', 'Todos los Estados') },
                  { value: 'active', label: t('users.statusActive', 'Activo') },
                  { value: 'deactivate', label: t('users.statusInactive', 'Desactivado') },
                ]}
                searchable={false}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="navy"
                size="md"
                className="h-[38px] shadow-xs"
              >
                {t('users.filterBtn', 'Filtrar')}
              </Button>

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="h-[38px] text-navy-600 hover:text-navy-950"
                  onClick={handleResetFilters}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  title={isEn ? 'Reset filters' : 'Limpiar filtros'}
                >
                  {isEn ? 'Reset' : 'Limpiar'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-navy-900 border-b border-navy-800 text-white font-bold text-[11px] tracking-wider uppercase">
                <th className="px-5 py-4 min-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('users.userContact', 'Usuario / Contacto')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[170px]">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t('users.membershipLevel', 'Nivel de Membresía')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[140px]">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('users.roleStatus', 'Rol / Estado')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[150px]">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t('users.pointsBalance', 'Balance Puntos')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[160px]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('users.sponsor', 'Patrocinador (L1)')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 min-w-[130px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sand-300" />
                    <span>{t('users.registeredAt', 'Registro')}</span>
                  </div>
                </th>
                <th className="px-5 py-4 text-right min-w-[100px]">
                  <span>{t('common.actions', 'Acciones')}</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sand-100">
              {loading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-white">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sand-200 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 bg-sand-200 rounded w-28" />
                          <div className="h-2.5 bg-sand-100 rounded w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-6 bg-sand-200 rounded-lg w-24" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="h-5 bg-sand-200 rounded-md w-16" />
                        <div className="h-5 bg-sand-100 rounded-md w-14" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 bg-sand-200 rounded w-20 mb-1" />
                      <div className="h-3 bg-sand-100 rounded w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3.5 bg-sand-200 rounded w-24 mb-1" />
                      <div className="h-2.5 bg-sand-100 rounded w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-3 bg-sand-200 rounded w-20" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex gap-1.5">
                        <div className="w-7 h-7 bg-sand-200 rounded-lg" />
                        <div className="w-7 h-7 bg-sand-200 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12">
                    <EmptyState
                      icon={<Users className="w-7 h-7" />}
                      title={t('users.noUsersFound', 'No se encontraron usuarios')}
                      description={
                        hasActiveFilters
                          ? isEn
                            ? 'No users match your active search filters. Try resetting the filters.'
                            : 'No hay usuarios que coincidan con los filtros activos. Intenta restablecer los filtros.'
                          : isEn
                            ? 'There are currently no registered users in the database.'
                            : 'Actualmente no hay usuarios registrados en el sistema.'
                      }
                      actionText={hasActiveFilters ? (isEn ? 'Clear Filters' : 'Limpiar Filtros') : null}
                      onAction={hasActiveFilters ? handleResetFilters : null}
                      actionIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const tierConfig = MEMBERSHIP_CONFIG[u.membershipId] || MEMBERSHIP_CONFIG.member;
                  const TierIcon = tierConfig.icon;
                  const isVerified = u.isEmailVerified;
                  const initials = u.fullname
                    ? u.fullname
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-sand-50/80 transition-colors group border-b border-sand-100 last:border-0"
                    >
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.fullname}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-sand-200 group-hover:ring-gold-300 transition-all shadow-xs"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-900 to-navy-700 text-gold-300 font-bold text-xs flex items-center justify-center ring-2 ring-sand-200 group-hover:ring-gold-300 transition-all shadow-xs">
                                {initials}
                              </div>
                            )}

                            {/* Verification indicator */}
                            {isVerified && (
                              <div
                                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center shadow-xs"
                                title={t('users.emailVerified', 'Email Verificado')}
                              >
                                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <p className="font-bold text-navy-950 text-sm flex items-center gap-1.5 truncate">
                              <span>{u.fullname}</span>
                            </p>
                            <p className="text-[11px] text-navy-500 flex items-center gap-1 truncate mt-0.5">
                              <Mail className="w-3 h-3 text-navy-400 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </p>
                            {u.referralCode && (
                              <div className="inline-flex items-center gap-1 mt-1 bg-gold-50/80 hover:bg-gold-100 border border-gold-200 px-2 py-0.5 rounded-lg text-[10px] text-gold-900 font-mono font-semibold transition-colors">
                                <span>Ref: {u.referralCode}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(u.referralCode, u._id)}
                                  className="text-gold-700 hover:text-navy-950 cursor-pointer"
                                  title={isEn ? 'Copy referral code' : 'Copiar código de referido'}
                                >
                                  {copiedId === u._id ? (
                                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-2.5 h-2.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Membership Tier */}
                      <td className="px-5 py-4">
                        {u.role === 'admin' ? (
                          <div className="flex items-center gap-1.5 text-navy-400 italic text-xs">
                            <Shield className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                            <span>{isEn ? 'Independent (No Tier)' : 'Independiente (Sin Nivel)'}</span>
                          </div>
                        ) : (
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${tierConfig.color}`}>
                            <TierIcon className={`w-3.5 h-3.5 shrink-0 ${tierConfig.iconColor}`} />
                            <span>{tierConfig.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Role & Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="font-bold text-xs text-navy-950">
                              {u.status === 'active' ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider pl-3.5">
                            {u.role === 'admin' ? (
                              <span className="text-gold-700 font-extrabold">{isEn ? 'Admin' : 'Administrador'}</span>
                            ) : (
                              <span className="text-navy-400">{isEn ? 'User' : 'Usuario'}</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Points Balance */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-navy-950 text-sm flex items-center gap-1">
                            <span>{(u.pointsStats?.availablePoints || 0).toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-gold-700">PTS</span>
                          </p>
                          <p className="text-[11px] text-navy-400 mt-0.5">
                            {t('common.total', 'Total')}: {(u.pointsStats?.totalEarnedPoints || 0).toLocaleString()}
                          </p>
                        </div>
                      </td>

                      {/* Sponsor */}
                      <td className="px-5 py-4 text-xs">
                        {u.referredBy ? (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-navy-950">
                              {u.referredBy.fullname}
                            </p>
                            <p className="text-[11px] text-navy-400 font-mono">
                              {u.referredBy.referralCode || u.referredBy.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-navy-400 italic">
                            {t('common.directSponsor', 'Directo (Sin sponsor)')}
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-4 text-navy-600 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-navy-400" />
                          <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 text-navy-700 bg-sand-100/70 hover:bg-gold-100 hover:text-gold-900 border border-sand-200 hover:border-gold-300 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
                            title={t('users.editUserTitle', 'Editar usuario y nivel')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(u._id)}
                            className="p-2 text-rose-600 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 hover:border-rose-300 rounded-xl transition-all duration-150 cursor-pointer shadow-xs"
                            title={t('common.delete', 'Eliminar usuario')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar with Pure White Background and Interactive Pagination */}
        <div className="px-5 py-4 bg-white border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-600">
          <span className="text-xs">
            {t('common.page', 'Página')}{' '}
            <span className="font-bold text-navy-950">{pagination.page}</span> {t('common.of', 'de')}{' '}
            <span className="font-bold text-navy-950">{pagination.totalPages || 1}</span>{' '}
            <span className="text-navy-400">
              ({pagination.total} {t('common.users', 'usuarios')})
            </span>
          </span>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages || 1}
            onChange={(newPage) => setPagination((p) => ({ ...p, page: newPage }))}
          />
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editUserModal}
        onClose={() => setEditUserModal(null)}
        title={t('users.editUserTitle', 'Modificar Usuario')}
        subtitle={editUserModal ? `${editUserModal.fullname} (${editUserModal.email})` : ''}
        icon={Shield}
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditUserModal(null)}
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
            <Button
              variant="gold"
              size="sm"
              type="submit"
              form="edit-user-form"
              disabled={submitting}
              isLoading={submitting}
            >
              {t('common.save', 'Actualizar Usuario')}
            </Button>
          </>
        }
      >
        {editUserModal && (
          <form id="edit-user-form" onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <Input
                label={t('users.fullname', 'Nombre Completo')}
                disabled
                value={editUserModal.fullname}
              />
            </div>

            {editUserModal.role === 'admin' ? (
              <div className="p-3.5 bg-sand-100/70 rounded-xl border border-sand-200 text-xs text-navy-700">
                <p className="font-semibold text-navy-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-navy-700" />
                  <span>{isEn ? 'Administrator Account' : 'Cuenta de Administrador'}</span>
                </p>
                <p className="text-[11px] text-navy-500 mt-1">
                  {isEn
                    ? 'Administrators are independent of the club membership tier system.'
                    : 'Los administradores son independientes del sistema de niveles de membresía.'}
                </p>
              </div>
            ) : (
              <div>
                <CustomSelect
                  label={t('users.tierLevel', 'Nivel de Membresía')}
                  required
                  value={editUserModal.membershipId || 'member'}
                  onChange={(e) => setEditUserModal({ ...editUserModal, membershipId: e.target.value })}
                  options={[
                    { value: 'member', label: isEn ? 'Member (0 levels)' : 'Miembro (0 niveles)' },
                    { value: 'active_member', label: isEn ? 'Active Member (100% Level 1)' : 'Miembro Activo (100% Nivel 1)' },
                    { value: 'ambassador', label: isEn ? 'Ambassador (100% L1 + 50% L2)' : 'Embajador (100% N1 + 50% N2)' },
                    { value: 'elite_ambassador', label: isEn ? 'Elite Ambassador (100% L1 + 50% L2)' : 'Embajador Élite (100% N1 + 50% N2)' },
                  ]}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <CustomSelect
                  label={t('users.systemRole', 'Rol del Sistema')}
                  value={editUserModal.role}
                  onChange={(e) => {
                    const nextRole = e.target.value;
                    setEditUserModal({
                      ...editUserModal,
                      role: nextRole,
                      membershipId: nextRole === 'admin' ? null : (editUserModal.membershipId || 'member'),
                    });
                  }}
                  options={[
                    { value: 'user', label: t('users.roleUser', 'Usuario Regular') },
                    { value: 'admin', label: t('users.roleAdmin', 'Administrador') },
                  ]}
                />
              </div>

              <div>
                <CustomSelect
                  label={t('users.accountStatus', 'Estado')}
                  value={editUserModal.status}
                  onChange={(e) => setEditUserModal({ ...editUserModal, status: e.target.value })}
                  options={[
                    { value: 'active', label: t('users.statusActive', 'Activo') },
                    { value: 'deactivate', label: t('users.statusInactive', 'Desactivado') },
                  ]}
                />
              </div>
            </div>

            <div>
              <Input
                label={t('users.availablePoints', 'Balance de Puntos Disponibles (PTS)')}
                type="number"
                min="0"
                value={editUserModal.availablePoints}
                onChange={(e) => setEditUserModal({ ...editUserModal, availablePoints: e.target.value })}
              />
            </div>

            <div className="pt-1">
              <Checkbox
                id="emailVerifiedCheck"
                label={t('users.emailVerified', 'Correo electrónico verificado')}
                checked={editUserModal.isEmailVerified}
                onChange={(e) => setEditUserModal({ ...editUserModal, isEmailVerified: e.target.checked })}
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Delete User Confirmation */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t('users.deleteConfirmTitle', '¿Eliminar Usuario?')}
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
              onClick={() => handleDeleteUser(deleteConfirmId)}
            >
              {t('offers.yesDelete', 'Sí, Eliminar')}
            </Button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('users.deleteConfirmDesc', 'Esta acción eliminará de forma irreversible al usuario del sistema y sus accesos.')}
          </p>
        </div>
      </Modal>
    </AdminShell>
  );
}
