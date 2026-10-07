'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { authApi } from '@/lib/apiClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { copy, locale } = useLanguage();
  const { toast } = useToast();
  const av = copy.authViews || {};
  const isEn = locale === 'en';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      const msg = isEn ? 'Please enter a valid email address.' : 'Por favor ingresa un correo electrónico válido.';
      setError(msg);
      toast(msg, 'error');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast(isEn ? '6-digit reset code sent to your email!' : '¡Código de restablecimiento de 6 dígitos enviado a tu correo!');
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1200);
    } catch (apiErr) {
      const msg = apiErr.message || (isEn ? 'Error sending reset code.' : 'Error al enviar código de recuperación.');
      toast(msg, 'error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={av.forgotTitle || 'Recuperar contraseña'}
      subtitle={av.forgotSubtitle || 'Te enviaremos un código OTP para restablecerla.'}
      footer={
        <Link href="/login" className="font-semibold text-ocean-600 hover:underline">
          {av.backToLogin || 'Volver a iniciar sesión'}
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-4">
          <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
          <div>
            <p className="font-semibold text-emerald-800">{isEn ? 'Reset OTP code sent!' : '¡Código de restablecimiento enviado!'}</p>
            <p className="mt-1 text-xs text-emerald-700">
              {isEn ? `Check ${email} for your 6-digit code.` : `Revisa tu correo ${email} para ver tu código de 6 dígitos.`}
            </p>
          </div>
          <Link href={`/reset-password?email=${encodeURIComponent(email)}`} className="block">
            <Button className="w-full flex items-center justify-center gap-2">
              <span>{isEn ? 'Enter OTP Code & Reset' : 'Ingresar código OTP y restablecer'}</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <Input
            id="email"
            label={av.emailLabel || 'Correo electrónico'}
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={<Mail size={16} />}
            required
            autoFocus
          />
          <Button type="submit" size="lg" className="w-full rounded-2xl py-3.5 shadow-md" isLoading={loading}>
            {loading ? (av.loggingIn || 'Enviando código...') : (isEn ? 'Send 6-digit OTP code' : 'Enviar código OTP de 6 dígitos')}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
