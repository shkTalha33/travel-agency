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
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import CustomSelect from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

export default function AdminUsersPage() {
  const { t, isEn } = useLanguage();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editUserModal, setEditUserModal] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const MEMBERSHIP_LABELS = {
    member: { name: isEn ? 'Member' : 'Miembro', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    active_member: { name: isEn ? 'Active Member' : 'Miembro Activo', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    ambassador: { name: isEn ? 'Ambassador' : 'Embajador', color: 'bg-ocean-50 text-ocean-800 border-ocean-300' },
    elite_ambassador: { name: isEn ? 'Elite Ambassador' : 'Embajador Élite', color: 'bg-gold-50 text-gold-900 border-gold-400' },
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
    setPagination({ ...pagination, page: 1 });
    loadUsers();
  };

  const handleOpenEdit = (user) => {
    setEditUserModal({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      membershipId: user.membershipId,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      availablePoints: user.pointsStats?.availablePoints || 0,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert(null);

    try {
      await adminApi.updateUserStatus(editUserModal.id, {
        role: editUserModal.role,
        membershipId: editUserModal.membershipId,
        status: editUserModal.status,
        isEmailVerified: editUserModal.isEmailVerified,
        availablePoints: Number(editUserModal.availablePoints),
      });

      setAlert({
        type: 'success',
        text: `${t('users.successUpdated', 'Usuario actualizado correctamente.')} (${editUserModal.fullname})`,
      });
      setEditUserModal(null);
      loadUsers();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al actualizar usuario' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminApi.deleteUser(id);
      setDeleteConfirmId(null);
      setAlert({ type: 'success', text: t('users.successDeleted', 'Usuario eliminado permanentemente.') });
      loadUsers();
    } catch (err) {
      setAlert({ type: 'error', text: err.message || 'Error al eliminar usuario' });
    }
  };

  return (
    <AdminShell
      title={t('users.title', 'Gestión de Miembros y Usuarios')}
      subtitle={t('users.subtitle', 'Administración de cuentas, niveles de membresía del club, roles y supervisión de red')}
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

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.searchPlaceholder', 'Buscar por nombre, correo, usuario o código de referido...')}
              className="w-full pl-10 pr-4 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Membership Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none font-medium text-navy-800"
            >
              <option value="">{t('users.allTiers', 'Todas las Membresías')}</option>
              <option value="member">{isEn ? 'Member' : 'Miembro'}</option>
              <option value="active_member">{isEn ? 'Active Member' : 'Miembro Activo'}</option>
              <option value="ambassador">{isEn ? 'Ambassador' : 'Embajador'}</option>
              <option value="elite_ambassador">{isEn ? 'Elite Ambassador' : 'Embajador Élite'}</option>
            </select>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none font-medium text-navy-800"
            >
              <option value="">{t('users.allRoles', 'Todos los Roles')}</option>
              <option value="user">{t('users.roleUser', 'Usuario Regular')}</option>
              <option value="admin">{t('users.roleAdmin', 'Administrador')}</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-sand-50 border border-sand-200 rounded-xl focus:border-gold-500 outline-none font-medium text-navy-800"
            >
              <option value="">{t('users.allStatuses', 'Todos los Estados')}</option>
              <option value="active">{t('users.statusActive', 'Activo')}</option>
              <option value="deactivate">{t('users.statusInactive', 'Desactivado')}</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-navy-800 cursor-pointer"
            >
              {t('users.filterBtn', 'Filtrar')}
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-100/70 border-b border-sand-200 text-navy-800 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">{t('users.userContact', 'Usuario / Contacto')}</th>
                <th className="px-5 py-3.5">{t('users.membershipLevel', 'Nivel de Membresía')}</th>
                <th className="px-5 py-3.5">{t('users.roleStatus', 'Rol / Estado')}</th>
                <th className="px-5 py-3.5">{t('users.pointsBalance', 'Balance Puntos')}</th>
                <th className="px-5 py-3.5">{t('users.sponsor', 'Patrocinador (L1)')}</th>
                <th className="px-5 py-3.5">{t('users.registeredAt', 'Registro')}</th>
                <th className="px-5 py-3.5 text-right">{t('common.actions', 'Acciones')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-navy-500">
                    {t('users.loadingUsers', 'Cargando usuarios del sistema...')}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-navy-500">
                    {t('users.noUsersFound', 'No se encontraron usuarios con los criterios seleccionados.')}
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const tier = MEMBERSHIP_LABELS[u.membershipId] || MEMBERSHIP_LABELS.member;
                  return (
                    <tr key={u._id} className="hover:bg-sand-50/80 transition-colors">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                            alt={u.fullname}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-sand-300"
                          />
                          <div>
                            <p className="font-bold text-navy-950 flex items-center gap-1.5">
                              <span>{u.fullname}</span>
                              {u.isEmailVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title={t('users.emailVerified', 'Email Verificado')} />
                              )}
                            </p>
                            <p className="text-[11px] text-navy-500">{u.email}</p>
                            <p className="text-[10px] text-gold-700 font-mono font-semibold">
                              Ref: {u.referralCode || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Membership Tier */}
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${tier.color}`}>
                          {tier.name}
                        </span>
                      </td>

                      {/* Role & Status */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-navy-950 text-gold-400'
                                : 'bg-sand-100 text-navy-700'
                            }`}
                          >
                            {u.role}
                          </span>
                          <div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                u.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {u.status === 'active' ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Points Balance */}
                      <td className="px-5 py-4">
                        <div className="font-mono">
                          <p className="font-bold text-navy-950 text-sm">
                            {(u.pointsStats?.availablePoints || 0).toLocaleString()} <span className="text-[10px] font-sans text-gold-700 font-bold">PTS</span>
                          </p>
                          <p className="text-[10px] text-navy-400">
                            {t('common.total', 'Total')}: {(u.pointsStats?.totalEarnedPoints || 0).toLocaleString()} PTS
                          </p>
                        </div>
                      </td>

                      {/* Sponsor */}
                      <td className="px-5 py-4 text-[11px] text-navy-600">
                        {u.referredBy ? (
                          <div>
                            <p className="font-bold text-navy-950">{u.referredBy.fullname}</p>
                            <p className="text-[10px] text-navy-400 font-mono">
                              {u.referredBy.referralCode || u.referredBy.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-navy-400 italic">{t('common.directSponsor', 'Directo (Sin sponsor)')}</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="px-5 py-4 text-navy-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-navy-700 hover:text-gold-700 hover:bg-gold-50 rounded-lg transition-colors cursor-pointer"
                            title={t('users.editUserTitle', 'Editar usuario y nivel')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(u._id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={t('common.delete', 'Eliminar usuario')}
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination Bar */}
        <div className="px-5 py-3.5 bg-sand-50 border-t border-sand-200 flex items-center justify-between text-xs text-navy-600">
          <span>
            {t('common.page', 'Página')} <span className="font-bold text-navy-950">{pagination.page}</span> {t('common.of', 'de')}{' '}
            <span className="font-bold text-navy-950">{pagination.totalPages || 1}</span> ({pagination.total} {t('common.users', 'usuarios')})
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal using Portal Modal */}
      <Modal
        isOpen={!!editUserModal}
        onClose={() => setEditUserModal(null)}
        title={t('users.editUserTitle', 'Modificar Usuario')}
        subtitle={editUserModal ? `${editUserModal.fullname} (${editUserModal.email})` : ''}
        icon={Shield}
        maxWidth="max-w-md"
      >
        {editUserModal && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('users.fullname', 'Nombre Completo')}
              </label>
              <input
                type="text"
                disabled
                value={editUserModal.fullname}
                className="w-full px-4 py-2.5 text-xs bg-sand-100 border border-sand-200 rounded-xl text-navy-700 outline-none cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <CustomSelect
                label={t('users.tierLevel', 'Nivel de Membresía')}
                required
                value={editUserModal.membershipId}
                onChange={(e) => setEditUserModal({ ...editUserModal, membershipId: e.target.value })}
                options={[
                  { value: 'member', label: isEn ? 'Member (0 levels)' : 'Miembro (0 niveles)' },
                  { value: 'active_member', label: isEn ? 'Active Member (100% Level 1)' : 'Miembro Activo (100% Nivel 1)' },
                  { value: 'ambassador', label: isEn ? 'Ambassador (100% L1 + 50% L2)' : 'Embajador (100% N1 + 50% N2)' },
                  { value: 'elite_ambassador', label: isEn ? 'Elite Ambassador (100% L1 + 50% L2)' : 'Embajador Élite (100% N1 + 50% N2)' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <CustomSelect
                  label={t('users.systemRole', 'Rol del Sistema')}
                  value={editUserModal.role}
                  onChange={(e) => setEditUserModal({ ...editUserModal, role: e.target.value })}
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-800 mb-1">
                {t('users.availablePoints', 'Balance de Puntos Disponibles (PTS)')}
              </label>
              <input
                type="number"
                min="0"
                value={editUserModal.availablePoints}
                onChange={(e) => setEditUserModal({ ...editUserModal, availablePoints: e.target.value })}
                className="w-full px-4 py-2.5 text-xs bg-white border border-sand-300 rounded-xl focus:border-gold-500 outline-none font-mono font-bold text-navy-950 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="emailVerifiedCheck"
                checked={editUserModal.isEmailVerified}
                onChange={(e) => setEditUserModal({ ...editUserModal, isEmailVerified: e.target.checked })}
                className="w-4 h-4 rounded text-gold-500 cursor-pointer"
              />
              <label htmlFor="emailVerifiedCheck" className="text-xs font-semibold text-navy-900 cursor-pointer">
                {t('users.emailVerified', 'Correo electrónico verificado')}
              </label>
            </div>

            <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditUserModal(null)}
                className="px-4 py-2 text-xs font-bold text-navy-700 bg-sand-100 hover:bg-sand-200 rounded-xl cursor-pointer"
              >
                {t('common.cancel', 'Cancelar')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-navy-950 rounded-xl shadow-md disabled:opacity-50 cursor-pointer transition-all"
              >
                {submitting ? t('common.loading', 'Guardando...') : t('common.save', 'Actualizar Usuario')}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete User Confirmation using Portal Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title={t('users.deleteConfirmTitle', '¿Eliminar Usuario?')}
        icon={AlertTriangle}
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-navy-600">
            {t('users.deleteConfirmDesc', 'Esta acción eliminará de forma irreversible al usuario del sistema y sus accesos.')}
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
              onClick={() => handleDeleteUser(deleteConfirmId)}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
            >
              {t('offers.yesDelete', 'Sí, Eliminar')}
            </button>
          </div>
        </div>
      </Modal>
    </AdminShell>
  );
}
