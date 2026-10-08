'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import { ChevronDown, Check, Search, X, Globe, AlertCircle } from 'lucide-react';
import { COUNTRIES, getCountryByName, getCountryByCode } from '@/data/countries';
import { useLanguage } from '@/context/LanguageContext';

export default function CountrySelect({
  value = '',
  onChange,
  label,
  required = false,
  error = '',
  placeholder,
  className = '',
  disabled = false,
  id,
}) {
  const { isEn } = useLanguage();
  const autoId = useId();
  const selectId = id || autoId;
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const defaultPlaceholder = placeholder || (isEn ? '-- Select Country --' : '-- Seleccionar País --');

  // Match current value against country by name or code
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    return getCountryByName(value) || getCountryByCode(value) || null;
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Filter countries by query
  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (country) => {
    if (disabled) return;
    // Pass country name in Spanish (or English) as value and full country object
    onChange({
      target: {
        value: country.name,
        name: 'country',
        country,
      },
    });
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({
      target: {
        value: '',
        name: 'country',
        country: null,
      },
    });
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-navy-800 mb-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between text-left px-3.5 py-2 text-xs font-medium rounded-xl border bg-white outline-none ring-0 focus:outline-none focus:ring-0 transition-all cursor-pointer ${
            isOpen
              ? 'border-gold-500 bg-white ring-2 ring-gold-500/20 shadow-xs'
              : error
              ? 'border-rose-400 bg-white'
              : 'border-sand-200 hover:border-gold-400 focus:border-gold-500 bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {selectedCountry ? (
              <div className="flex items-center gap-2 truncate">
                <span className="text-lg leading-none shrink-0" role="img" aria-label={selectedCountry.name}>
                  {selectedCountry.flag}
                </span>
                <span className="font-bold text-navy-950 truncate">
                  {isEn ? selectedCountry.nameEn : selectedCountry.name}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase bg-sand-200/80 px-1.5 py-0.5 rounded shrink-0">
                  {selectedCountry.code}
                </span>
              </div>
            ) : value ? (
              <div className="flex items-center gap-2 truncate">
                <Globe size={14} className="text-slate-400 shrink-0" />
                <span className="font-bold text-navy-950 truncate">{value}</span>
              </div>
            ) : (
              <span className="text-slate-400 font-normal">{defaultPlaceholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {value && !required && !disabled && (
              <span
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                title={isEn ? 'Clear' : 'Limpiar'}
              >
                <X size={13} />
              </span>
            )}
            <ChevronDown
              size={15}
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold-600' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-sand-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Search Box */}
            <div className="p-2 border-b border-sand-100 bg-white">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={isEn ? 'Search country or code...' : 'Buscar país o código...'}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-sand-200 rounded-xl outline-none focus:border-gold-500 text-navy-950 font-medium"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  {isEn ? 'No countries found' : 'No se encontraron países'}
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected =
                    selectedCountry?.code === c.code ||
                    value?.toLowerCase() === c.name.toLowerCase() ||
                    value?.toLowerCase() === c.nameEn.toLowerCase();

                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-gold-50 text-gold-900 font-bold border border-gold-300/60'
                          : 'hover:bg-sand-100/70 text-navy-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="text-xl leading-none shrink-0" role="img" aria-label={c.name}>
                          {c.flag}
                        </span>
                        <div className="text-left truncate">
                          <p className="truncate font-semibold text-xs leading-tight">
                            {isEn ? c.nameEn : c.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {isEn ? c.name : c.nameEn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500 font-bold px-1.5 py-0.5 bg-slate-100 rounded">
                          {c.code}
                        </span>
                        {isSelected && <Check size={14} className="text-gold-700" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
