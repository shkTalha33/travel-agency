'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

/** Copies the member's referral link to the clipboard with animated feedback. */
export default function InviteButton({ link, variant = 'primary', size = 'md', children = 'Invitar', className = '' }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast('Enlace de referido copiado al portapapeles. ¡Compártelo!');
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      toast('No pudimos copiar el enlace. Intenta nuevamente.', 'error');
    }
  };

  return (
    <Button
      variant={copied ? 'success' : variant}
      size={size}
      onClick={copy}
      className={`transition-all duration-200 ${className}`}
      icon={copied ? <Check size={16} className="text-emerald-500 animate-in zoom-in" /> : <Copy size={16} />}
    >
      {copied ? '¡Copiado!' : children}
    </Button>
  );
}
