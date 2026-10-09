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
    if (f.name.trim().length < 3) err.name = copy.validation?.nameRequired || 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = copy.validation?.emailValid || 'Please enter a valid email address.';
    if (f.password.length < 8) err.password = copy.validation?.passwordMinLength || 'Password must be at least 8 characters.';
    if (f.confirm !== f.password) err.confirm = copy.validation?.passwordsMatch || 'Passwords do not match.';
    if (!f.terms) err.terms = copy.validation?.termsRequired || 'You must accept the terms and conditions.';
    setErrors(err);

    if (Object.keys(err).length) {
      const firstErr = Object.values(err)[0];
      toast(firstErr, 'error');
      return;
    }

    setLoading(true);
    try {
      await register({ name: f.name, email: f.email, password: f.password, referralCode: f.referralCode });
      toast(copy.toasts?.codeSent || '4-digit verification code sent to your email!');
      setStep('otp');
      setCountdown(60);
    } catch (apiErr) {
      const msg = apiErr.message || copy.toasts?.errorCreating || 'Error creating account.';
      setErrors({ email: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 4) {
      const msg = copy.validation?.enterOtp4 || 'Please enter the 4-digit OTP code.';
      setErrors({ otp: msg });
      toast(msg, 'error');
      return;
    }

    setLoading(true);
    try {
      await verifyOtpAndRegister({ email: f.email, otp: otp.trim() });
      toast(copy.toasts?.accountVerified || 'Account verified successfully!');
      router.push('/dashboard');
    } catch (apiErr) {
      const msg = apiErr.message || copy.toasts?.invalidOtp || 'Invalid or expired OTP code.';
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
      toast(copy.toasts?.newCodeSent || 'New verification code sent!');
    } catch (apiErr) {
      toast(apiErr.message || copy.toasts?.errorResending || 'Error resending code.', 'error');
    } finally {
      setResending(false);
    }
  };

  if (step === 'otp') {
    return (
      <AuthShell
        title={av.verifyTitle}
        subtitle={typeof av.otpSentTo === 'function' ? av.otpSentTo(f.email) : `We sent a 4-digit code to ${f.email}`}
        footer={
          <button
            type="button"
            onClick={() => setStep('form')}
            className="font-bold text-ocean-700 hover:underline"
          >
            {av.changeEmailDetails}
          </button>
        }
      >
        <form onSubmit={submitOtp} className="space-y-4" noValidate>
          <p className="text-xs text-slate-500 text-center max-w-sm mx-auto leading-relaxed">
            {av.checkInboxSpam}
          </p>

          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-navy-900 text-center">
              {av.otpLabel}
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
            {loading ? (av.verifying || 'Verifying...') : av.verifyOtpBtn}
          </Button>

          <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
            <span>{av.didntReceive}</span>
            <button
              type="button"
              onClick={resendCode}
              disabled={countdown > 0 || resending}
              className="font-bold text-ocean-700 hover:underline disabled:text-slate-400 flex items-center gap-1"
            >
              <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
              {countdown > 0
                ? (isEn ? `Resend in ${countdown}s` : `Reenviar en ${countdown}s`)
                : av.resendEmail}
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={av.regTitle}
      subtitle={av.regSubtitle}
      footer={
        <>
          {av.haveAccount}{' '}
          <Link href="/login" className="font-bold text-ocean-700 hover:underline">
            {av.loginLink}
          </Link>
        </>
      }
    >
      <form onSubmit={submitForm} className="space-y-4" noValidate>
        <Input
          id="name"
          label={av.fullNameLabel}
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
          label={av.emailLabel}
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
          label={av.passwordLabel}
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
          label={av.confirmPasswordLabel}
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
          label={av.referralCodeLabel}
          placeholder="SOFIA-VIAJES"
          value={f.referralCode}
          onChange={set('referralCode')}
          icon={<Ticket size={16} />}
          helperText={av.referralCodeHint}
        />
        <Checkbox
          id="terms"
          checked={f.terms}
          onChange={set('terms')}
          error={errors.terms}
          label={
            <>
              {av.termsAgree}
            </>
          }
        />
        <Button type="submit" size="md" className="w-full rounded-xl py-2.5 font-bold shadow-soft" isLoading={loading}>
          {loading ? (av.creatingAccount || 'Creating account...') : av.registerBtn}
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

