'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';

/** Copies the member's referral link to the clipboard with animated feedback. */
export default function InviteButton({ link, variant = 'primary', size = 'md', children, className = '' }) {
  const { isEn } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link || '');
      setCopied(true);
      toast(isEn ? 'Referral link copied to clipboard. Share it!' : 'Enlace de referido copiado al portapapeles. ¡Compártelo!');
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      toast(isEn ? 'Could not copy link. Please try again.' : 'No pudimos copiar el enlace. Intenta nuevamente.', 'error');
    }
  };

  const defaultLabel = isEn ? 'Invite' : 'Invitar';
  const label = children || defaultLabel;

  return (
    <Button
      variant={copied ? 'primary' : variant}
      size={size}
      onClick={copy}
      className={`border-0 focus:outline-none focus:ring-0 active:outline-none select-none transition-all duration-200 ${copied ? 'bg-ocean-600 text-white' : ''} ${className}`}
      icon={copied ? <Check size={16} className="text-white animate-in zoom-in" /> : <Copy size={16} />}
    >
      {copied ? (isEn ? 'Copied!' : '¡Copiado!') : label}
    </Button>
  );
}

