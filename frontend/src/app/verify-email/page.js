'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, RefreshCw } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import OtpInput from '@/components/ui/OtpInput';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/apiClient';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyOtpAndRegister } = useAuth();
  const { copy, locale } = useLanguage();
  const { toast } = useToast();
  const av = copy.authViews || {};
  const isEn = locale === 'en';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = isEn ? 'Valid email is required.' : 'El correo electrónico es requerido.';
    if (!otp || otp.trim().length !== 4) err.otp = isEn ? '4-digit OTP code is required.' : 'El código OTP de 4 dígitos es requerido.';
    setErrors(err);

    if (Object.keys(err).length) {
      const first = Object.values(err)[0];
      toast(first, 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyOtpAndRegister({ email: email.trim(), otp: otp.trim() });
      toast(isEn ? 'Account verified successfully! Welcome.' : '¡Cuenta verificada con éxito! Bienvenido.');
      router.push('/dashboard');
    } catch (apiErr) {
      const msg = apiErr.message || (isEn ? 'Invalid or expired OTP code.' : 'Código OTP inválido o expirado.');
      setErrors({ otp: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      const msg = isEn ? 'Please enter your email to resend OTP.' : 'Por favor ingresa tu correo para reenviar el código.';
      setErrors({ email: msg });
      toast(msg, 'error');
      return;
    }
    if (countdown > 0) return;

    setResending(true);
    try {
      await authApi.resendRegisterOtp(email.trim());
      setCountdown(60);
      toast(isEn ? 'New verification code sent!' : '¡Nuevo código de verificación enviado!');
    } catch (apiErr) {
      toast(apiErr.message || (isEn ? 'Error resending code.' : 'Error al reenviar código.'), 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title={av.verifyTitle || 'Verifica tu correo con OTP'}
      subtitle={av.verifySubtitle || 'Ingresa el código de 4 dígitos para activar tu cuenta VIP.'}
      footer={
        <Link href="/login" className="font-bold text-ocean-700 hover:underline">
          {av.backToLogin || 'Volver a iniciar sesión'}
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
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
            length={4}
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

        <Button type="submit" size="lg" className="w-full rounded-2xl py-3.5 shadow-md" isLoading={loading}>
          {loading ? (av.verifying || 'Verificando código...') : (av.verifyOtpBtn || 'Verificar código y continuar')}
        </Button>

        <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
          <span>{av.didntReceive || '¿No recibiste el código?'}</span>
          <button
            type="button"
            onClick={resendCode}
            disabled={countdown > 0 || resending}
            className="font-bold text-ocean-700 hover:underline disabled:text-slate-400 flex items-center gap-1"
          >
            <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
            {countdown > 0
              ? (isEn ? `Resend in ${countdown}s` : `Reenviar en ${countdown}s`)
              : (av.resendEmail || 'Reenviar código OTP')}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
