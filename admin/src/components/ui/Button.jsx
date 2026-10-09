'use client';

import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';

  const variants = {
    primary: 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-xs active:scale-[0.99]',
    gold: 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-xs active:scale-[0.99]',
    ocean: 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-xs active:scale-[0.99]',
    secondary: 'bg-white text-navy-800 border border-sand-200 hover:bg-sand-50 hover:border-sand-300 shadow-xs',
    outline: 'bg-transparent text-ocean-600 border border-ocean-600 hover:bg-ocean-50',
    ghost: 'bg-transparent text-navy-700 hover:text-navy-950 hover:bg-sand-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs active:scale-[0.99]',
  };

  const sizes = {
    xs: 'text-[11px] px-2.5 py-1.5 gap-1.5 rounded-lg',
    sm: 'text-xs px-3.5 py-2 gap-1.5 rounded-xl',
    md: 'text-xs px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-sm px-6 py-3 gap-2.5 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="shrink-0 inline-flex items-center">{icon}</span>}
    </button>
  );
}
