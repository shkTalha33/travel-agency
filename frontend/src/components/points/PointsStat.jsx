'use client';

import React from 'react';
import { Sparkles, TrendingUp, Gift, Users, Coins, Share2 } from 'lucide-react';

export default function PointsStat({ 
  label, 
  value, 
  hint, 
  tone = 'default',
  icon,
  prefix = '',
  suffix = 'PTS',
  className = ''
}) {
  const getToneIcon = () => {
    if (icon) return icon;
    switch (tone) {
      case 'accent':
      case 'ocean':
        return <Sparkles className="w-4 h-4 text-ocean-600" />;
      case 'emerald':
      case 'success':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'rose':
      case 'danger':
        return <Gift className="w-4 h-4 text-rose-600" />;
      case 'gold':
      case 'warning':
        return <Coins className="w-4 h-4 text-gold-600" />;
      case 'purple':
        return <Share2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-600" />;
    }
  };

  const getToneBg = () => {
    switch (tone) {
      case 'accent':
      case 'ocean':
        return 'bg-ocean-50 text-ocean-600';
      case 'emerald':
      case 'success':
        return 'bg-emerald-50 text-emerald-600';
      case 'rose':
      case 'danger':
        return 'bg-rose-50 text-rose-600';
      case 'gold':
      case 'warning':
        return 'bg-gold-50 text-gold-600';
      case 'purple':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-sand-100 text-navy-800';
    }
  };

  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className={`rounded-2xl bg-white p-4 sm:p-5 flex flex-col justify-between space-y-2.5 transition-colors ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
          {label}
        </span>
        <div className={`w-7 h-7 rounded-xl ${getToneBg()} flex items-center justify-center shrink-0`}>
          {getToneIcon()}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-serif text-2xl sm:text-2xl font-bold text-navy-950 tracking-tight">
            {prefix}{formattedValue}
          </span>
          {suffix && (
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {suffix}
            </span>
          )}
        </div>
        {hint && (
          <p className="mt-0.5 text-xs text-slate-500 font-medium truncate">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
