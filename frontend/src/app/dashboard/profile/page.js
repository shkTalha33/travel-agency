'use client';

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  Share2, 
  Sparkles, 
  Bell, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import ImageUpload from '@/components/ui/ImageUpload';
import InviteButton from '@/components/referral/InviteButton';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { userApi } from '@/lib/apiClient';

export default function ProfilePage() {
  const { currentUser: u, currentMembership: m, refreshUser } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();

  const pv = copy.profileView || {};
  const membershipName = copy.levels?.[m?.id]?.name || m?.name || (isEn ? 'Member' : 'Miembro');

  const [avatarUrl, setAvatarUrl] = useState(u?.avatar || '');
  const [formData, setFormData] = useState({
    name: u?.name || '',
    email: u?.email || '',
    phone: u?.phone || '',
    city: u?.city || '',
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState('whatsapp');
  const [notify, setNotify] = useState(true);

  // Password state
  const [pw, setPw] = useState({ cur: '', next: '', conf: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const formattedJoinedDate = u?.joinedDate || (u?.createdAt ? new Date(u.createdAt).toLocaleDateString(isEn ? 'en-US' : 'es-ES', { month: 'short', year: 'numeric' }) : '');

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (avatarUrl && avatarUrl !== u.avatar) {
        await userApi.updateAvatar(avatarUrl);
      }
      await userApi.updateProfile(formData);
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
      toast(pv.savedToast || (isEn ? 'Profile updated successfully.' : 'Perfil actualizado correctamente.'));
    } catch (err) {
      toast(err?.message || (isEn ? 'Error saving changes' : 'Error al guardar los cambios'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyRefLink = async () => {
    try {
      await navigator.clipboard.writeText(u?.referralLink || '');
      setCopied(true);
      toast(pv.copySuccessToast || (isEn ? 'Referral link copied.' : 'Enlace de referido copiado.'));
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      toast(pv.copyFailToast || (isEn ? 'Could not copy the link. Please try again.' : 'No pudimos copiar el enlace. Intenta nuevamente.'), 'error');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.cur || !pw.cur.trim()) {
      err.cur = pv.errCurPw || (isEn ? 'Please enter your current password.' : 'Ingresa tu contraseña actual.');
    }
    if (!pw.next || pw.next.length < 6) {
      err.next = pv.errNextPw || (isEn ? 'Use at least 6 characters.' : 'Usa al menos 6 caracteres.');
    }
    if (pw.conf !== pw.next) {
      err.conf = pv.errMatchPw || (isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.');
    }
    setPwErrors(err);

    if (Object.keys(err).length) {
      const firstErr = Object.values(err)[0];
      toast(firstErr, 'error');
      return;
    }

    setSavingPw(true);
    try {
      await userApi.changePassword(pw.cur, pw.next);
      setPw({ cur: '', next: '', conf: '' });
      setPwErrors({});
      toast(isEn ? 'Password changed successfully.' : 'Contraseña actualizada correctamente.');
    } catch (apiErr) {
      const msg = apiErr?.data?.message || apiErr?.message || (isEn ? 'Current password is incorrect.' : 'La contraseña actual es incorrecta.');
      setPwErrors({ cur: msg });
      toast(msg, 'error');
    } finally {
      setSavingPw(false);
    }
  };

  if (!u) return null;

  return (
    <div className="w-full space-y-5">
      {/* Top Hero Member Card (Single Solid Color, No Border/Shadow) */}
      <div className="rounded-2xl bg-navy-950 p-5 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-fit shrink-0">
              <Avatar
                src={avatarUrl || u.avatar}
                name={u.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full ring-2 ring-ocean-500/50 object-cover"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-navy-950"></span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {u.name || (isEn ? 'Member' : 'Miembro')}
                </h1>
                <Badge variant={m?.id || 'active'}>{membershipName}</Badge>
              </div>

              <p className="text-xs sm:text-sm text-sand-300 flex items-center gap-2">
                <Mail size={13} className="text-ocean-400 shrink-0" />
                <span>{u.email}</span>
                {formattedJoinedDate && (
                  <>
                    <span className="text-sand-500">·</span>
                    <span className="text-sand-400 text-xs">
                      {(pv.memberSince || (isEn ? 'Member since' : 'Miembro desde'))} {formattedJoinedDate}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Referral Tag Box */}
          <div className="shrink-0 rounded-2xl bg-navy-900 p-4 flex items-center justify-between sm:justify-start gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-sand-400">
                {isEn ? 'REFERRAL CODE' : 'CÓDIGO DE REFERIDO'}
              </p>
              <p className="font-mono text-base font-bold text-gold-300 mt-0.5">
                {u.referralCode || 'N/A'}
              </p>
            </div>
            <button
              type="button"
              onClick={copyRefLink}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-white transition-all cursor-pointer border-0 outline-none focus:outline-none focus:ring-0 active:outline-none"
              title={isEn ? 'Copy Referral Code' : 'Copiar Código'}
            >
              {copied ? <Check size={16} className="text-ocean-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left 2 Columns: Personal Profile & Security */}
        <div className="space-y-5 lg:col-span-2">
          {/* Section 1: Personal Details */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-5">
            <div className="border-b border-sand-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-950 flex items-center gap-2">
                  <User className="w-5 h-5 text-ocean-600" />
                  <span>{isEn ? 'Personal Information' : 'Información Personal'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isEn
                    ? 'Update your photo and personal profile details'
                    : 'Actualiza tu foto y los datos personales de tu cuenta'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAccount} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <ImageUpload
                  label={pv.avatarLabel || (isEn ? 'Profile Picture' : 'Foto de Perfil')}
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  folder="avatars"
                  helperText={pv.avatarHelper || (isEn ? 'Click or drag to update your profile photo' : 'Haz clic o arrastra para actualizar tu foto de perfil')}
                />
              </div>

              <Input
                id="perfil-nombre"
                label={pv.fullName || (isEn ? 'Full name' : 'Nombre completo')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
              />

              <Input
                id="perfil-correo"
                label={pv.email || (isEn ? 'Email address' : 'Correo electrónico')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@ejemplo.com"
              />

              <Input
                id="perfil-telefono"
                label={pv.phone || (isEn ? 'Phone number' : 'Teléfono')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (809) 000-0000"
              />

              <Input
                id="perfil-ciudad"
                label={pv.city || (isEn ? 'City' : 'Ciudad')}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Santo Domingo"
              />

              <div className="sm:col-span-2 pt-2 flex items-center justify-end">
                <Button type="submit" disabled={saving} size="md" className="rounded-xl px-6 font-bold">
                  {saving ? (isEn ? 'Saving Changes...' : 'Guardando Cambios...') : (pv.saveChanges || (isEn ? 'Save Profile Changes' : 'Guardar Cambios'))}
                </Button>
              </div>
            </form>
          </div>

          {/* Section 2: Security & Password Management */}
          <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-5">
            <div className="border-b border-sand-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-ocean-600" />
                  <span>{isEn ? 'Security & Password' : 'Seguridad y Contraseña'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isEn
                    ? 'Keep your account protected with a strong, updated password'
                    : 'Protege tu cuenta con una contraseña segura y actualizada'}
                </p>
              </div>
            </div>

            <form onSubmit={savePassword} className="space-y-4 max-w-xl" noValidate>
              <Input
                id="pw-actual"
                label={pv.currentPw || (isEn ? 'Current password' : 'Contraseña actual')}
                type="password"
                value={pw.cur}
                onChange={(e) => {
                  setPw({ ...pw, cur: e.target.value });
                  if (pwErrors.cur) setPwErrors((prev) => ({ ...prev, cur: '' }));
                }}
                error={pwErrors.cur}
                placeholder="••••••••"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id="pw-nueva"
                  label={pv.newPw || (isEn ? 'New password' : 'Nueva contraseña')}
                  type="password"
                  value={pw.next}
                  onChange={(e) => {
                    setPw({ ...pw, next: e.target.value });
                    if (pwErrors.next) setPwErrors((prev) => ({ ...prev, next: '' }));
                  }}
                  error={pwErrors.next}
                  helperText={pv.min8Chars || (isEn ? 'Minimum 6 characters.' : 'Mínimo 6 caracteres.')}
                  placeholder="••••••••"
                />

                <Input
                  id="pw-confirmar"
                  label={pv.confirmPw || (isEn ? 'Confirm password' : 'Confirmar contraseña')}
                  type="password"
                  value={pw.conf}
                  onChange={(e) => {
                    setPw({ ...pw, conf: e.target.value });
                    if (pwErrors.conf) setPwErrors((prev) => ({ ...prev, conf: '' }));
                  }}
                  error={pwErrors.conf}
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <Button 
                  type="submit" 
                  disabled={savingPw} 
                  variant="primary"
                  className="rounded-xl px-6 font-bold"
                >
                  <KeyRound className="w-4 h-4 mr-1.5 text-gold-300" />
                  <span>{savingPw ? (isEn ? 'Updating Password...' : 'Actualizando Contraseña...') : (isEn ? 'Update Password' : 'Actualizar Contraseña')}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Referral Hub & Communication Preferences */}
        <div className="space-y-5">
          {/* Section 3: Referral Program */}
          <div className="rounded-2xl bg-white p-5 space-y-4">
            <div className="border-b border-sand-100 pb-2.5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-ocean-600" />
                <span>{isEn ? 'Referral Program' : 'Red de Referidos'}</span>
              </h2>
              <Badge variant="ocean" size="sm">{m?.referralLevelsAllowed > 0 ? (isEn ? 'Active' : 'Activo') : (isEn ? 'Standard' : 'Estándar')}</Badge>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {pv.referralCode || (isEn ? 'Your Unique Code' : 'Tu Código')}
              </p>
              <div className="p-3 rounded-2xl bg-sand-50 flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-navy-950 tracking-wider">
                  {u.referralCode || 'N/A'}
                </span>
                <button
                  type="button"
                  onClick={copyRefLink}
                  className="text-xs font-bold text-ocean-600 hover:text-ocean-800 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-ocean-600" /> : <Copy size={14} />}
                  <span>{copied ? (pv.copied || 'Copiado') : (pv.copy || 'Copiar')}</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="enlace" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {pv.referralLink || (isEn ? 'Shareable Referral Link' : 'Enlace de Referido')}
              </label>
              <div className="flex gap-2">
                <input
                  id="enlace"
                  readOnly
                  value={u.referralLink || ''}
                  className="min-w-0 flex-1 rounded-xl bg-sand-50 px-3 py-2 text-xs font-medium text-slate-700 select-all border-0"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={copyRefLink}
                  className="rounded-xl px-3 shrink-0"
                >
                  {copied ? <Check size={14} className="text-ocean-600" /> : <Copy size={14} />}
                </Button>
              </div>
            </div>

            <div className="pt-1">
              <InviteButton link={u.referralLink} variant="primary" size="md" className="w-full rounded-xl" />
            </div>

            <p className="text-xs leading-relaxed text-slate-500 pt-2 border-t border-sand-100">
              {m.referralLevelsAllowed === 0
                ? (pv.notActiveHint || (isEn ? 'Referral commissions & point earnings are enabled with the Active Member tier.' : 'Los beneficios de referidos se habilitan con la membresía de Miembro Activo.'))
                : (typeof pv.allowedLevelsDesc === 'function' 
                    ? pv.allowedLevelsDesc(m.referralLevelsAllowed) 
                    : (isEn 
                        ? `Your membership allows you to receive points from ${m.referralLevelsAllowed} referral levels.` 
                        : `Tu membresía te permite recibir puntos de ${m.referralLevelsAllowed} niveles de tu red.`))}
            </p>
          </div>

          {/* Section 4: Preferences & Communications */}
          <div className="rounded-2xl bg-white p-5 space-y-4">
            <div className="border-b border-sand-100 pb-2.5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-navy-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-ocean-600" />
                <span>{isEn ? 'Notification Preferences' : 'Preferencias de Contacto'}</span>
              </h2>
            </div>

            <RadioGroup
              legend={pv.contactLegend || (isEn ? 'How do you prefer us to contact you?' : '¿Cómo prefieres que te contactemos?')}
              name="contacto"
              value={contact}
              onChange={setContact}
              options={[
                { value: 'whatsapp', label: pv.contactWhatsapp || 'WhatsApp' },
                { value: 'correo', label: pv.contactEmail || (isEn ? 'Email' : 'Correo electrónico') },
                { value: 'telefono', label: pv.contactPhone || (isEn ? 'Phone Call' : 'Llamada telefónica') },
              ]}
            />

            <div className="pt-2 border-t border-sand-100">
              <Checkbox
                label={pv.promoCheckbox || (isEn ? 'I want to receive alerts about new resort deals and member rewards' : 'Quiero recibir avisos sobre nuevas ofertas y recompensas')}
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
