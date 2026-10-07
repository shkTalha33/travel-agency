'use client';

import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { useLanguage } from '@/context/LanguageContext';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
  variant = 'primary',
}) {
  const { locale } = useLanguage();
  const isEn = locale === 'en';

  const defaultConfirm = confirmText || (isEn ? 'Confirm' : 'Continuar');
  const defaultCancel = cancelText || (isEn ? 'Cancel' : 'Cancelar');
  const processingText = isEn ? 'Processing...' : 'Procesando...';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm leading-relaxed text-slate-700">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={loading}>{defaultCancel}</Button>
        <Button variant={variant} onClick={onConfirm} isLoading={loading}>{loading ? processingText : defaultConfirm}</Button>
      </div>
    </Modal>
  );
}
