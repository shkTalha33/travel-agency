'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2, RefreshCw, FileImage } from 'lucide-react';
import { uploadApi } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export default function ImageUpload({
  value = '',
  onChange,
  folder = 'general',
  label,
  required = false,
  error,
  className = '',
  helperText,
}) {
  const { isEn } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imgLoadError, setImgLoadError] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(isEn ? 'Please select a valid image file (JPG, PNG, WebP)' : 'Seleccione un archivo de imagen válido (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(isEn ? 'Image size must be less than 10MB' : 'El tamaño de la imagen debe ser menor a 10MB');
      return;
    }

    setUploadError('');
    setImgLoadError(false);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadApi.uploadImage(base64Data, file.name, folder);
          const uploadedUrl = res.data?.url || res.url;
          if (uploadedUrl) {
            onChange(uploadedUrl);
          } else {
            throw new Error(isEn ? 'Failed to retrieve uploaded image URL' : 'No se pudo obtener la URL de la imagen');
          }
        } catch (err) {
          setUploadError(err?.message || (isEn ? 'Error uploading image' : 'Error al subir la imagen'));
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setUploadError(isEn ? 'Error reading file' : 'Error al leer el archivo');
        setIsUploading(false);
      };
    } catch (err) {
      setUploadError(err?.message || (isEn ? 'Error uploading image' : 'Error al subir la imagen'));
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setUploadError('');
    setImgLoadError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPreviewSrc = () => {
    if (!value) return '';
    if (value.startsWith('/uploads')) {
      return `http://localhost:5000${value}`;
    }
    return value;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
            {label} {required && <span className="text-[#AA303E]">*</span>}
          </label>
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={onFileChange}
          className="hidden"
          id={`file-upload-fe-${folder}-${Math.random().toString(36).substring(7)}`}
        />

        {value ? (
          /* Premium Uploaded Preview State */
          <div className="relative group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              {!imgLoadError ? (
                <img
                  src={getPreviewSrc()}
                  alt="Uploaded preview"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    if (value.includes('travel_agency/')) {
                      const pathSuffix = value.substring(value.indexOf('travel_agency/'));
                      const localFallback = `http://localhost:5000/uploads/${pathSuffix}`;
                      if (e.currentTarget.src !== localFallback) {
                        e.currentTarget.src = localFallback;
                        return;
                      }
                    }
                    setImgLoadError(true);
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <FileImage size={36} className="text-slate-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">{isEn ? 'Image Preview' : 'Vista Previa'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{value}</p>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
                  <Check size={12} strokeWidth={3} />
                  {isEn ? 'Uploaded & Ready' : 'Imagen Lista'}
                </span>
              </div>

              {/* Top Floating Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-navy-950 text-xs font-bold inline-flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={isEn ? 'Replace Image' : 'Reemplazar Imagen'}
                >
                  <RefreshCw size={13} className={isUploading ? 'animate-spin text-[#AA303E]' : 'text-slate-700'} />
                  <span>{isEn ? 'Change' : 'Cambiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-xl bg-rose-500/90 hover:bg-rose-600 text-white shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={isEn ? 'Remove Image' : 'Eliminar Imagen'}
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              </div>

              {/* Bottom Info Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs pointer-events-none">
                <p className="font-medium text-[11px] truncate max-w-[85%] text-slate-200">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Attractive Drag & Drop Zone */
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition-all duration-200 cursor-pointer ${
              isDragging
                ? 'border-[#AA303E] bg-[#AA303E]/5 scale-[1.01] shadow-md ring-4 ring-[#AA303E]/10'
                : error || uploadError
                ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
                : 'border-slate-200 bg-slate-50/60 hover:border-[#AA303E] hover:bg-[#AA303E]/5 hover:shadow-sm'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#AA303E]/10 flex items-center justify-center text-[#AA303E] animate-pulse">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-950">
                    {isEn ? 'Uploading image...' : 'Subiendo imagen...'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? 'Optimizing for ultra-fast loading' : 'Optimizando para carga rápida'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-[#AA303E] group-hover:border-[#AA303E]/30 group-hover:scale-110 transition-all duration-300">
                  <UploadCloud size={24} strokeWidth={2} />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-navy-950">
                    <span className="text-[#AA303E] group-hover:underline">
                      {isEn ? 'Click to upload' : 'Haz clic para subir'}
                    </span>{' '}
                    <span className="text-slate-600 font-medium">
                      {isEn ? 'or drag and drop' : 'o arrastra y suelta aquí'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG, WebP {isEn ? '(up to 10MB)' : '(hasta 10MB)'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-500">
                    High Quality
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-500">
                    Auto-Optimized
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {helperText && !error && !uploadError && (
        <p className="text-[11px] text-slate-400 font-medium pl-0.5">{helperText}</p>
      )}

      {(error || uploadError) && (
        <p className="text-[11px] font-semibold text-rose-500 animate-fade-in pl-0.5">
          {error || uploadError}
        </p>
      )}
    </div>
  );
}
