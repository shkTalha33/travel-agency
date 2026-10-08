'use client';

import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

export default function TagInput({
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter...',
  variant = 'ocean', // 'ocean' | 'emerald' | 'rose' | 'gold' | 'navy'
  addButtonLabel = 'Add',
  required = false,
  error = null,
}) {
  const [inputValue, setInputValue] = useState('');

  const tags = Array.isArray(value) ? value : [];

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      if (onChange) onChange(updated);
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent modal form submission
      handleAdd();
    } else if (e.key === ',' && inputValue.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = tags.filter((_, idx) => idx !== indexToRemove);
    if (onChange) onChange(updated);
  };

  const variantStyles = {
    ocean: {
      badge: 'bg-ocean-50 text-ocean-900 border-ocean-200/80 hover:border-ocean-300',
      btn: 'bg-ocean-600 hover:bg-ocean-700 text-white',
      removeBtn: 'text-ocean-500 hover:text-ocean-800 hover:bg-ocean-100',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:border-emerald-300',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      removeBtn: 'text-emerald-500 hover:text-emerald-800 hover:bg-emerald-100',
    },
    rose: {
      badge: 'bg-rose-50 text-rose-900 border-rose-200/80 hover:border-rose-300',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
      removeBtn: 'text-rose-500 hover:text-rose-800 hover:bg-rose-100',
    },
    gold: {
      badge: 'bg-gold-50 text-gold-950 border-gold-200/80 hover:border-gold-300',
      btn: 'bg-gold-600 hover:bg-gold-700 text-navy-950 font-bold',
      removeBtn: 'text-gold-700 hover:text-gold-950 hover:bg-gold-100',
    },
    navy: {
      badge: 'bg-sand-100 text-navy-900 border-sand-300 hover:border-navy-300',
      btn: 'bg-navy-900 hover:bg-navy-800 text-white',
      removeBtn: 'text-navy-500 hover:text-navy-900 hover:bg-sand-200',
    },
  };

  const currentTheme = variantStyles[variant] || variantStyles.ocean;

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-navy-900">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <span className="text-[10px] font-semibold text-slate-400">
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </span>
        </div>
      )}

      {/* Input Box with inline Plus Button */}
      <div className="relative flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 px-3.5 py-2.5 text-xs bg-white border rounded-xl outline-none ring-0 focus:outline-none focus:ring-0 transition-colors ${
            error
              ? 'border-rose-400 focus:border-rose-500 bg-white'
              : 'border-sand-200 focus:border-gold-500 bg-white'
          }`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          title={addButtonLabel}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${currentTheme.btn}`}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{addButtonLabel}</span>
        </button>
      </div>

      {/* Rendered Tag Badges */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-xs font-medium rounded-xl border shadow-2xs transition-all animate-fade-in ${currentTheme.badge}`}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                aria-label={`Remove ${tag}`}
                className={`p-0.5 rounded-lg transition-colors cursor-pointer ${currentTheme.removeBtn}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
