'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, Mail } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import OtpInput from '@/components/ui/OtpInput';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { authApi } from '@/lib/apiClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { copy, locale } = useLanguage();
  const { toast } = useToast();
  const av = copy.authViews || {};
  const isEn = locale === 'en';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = isEn ? 'Valid email is required.' : 'El correo electrónico es requerido.';
    if (!otp || otp.trim().length !== 6) err.otp = isEn ? '6-digit OTP code is required.' : 'El código OTP de 6 dígitos es requerido.';
    if (pw.length < 8) err.pw = isEn ? 'Password must be at least 8 characters.' : 'La contraseña debe tener al menos 8 caracteres.';
    if (confirm !== pw) err.confirm = isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.';
    setErrors(err);

    if (Object.keys(err).length) {
      const firstErr = Object.values(err)[0];
      toast(firstErr, 'error');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email: email.trim(), otp: otp.trim(), newPassword: pw });
      setDone(true);
      toast(isEn ? 'Password reset successfully!' : '¡Contraseña restablecida con éxito!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (apiErr) {
      const msg = apiErr.message || (isEn ? 'Invalid or expired OTP code.' : 'Código OTP inválido o expirado.');
      setErrors({ otp: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={av.resetTitle || 'Nueva contraseña'}
      subtitle={av.resetWithOtpSubtitle || 'Ingresa el código OTP de tu correo y tu nueva contraseña.'}
      footer={
        <Link href="/login" className="font-semibold text-ocean-600 hover:underline">
          {av.backToLogin || 'Volver a iniciar sesión'}
        </Link>
      }
    >
      {done ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
          <div>
            <p className="font-semibold text-emerald-800">{isEn ? 'Password reset successfully!' : '¡Contraseña restablecida con éxito!'}</p>
            <p className="mt-1 text-xs text-emerald-700">
              {isEn ? 'You can now log in with your new password.' : 'Ya puedes iniciar sesión con tu nueva contraseña.'}
            </p>
          </div>
          <Link href="/login" className="block">
            <Button className="w-full">{av.loginBtn || 'Iniciar sesión'}</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input
            id="email"
            label={av.emailLabel || 'Correo electrónico'}
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            icon={<Mail size={16} />}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold capitalize text-navy-900 text-center">
              {isEn ? 'Verification Code' : 'Código de Verificación'}
            </label>
            <OtpInput
              length={6}
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (errors.otp) setErrors({ ...errors, otp: '' });
              }}
              error={!!errors.otp}
              autoFocus
            />
            {errors.otp && (
              <p role="alert" className="text-center text-xs font-semibold text-rose-600 mt-2">
                {errors.otp}
              </p>
            )}
          </div>

          <Input
            id="pw"
            label={av.resetTitle || 'Nueva contraseña'}
            type="password"
            placeholder="Min. 8 chars"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            error={errors.pw}
            icon={<Lock size={16} />}
            required
          />

          <Input
            id="confirm"
            label={av.confirmPasswordLabel || 'Confirmar contraseña'}
            type="password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            icon={<Lock size={16} />}
            required
          />

          <Button type="submit" size="md" className="w-full rounded-xl py-2.5 font-bold shadow-soft" isLoading={loading}>
            {loading ? (av.loggingIn || 'Restableciendo...') : (av.resetBtn || 'Restablecer contraseña')}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
