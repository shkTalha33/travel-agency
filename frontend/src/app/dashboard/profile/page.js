'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import ImageUpload from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const { currentUser: u, currentMembership: m } = useAuth();
  const { t, copy, isEn } = useLanguage();
  const { toast } = useToast();

  const pv = copy.profileView || {};
  const membershipName = copy.levels[m?.id]?.name || m?.name;

  const [tab, setTab] = useState('cuenta');
  const [avatarUrl, setAvatarUrl] = useState(u.avatar || '');
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState('whatsapp');
  const [notify, setNotify] = useState(true);
  const [pw, setPw] = useState({ cur: '', next: '', conf: '' });
  const [pwErrors, setPwErrors] = useState({});

  const copyRefLink = async () => {
    try {
      await navigator.clipboard.writeText(u.referralLink);
      setCopied(true);
      toast(pv.copySuccessToast || 'Enlace de referido copiado.');
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      toast(pv.copyFailToast || 'No pudimos copiar el enlace. Intenta nuevamente.', 'error');
    }
  };

  const savePassword = (e) => {
    e.preventDefault();
    const err = {};
    if (!pw.cur) err.cur = pv.errCurPw || 'Ingresa tu contraseña actual.';
    if (pw.next.length < 8) err.next = pv.errNextPw || 'Usa al menos 8 caracteres.';
    if (pw.conf !== pw.next) err.conf = pv.errMatchPw || 'Las contraseñas no coinciden.';
    setPwErrors(err);
    if (Object.keys(err).length) {
      const firstErr = Object.values(err)[0];
      toast(firstErr, 'error');
      return;
    }
    setPw({ cur: '', next: '', conf: '' });
    toast(pv.savedToast || 'Cambios guardados.');
  };

  const profileTabs = [
    { id: 'cuenta', label: pv.tabAccount || 'Cuenta' },
    { id: 'referidos', label: pv.tabReferrals || 'Referidos' },
    { id: 'seguridad', label: pv.tabSecurity || 'Seguridad' },
    { id: 'ajustes', label: pv.tabSettings || 'Configuración' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Avatar src={u.avatar} name={u.name} size="lg" />
        <div>
          <h1 className="text-3xl font-bold text-navy-900">{pv.title || 'Mi perfil'}</h1>
          <p className="text-sm text-slate-600">{u.email} · <Badge variant={m.id}>{membershipName}</Badge></p>
        </div>
      </div>

      <Tabs label={pv.tabsAria || 'Secciones del perfil'} tabs={profileTabs} activeTab={tab} onChange={setTab} className="w-fit max-w-full" />

      {tab === 'cuenta' && (
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); toast(pv.savedToast || 'Cambios guardados.'); }} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload
                label={pv.avatarLabel || 'Foto de Perfil'}
                value={avatarUrl}
                onChange={setAvatarUrl}
                folder="avatars"
                helperText={isEn ? 'Upload directly to Firebase Storage or paste a URL' : 'Sube tu foto a Firebase Storage o pega una URL'}
              />
            </div>
            <Input id="perfil-nombre" label={pv.fullName || 'Nombre completo'} defaultValue={u.name} />
            <Input id="perfil-correo" label={pv.email || 'Correo electrónico'} type="email" defaultValue={u.email} />
            <Input id="perfil-telefono" label={pv.phone || 'Teléfono'} defaultValue={u.phone} placeholder="+1 (809) 000-0000" />
            <Input id="perfil-ciudad" label={pv.city || 'Ciudad'} defaultValue={u.city} placeholder="Santo Domingo" />
            <p className="text-xs text-slate-500 sm:col-span-2">{(pv.memberSince || 'Miembro desde')} {u.joinedDate}.</p>
            <div className="sm:col-span-2"><Button type="submit">{pv.saveChanges || 'Guardar cambios'}</Button></div>
          </form>
        </Card>
      )}

      {tab === 'referidos' && (
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-medium capitalize tracking-wide text-slate-500">{pv.referralCode || 'Código de referido'}</p>
            <p className="text-xl font-bold text-navy-900">{u.referralCode}</p>
          </div>
          <div>
            <label htmlFor="enlace" className="mb-1 block text-xs font-medium capitalize tracking-wide text-slate-500">{pv.referralLink || 'Enlace de referido'}</label>
            <div className="flex gap-2">
              <input id="enlace" readOnly value={u.referralLink} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800" />
              <Button variant="secondary" onClick={copyRefLink} icon={copied ? <Check size={16} /> : <Copy size={16} />}>
                {copied ? (pv.copied || 'Copiado') : (pv.copy || 'Copiar')}
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            {m.referralLevelsAllowed === 0
              ? (pv.notActiveHint || 'Los beneficios de referidos se habilitan con la membresía de Miembro Activo.')
              : (typeof pv.allowedLevelsDesc === 'function' ? pv.allowedLevelsDesc(m.referralLevelsAllowed) : `Tu membresía te permite recibir puntos de ${m.referralLevelsAllowed} niveles de tu red.`)}
          </p>
        </Card>
      )}

      {tab === 'seguridad' && (
        <Card>
          <form onSubmit={savePassword} className="max-w-sm space-y-4" noValidate>
            <Input id="pw-actual" label={pv.currentPw || 'Contraseña actual'} type="password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} error={pwErrors.cur} />
            <Input id="pw-nueva" label={pv.newPw || 'Nueva contraseña'} type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pwErrors.next} helperText={pv.min8Chars || 'Mínimo 8 caracteres.'} />
            <Input id="pw-confirmar" label={pv.confirmPw || 'Confirmar contraseña'} type="password" value={pw.conf} onChange={(e) => setPw({ ...pw, conf: e.target.value })} error={pwErrors.conf} />
            <Button type="submit">{pv.saveChanges || 'Guardar cambios'}</Button>
          </form>
        </Card>
      )}

      {tab === 'ajustes' && (
        <Card className="max-w-md space-y-5">
          <RadioGroup
            legend={pv.contactLegend || '¿Cómo prefieres que te contactemos?'}
            name="contacto"
            value={contact}
            onChange={setContact}
            options={[
              { value: 'whatsapp', label: pv.contactWhatsapp || 'WhatsApp' },
              { value: 'correo', label: pv.contactEmail || 'Correo electrónico' },
              { value: 'telefono', label: pv.contactPhone || 'Llamada telefónica' },
            ]}
          />
          <Checkbox label={pv.promoCheckbox || 'Quiero recibir avisos sobre nuevas ofertas'} checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          <Button onClick={() => toast(pv.savedToast || 'Cambios guardados.')}>{pv.saveChanges || 'Guardar cambios'}</Button>
        </Card>
      )}
    </div>
  );
}
