'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle2, Mail, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
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

  const [step, setStep] = useState(1); // 1 = Enter OTP, 2 = Enter New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [done, setDone] = useState(false);

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

  const handleStep1Continue = (e) => {
    if (e) e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      err.email = copy.validation?.emailRequired || (isEn ? 'Valid email is required.' : 'Se requiere un correo válido.');
    }
    if (!otp || otp.trim().length !== 4) {
      err.otp = copy.validation?.otpRequired || (isEn ? 'Enter the complete 4-digit code.' : 'Ingresa el código completo de 4 dígitos.');
    }
    setErrors(err);

    if (Object.keys(err).length > 0) {
      toast(Object.values(err)[0], 'error');
      return;
    }

    setStep(2);
  };

  const resendOtp = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast(isEn ? 'Please enter a valid email address.' : 'Por favor ingresa un correo válido.', 'error');
      return;
    }
    if (countdown > 0 || resending) return;

    setResending(true);
    try {
      await authApi.forgotPassword(email.trim());
      setCountdown(60);
      toast(isEn ? 'New 4-digit code sent to your email!' : '¡Nuevo código de 4 dígitos enviado a tu correo!');
    } catch (err) {
      toast(err.message || (isEn ? 'Error resending code.' : 'Error al reenviar código.'), 'error');
    } finally {
      setResending(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = copy.validation?.emailRequired || (isEn ? 'Valid email is required.' : 'Se requiere un correo válido.');
    if (!otp || otp.trim().length !== 4) err.otp = copy.validation?.otpRequired || (isEn ? '4-digit OTP code is required.' : 'Código OTP de 4 dígitos requerido.');
    if (!pw || pw.length < 8) err.pw = copy.validation?.passwordMinLength || (isEn ? 'Password must be at least 8 characters.' : 'La contraseña debe tener al menos 8 caracteres.');
    if (confirm !== pw) err.confirm = copy.validation?.passwordsMatch || (isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.');
    setErrors(err);

    if (Object.keys(err).length) {
      toast(Object.values(err)[0], 'error');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email: email.trim(), otp: otp.trim(), newPassword: pw });
      setDone(true);
      toast(copy.toasts?.passwordReset || (isEn ? 'Password reset successfully!' : '¡Contraseña restablecida con éxito!'));
      setTimeout(() => router.push('/login'), 2000);
    } catch (apiErr) {
      const msg = apiErr.message || copy.toasts?.invalidOtp || (isEn ? 'Invalid or expired OTP code.' : 'Código OTP inválido o expirado.');
      setErrors({ otp: msg });
      toast(msg, 'error');
      // If code was invalid, return to step 1 so they can re-enter or resend
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={step === 1 ? (av.verifyTitle || (isEn ? 'Verify OTP code' : 'Verifica el código OTP')) : (av.resetTitle || (isEn ? 'New password' : 'Nueva contraseña'))}
      subtitle={
        step === 1
          ? (av.verifySubtitle || (isEn ? 'Enter the 4-digit code sent to your email.' : 'Ingresa el código de 4 dígitos enviado a tu correo.'))
          : (av.resetSubtitle || (isEn ? 'Choose a secure password for your account.' : 'Elige una contraseña segura para tu cuenta.'))
      }
      footer={
        <Link href="/login" className="font-semibold text-ocean-600 hover:underline inline-flex items-center gap-1.5">
          <ArrowLeft size={14} />
          <span>{av.backToLogin || (isEn ? 'Back to login' : 'Volver a iniciar sesión')}</span>
        </Link>
      }
    >
      {done ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
          <div>
            <p className="font-bold text-base text-emerald-800">{copy.toasts?.passwordReset || (isEn ? 'Password updated!' : '¡Contraseña actualizada!')}</p>
            <p className="mt-1 text-xs text-emerald-700">
              {av.resetSentDesc || (isEn ? 'You can now log in with your new password.' : 'Ya puedes iniciar sesión con tu nueva contraseña.')}
            </p>
          </div>
          <Link href="/login" className="block pt-2">
            <Button className="w-full rounded-xl py-3 font-bold">{av.loginBtn || (isEn ? 'Log in now' : 'Iniciar sesión')}</Button>
          </Link>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleStep1Continue} className="space-y-5" noValidate>
          {email ? (
            <div className="rounded-2xl bg-sand-50/90 border border-sand-200/80 p-3.5 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-xl bg-ocean-50 text-ocean-700 flex items-center justify-center shrink-0">
                  <Mail size={16} />
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Code sent to' : 'Código enviado a'}
                  </p>
                  <p className="font-semibold text-navy-900 truncate">{email}</p>
                </div>
              </div>
              <Link
                href="/forgot-password"
                className="text-ocean-700 hover:text-ocean-900 font-bold text-xs shrink-0 hover:underline ml-2"
              >
                {isEn ? 'Change' : 'Cambiar'}
              </Link>
            </div>
          ) : (
            <Input
              id="email"
              label={av.emailLabel || (isEn ? 'Email address' : 'Correo electrónico')}
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
          )}

          <div className="space-y-2.5 py-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
              {av.otpLabel || (isEn ? 'OTP Code (4 Digits)' : 'Código OTP (4 Dígitos)')}
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

          <Button
            type="submit"
            size="md"
            className="w-full rounded-xl py-3 font-bold shadow-soft flex items-center justify-center gap-2"
            disabled={otp.length !== 4}
          >
            <span>{isEn ? 'Continue to New Password' : 'Continuar a nueva contraseña'}</span>
            <ArrowRight size={16} />
          </Button>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
            <span>{av.didntReceive || (isEn ? 'Didn’t receive code?' : '¿No recibiste el código?')}</span>
            <button
              type="button"
              onClick={resendOtp}
              disabled={countdown > 0 || resending}
              className="font-bold text-ocean-700 hover:underline disabled:text-slate-400 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
              <span>
                {countdown > 0
                  ? (isEn ? `Resend in ${countdown}s` : `Reenviar en ${countdown}s`)
                  : (av.resendEmail || (isEn ? 'Resend code' : 'Reenviar código'))}
              </span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitReset} className="space-y-4" noValidate>
          <div className="rounded-2xl bg-sand-50/90 border border-sand-200/80 p-3.5 flex items-center justify-between text-xs text-slate-700 mb-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center shrink-0">
                <KeyRound size={16} />
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isEn ? 'Verified email' : 'Correo verificado'}
                </p>
                <p className="font-semibold text-navy-900 truncate">{email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-ocean-700 hover:text-ocean-900 font-bold text-xs shrink-0 hover:underline ml-2 cursor-pointer"
            >
              {isEn ? 'Edit Code' : 'Editar código'}
            </button>
          </div>

          <Input
            id="pw"
            label={av.passwordLabel || (isEn ? 'New password' : 'Nueva contraseña')}
            type="password"
            placeholder="Min. 8 chars"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              if (errors.pw) setErrors({ ...errors, pw: '' });
            }}
            error={errors.pw}
            icon={<Lock size={16} />}
            required
            autoFocus
          />

          <Input
            id="confirm"
            label={av.confirmPasswordLabel || (isEn ? 'Confirm password' : 'Confirmar contraseña')}
            type="password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm) setErrors({ ...errors, confirm: '' });
            }}
            error={errors.confirm}
            icon={<Lock size={16} />}
            required
          />

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              size="md"
              className="w-full rounded-xl py-3 font-bold shadow-soft"
              isLoading={loading}
            >
              {loading
                ? (av.verifying || (isEn ? 'Updating password...' : 'Actualizando contraseña...'))
                : (av.resetBtn || (isEn ? 'Reset password' : 'Restablecer contraseña'))}
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors py-1 cursor-pointer"
            >
              {isEn ? '← Back to verification code' : '← Volver al código de verificación'}
            </button>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
