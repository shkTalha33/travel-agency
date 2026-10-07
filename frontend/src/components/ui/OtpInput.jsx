'use client';

import React, { useRef, useEffect } from 'react';

export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  error = false,
  disabled = false,
  autoFocus = true,
  className = '',
}) {
  const inputsRef = useRef([]);

  // Ensure digits array matches requested length
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputsRef.current[0] && !disabled) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (index, e) => {
    const rawVal = e.target.value;
    // Extract only digits
    const cleaned = rawVal.replace(/\D/g, '');

    if (!cleaned) {
      // Cleared current box
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    if (cleaned.length > 1) {
      // User pasted or typed multiple digits in a single input
      handlePasteString(cleaned, index);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto advance to next box
    if (index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePasteString = (pastedStr, startIndex = 0) => {
    const cleaned = pastedStr.replace(/\D/g, '').slice(0, length);
    if (!cleaned) return;

    const newDigits = [...digits];
    for (let i = 0; i < cleaned.length; i++) {
      if (startIndex + i < length) {
        newDigits[startIndex + i] = cleaned[i];
      }
    }
    const finalOtp = newDigits.join('');
    onChange(finalOtp);

    // Focus on the next available empty box or the last box
    const nextIndex = Math.min(startIndex + cleaned.length, length - 1);
    if (inputsRef.current[nextIndex]) {
      inputsRef.current[nextIndex].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputsRef.current[index - 1]) {
        // Move to previous input and clear it
        inputsRef.current[index - 1].focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePasteString(pastedData, 0);
  };

  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}>
      {Array.from({ length }).map((_, index) => {
        const isFilled = !!digits[index];
        return (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2} // Allow typing to catch replace
            value={digits[index]}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`h-13 w-11 sm:h-15 sm:w-13 text-center text-2xl font-bold font-mono rounded-xl border transition-all duration-200 outline-none focus:outline-none focus:ring-0 select-none ${
              error
                ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600'
                : isFilled
                ? 'border-gold-500 bg-gold-50/20 text-navy-950'
                : 'border-slate-300 bg-white text-navy-900 hover:border-slate-400 focus:border-gold-500 shadow-xs'
            }`}
          />
        );
      })}
    </div>
  );
}
