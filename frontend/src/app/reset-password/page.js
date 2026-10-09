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
    if (!/^\S+@\S+\.\S+$/.test(email)) err.email = copy.validation?.emailRequired || 'Valid email is required.';
    if (!otp || otp.trim().length !== 4) err.otp = copy.validation?.otpRequired || '4-digit OTP code is required.';
    if (pw.length < 8) err.pw = copy.validation?.passwordMinLength || 'Password must be at least 8 characters.';
    if (confirm !== pw) err.confirm = copy.validation?.passwordsMatch || 'Passwords do not match.';
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
      toast(copy.toasts?.passwordReset || 'Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (apiErr) {
      const msg = apiErr.message || copy.toasts?.invalidOtp || 'Invalid or expired OTP code.';
      setErrors({ otp: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={av.resetTitle}
      subtitle={av.resetWithOtpSubtitle}
      footer={
        <Link href="/login" className="font-semibold text-ocean-600 hover:underline">
          {av.backToLogin}
        </Link>
      }
    >
      {done ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
          <div>
            <p className="font-semibold text-emerald-800">{copy.toasts?.passwordReset}</p>
            <p className="mt-1 text-xs text-emerald-700">
              {av.resetSentDesc || 'You can now log in with your new password.'}
            </p>
          </div>
          <Link href="/login" className="block">
            <Button className="w-full">{av.loginBtn}</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input
            id="email"
            label={av.emailLabel}
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
            <label className="block text-xs font-semibold capitalize text-navy-900 text-center">
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

          <Input
            id="pw"
            label={av.resetTitle}
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
            label={av.confirmPasswordLabel}
            type="password"
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            icon={<Lock size={16} />}
            required
          />

          <Button type="submit" size="md" className="w-full rounded-xl py-2.5 font-bold shadow-soft" isLoading={loading}>
            {loading ? (av.verifying || 'Updating...') : av.resetBtn}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
