'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { copy, locale } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const av = copy.authViews || {};
  const isEn = locale === 'en';

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

  return (
    <AuthShell
      title={isEn ? 'Welcome Back' : (av.loginTitle || 'Bienvenido de nuevo')}
      subtitle={isEn ? 'Enter your email and password to access your account' : (av.loginSubtitle || 'Ingresa tus credenciales para acceder a tu panel.')}
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
          label={av.emailLabel || (isEn ? 'Email Address' : 'Correo electrónico')}
          type="email"
          autoComplete="email"
          placeholder={isEn ? 'yourname@example.com' : 'tuemail@ejemplo.com'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail size={16} />}
          required
        />
        <Input
          id="password"
          label={av.passwordLabel || (isEn ? 'Password' : 'Contraseña')}
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
          <Checkbox 
            label={av.rememberMe || (isEn ? 'Remember me' : 'Recordarme')} 
            checked={remember} 
            onChange={(e) => setRemember(e.target.checked)} 
          />
          <Link href="/forgot-password" className="font-medium text-ocean-700 hover:underline">
            {av.forgotPassword || (isEn ? 'Forgot password?' : '¿Olvidaste tu contraseña?')}
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full rounded-2xl py-3.5 shadow-md" isLoading={loading}>
          {loading ? (av.loggingIn || (isEn ? 'Signing in...' : 'Iniciando sesión...')) : (av.loginBtn || (isEn ? 'Sign in' : 'Iniciar sesión'))}
        </Button>
      </form>
    </AuthShell>
  );
}
