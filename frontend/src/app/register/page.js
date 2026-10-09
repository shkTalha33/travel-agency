'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Lock, Mail, RefreshCw, Sparkles, Ticket, User } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/apiClient';

import OtpInput from '@/components/ui/OtpInput';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, verifyOtpAndRegister } = useAuth();
  const { copy, locale } = useLanguage();
  const { toast } = useToast();
  const av = copy.authViews || {};
  const isEn = locale === 'en';

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [f, setF] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirm: '', 
    referralCode: '', 
    terms: false 
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Auto-populate referral code from URL query param (e.g., ?ref=MUHAM-1611)
  useEffect(() => {
    const ref = searchParams?.get('ref') || searchParams?.get('referral') || searchParams?.get('referralCode');
    if (ref && typeof ref === 'string') {
      setF((prev) => ({ ...prev, referralCode: ref.trim() }));
    }
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 3) err.name = isEn ? 'Please enter your full name (at least 3 characters).' : 'Por favor ingresa tu nombre completo (mínimo 3 caracteres).';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = isEn ? 'Please enter a valid email address.' : 'Por favor ingresa un correo electrónico válido.';
    if (f.password.length < 8) err.password = isEn ? 'Password must be at least 8 characters.' : 'La contraseña debe tener al menos 8 caracteres.';
    if (f.confirm !== f.password) err.confirm = isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.';
    if (!f.terms) err.terms = isEn ? 'You must accept the terms and conditions.' : 'Debes aceptar los términos y condiciones.';
    setErrors(err);

    if (Object.keys(err).length) {
      const firstErr = Object.values(err)[0];
      toast(firstErr, 'error');
      return;
    }

    setLoading(true);
    try {
      await register({ name: f.name, email: f.email, password: f.password, referralCode: f.referralCode });
      toast(isEn ? '4-digit verification code sent to your email!' : '¡Código de verificación de 4 dígitos enviado a tu correo!');
      setStep('otp');
      setCountdown(60);
    } catch (apiErr) {
      const msg = apiErr.message || (isEn ? 'Error creating account.' : 'Error al crear la cuenta.');
      setErrors({ email: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 4) {
      const msg = isEn ? 'Please enter the 4-digit OTP code.' : 'Por favor ingresa el código OTP de 4 dígitos.';
      setErrors({ otp: msg });
      toast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyOtpAndRegister({ email: f.email, otp: otp.trim() });
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
    if (countdown > 0) return;
    setResending(true);
    try {
      await authApi.resendRegisterOtp(f.email);
      setCountdown(60);
      toast(isEn ? 'New verification code sent!' : '¡Nuevo código de verificación enviado!');
    } catch (apiErr) {
      toast(apiErr.message || (isEn ? 'Error resending code.' : 'Error al reenviar código.'), 'error');
    } finally {
      setResending(false);
    }
  };

  if (step === 'otp') {
    return (
      <AuthShell
        title={av.verifyTitle || 'Verifica tu correo con OTP'}
        subtitle={typeof av.otpSentTo === 'function' ? av.otpSentTo(f.email) : `Enviamos un código de 4 dígitos a ${f.email}`}
        footer={
          <button
            type="button"
            onClick={() => setStep('form')}
            className="font-bold text-ocean-700 hover:underline"
          >
            {isEn ? '← Change email or edit details' : '← Cambiar correo o editar datos'}
          </button>
        }
      >
        <form onSubmit={submitOtp} className="space-y-4" noValidate>
          <p className="text-xs text-slate-500 text-center max-w-sm mx-auto leading-relaxed">
            {isEn
              ? 'Check your inbox (and spam folder) for the 4-digit code sent from Círculo Wingding.'
              : 'Revisa tu bandeja de entrada (y spam) para encontrar el código de 4 dígitos enviado por Círculo Wingding.'}
          </p>

          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-navy-900 text-center">
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

          <Button type="submit" size="md" className="w-full rounded-xl py-2.5 font-bold shadow-soft" isLoading={loading}>
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

  return (
    <AuthShell
      title={av.regTitle || (isEn ? 'Create Account' : 'Crear cuenta')}
      subtitle={av.regSubtitle || 'Regístrate gratis y desbloquea beneficios exclusivos de viaje.'}
      footer={
        <>
          {(av.haveAccount || '¿Ya tienes una cuenta registrada?')}{' '}
          <Link href="/login" className="font-bold text-ocean-700 hover:underline">
            {av.loginLink || 'Inicia sesión'}
          </Link>
        </>
      }
    >
      <form onSubmit={submitForm} className="space-y-4" noValidate>
        <Input
          id="name"
          label={av.fullNameLabel || 'Nombre completo'}
          autoComplete="name"
          placeholder="Maria Perez"
          value={f.name}
          onChange={set('name')}
          error={errors.name}
          icon={<User size={16} />}
          required
        />
        <Input
          id="email"
          label={av.emailLabel || 'Correo electrónico'}
          type="email"
          autoComplete="email"
          placeholder="yourname@example.com"
          value={f.email}
          onChange={set('email')}
          error={errors.email}
          icon={<Mail size={16} />}
          required
        />
        <Input
          id="password"
          label={av.passwordLabel || 'Contraseña'}
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 chars"
          value={f.password}
          onChange={set('password')}
          error={errors.password}
          icon={<Lock size={16} />}
          required
        />
        <Input
          id="confirm"
          label={av.confirmPasswordLabel || 'Confirmar contraseña'}
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={f.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          icon={<Lock size={16} />}
          required
        />
        <Input
          id="referral"
          label={av.referralCodeLabel || (isEn ? 'Referral code (optional)' : 'Código de referido (opcional)')}
          placeholder="SOFIA-VIAJES"
          value={f.referralCode}
          onChange={set('referralCode')}
          icon={<Ticket size={16} />}
          helperText={av.referralCodeHint || (isEn ? 'If a friend invited you, enter their code to join their network.' : 'Si un amigo te invitó, ingresa su código para vincularte a su red.')}
        />
        <Checkbox
          id="terms"
          checked={f.terms}
          onChange={set('terms')}
          error={errors.terms}
          label={
            <>
              {av.termsAgree || 'Acepto los términos y condiciones y la política de privacidad.'}
            </>
          }
        />
        <Button type="submit" size="md" className="w-full rounded-xl py-2.5 font-bold shadow-soft" isLoading={loading}>
          {loading ? (av.creatingAccount || 'Enviando código...') : (av.registerBtn || 'Crear mi cuenta gratis')}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

