'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Award, Compass, Crown, Lock, Mail, Sparkles, Waves } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoAccount } = useAuth();
  const { t, copy, locale } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const av = copy.authViews || {};
  const isEn = locale === 'en';

  const demoAccounts = [
    { id: 'member', label: copy.levels?.member?.name || 'Miembro', icon: Compass, color: 'text-navy-900 border-sand-300 hover:border-navy-400 bg-white' },
    { id: 'active_member', label: copy.levels?.active_member?.name || 'Miembro Activo', icon: Waves, color: 'text-ocean-700 border-ocean-200 hover:border-ocean-500 bg-ocean-50/50' },
    { id: 'ambassador', label: copy.levels?.ambassador?.name || 'Embajador', icon: Award, color: 'text-gold-800 border-gold-300 hover:border-gold-500 bg-gold-50/50' },
    { id: 'elite_ambassador', label: copy.levels?.elite_ambassador?.name || 'Embajador Élite', icon: Crown, color: 'text-white border-gold-400/40 bg-navy-900 hover:bg-navy-950' },
  ];

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!email.trim()) {
      err.email = isEn ? 'Email or username is required.' : 'El correo o nombre de usuario es requerido.';
    }
    if (!password) {
      err.password = isEn ? 'Password is required.' : 'La contraseña es requerida.';
    } else if (password.length < 6) {
      err.password = isEn ? 'Password must be at least 6 characters.' : 'La contraseña debe tener al menos 6 caracteres.';
    }
    setErrors(err);

    if (Object.keys(err).length) {
      toast(err.email || err.password, 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, remember);
      toast(isEn ? 'Logged in successfully!' : '¡Inicio de sesión exitoso!');
      router.push('/dashboard');
    } catch (apiErr) {
      const msg = apiErr.message || (isEn ? 'Invalid email/username or password.' : 'Correo o contraseña incorrectos.');
      setErrors({ email: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const enterDemo = (key) => {
    switchDemoAccount(key);
    toast(isEn ? `Switched to ${copy.levels?.[key]?.name || key} view` : `Cambiado a vista de ${copy.levels?.[key]?.name || key}`);
    router.push('/dashboard');
  };

  return (
    <AuthShell
      title={av.loginTitle || 'Iniciar sesión'}
      subtitle={av.loginSubtitle || 'Accede a tu panel y gestiona tus puntos y referidos.'}
      footer={
        <>
          {(av.noAccount || '¿Aún no tienes cuenta?')}{' '}
          <Link href="/register" className="font-bold text-ocean-700 hover:underline">
            {av.registerFree || 'Regístrate gratis'}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input
          id="email"
          label={av.emailLabel || 'Correo electrónico'}
          type="email"
          autoComplete="email"
          placeholder="yourname@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail size={16} />}
          required
        />
        <Input
          id="password"
          label={av.passwordLabel || 'Contraseña'}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock size={16} />}
          required
        />
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <Checkbox label={av.rememberMe || 'Recordarme'} checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <Link href="/forgot-password" className="font-medium text-ocean-700 hover:underline">
            {av.forgotPassword || '¿Olvidaste tu contraseña?'}
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full rounded-2xl py-3.5 shadow-md" isLoading={loading}>
          {loading ? (av.loggingIn || 'Iniciando sesión...') : (av.loginBtn || 'Iniciar sesión')}
        </Button>
      </form>

      {/* VIP Demo Fast Access */}
      <div className="mt-8 rounded-3xl border border-sand-200/90 bg-sand-50/80 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold-600" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-navy-900">{av.vipDemoTitle || 'Acceso Rápido VIP Demo'}</p>
          </div>
          <span className="rounded-full bg-sand-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{av.oneClick || '1 Clic'}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{av.vipDemoDesc || 'Prueba la experiencia explorando cualquiera de los 4 niveles de membresía:'}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {demoAccounts.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              type="button"
              onClick={() => enterDemo(id)}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs ${color}`}
            >
              <Icon size={14} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
