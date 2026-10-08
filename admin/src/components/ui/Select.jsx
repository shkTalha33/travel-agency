'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomSelect({
  label,
  id,
  options = [],
  value,
  onChange,
  placeholder,
  error = '',
  required = false,
  className = '',
  searchable = true,
  disabled = false,
  name,
  placement = 'auto',
}) {
  const auto = useId();
  const fid = id || auto;
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  let isEn = false;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langContext = useLanguage();
    isEn = langContext?.isEn;
  } catch (_) {
    isEn = false;
  }

  const defaultPlaceholder = isEn ? '-- Select --' : '-- Seleccionar --';
  const effectivePlaceholder = placeholder !== undefined ? placeholder : defaultPlaceholder;

  // Auto-detect upward vs downward placement when opening
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    if (placement === 'top') {
      setOpenUpward(true);
      return;
    }
    if (placement === 'bottom') {
      setOpenUpward(false);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    let spaceBelow = viewportHeight - rect.bottom;
    let spaceAbove = rect.top;

    let parent = containerRef.current.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll' ||
        style.overflow === 'auto' ||
        style.overflow === 'scroll'
      ) {
        const parentRect = parent.getBoundingClientRect();
        spaceBelow = Math.min(spaceBelow, parentRect.bottom - rect.bottom);
        spaceAbove = Math.min(spaceAbove, rect.top - parentRect.top);
        break;
      }
      parent = parent.parentElement;
    }

    setOpenUpward(spaceBelow < 260 && spaceAbove > 140);
  }, [isOpen, placement]);

  // Close on outside click (using capture phase so it works anywhere, including inside modals)
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen]);

  // Find selected option
  const selectedOption = options.find((o) => String(o.value) === String(value));

  // Filter options if searchable
  const filteredOptions = searchQuery.trim()
    ? options.filter((o) => {
        const text = `${o.label || ''} ${o.sublabel || ''} ${o.description || ''} ${o.badge || ''}`.toLowerCase();
        return text.includes(searchQuery.toLowerCase());
      })
    : options;

  const handleSelect = (val) => {
    if (disabled) return;
    onChange({ target: { value: val, name: name || fid } });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`w-full ${isOpen ? 'relative z-50' : 'relative z-10'} ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={fid} className="block text-xs font-bold text-navy-800 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          id={fid}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-xs font-semibold rounded-xl border bg-white outline-none ring-0 focus:outline-none focus:ring-0 transition-colors cursor-pointer ${
            isOpen
              ? 'border-gold-500'
              : error
              ? 'border-rose-400 focus:border-rose-500'
              : 'border-sand-300 hover:border-gold-400 focus:border-gold-500'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            {selectedOption ? (
              <div className="flex items-center gap-2 truncate">
                {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
                <span className="text-navy-950 font-bold truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-gold-100 text-gold-900 border border-gold-300 shrink-0">
                    {selectedOption.badge}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 font-normal">{effectivePlaceholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {value && !required && !disabled && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect('');
                }}
                className="p-0.5 text-slate-400 hover:text-navy-900 rounded-md hover:bg-slate-100 transition-colors mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-gold-600' : ''
              }`}
            />
          </div>
        </button>

        {/* Custom Luxury Dropdown Popover */}
        {isOpen && (
          <div
            className={`absolute left-0 right-0 bg-white rounded-2xl border border-sand-300 z-[150] overflow-hidden animate-scale-in max-h-72 flex flex-col ${
              openUpward
                ? 'bottom-full mb-1.5 shadow-[0_-12px_30px_-5px_rgba(0,0,0,0.18)]'
                : 'top-full mt-1.5 shadow-xl'
            }`}
          >
            {/* Optional search input */}
            {(searchable || options.length > 5) && (
              <div className="p-2 border-b border-sand-200 bg-white shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEn ? 'Search option...' : 'Buscar opción...'}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-sand-300 rounded-lg outline-none focus:outline-none ring-0 focus:ring-0 focus:border-gold-500 font-medium text-navy-900 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-56 divide-y divide-sand-100/60">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  {isEn ? 'No options found' : 'No se encontraron opciones'}
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-gold-50 to-amber-50/80 text-gold-950 font-bold border border-gold-200 shadow-xs'
                          : 'hover:bg-sand-50 text-navy-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <div className="truncate">
                          <p className="truncate text-xs">{opt.label}</p>
                          {opt.sublabel && (
                            <p className="text-[10px] text-slate-500 font-normal truncate mt-0.5">
                              {opt.sublabel}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {opt.badge && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && <Check className="w-4 h-4 text-gold-600 shrink-0" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-rose-600 flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
