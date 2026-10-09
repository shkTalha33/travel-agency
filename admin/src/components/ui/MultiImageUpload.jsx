'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Loader2, 
  Star, 
  FileImage, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export default function MultiImageUpload({
  images = [],
  onChange,
  folder = 'offers',
  label,
  required = false,
  error,
  helperText,
  className = '',
}) {
  const { isEn } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const handleUploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    setIsUploading(true);

    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 15 * 1024 * 1024) continue;

      try {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await adminApi.uploadImage(base64Data, file.name, folder);
        const url = res.data?.url || res.url;
        if (url) {
          uploadedUrls.push(url);
        }
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
      }
    }

    setIsUploading(false);

    if (uploadedUrls.length > 0) {
      const nextImages = [...safeImages, ...uploadedUrls];
      onChange(nextImages);
    } else {
      setUploadError(isEn ? 'Failed to upload one or more images' : 'No se pudieron subir una o más imágenes');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove, e) => {
    e?.stopPropagation();
    const nextImages = safeImages.filter((_, idx) => idx !== indexToRemove);
    onChange(nextImages);
  };

  const handleSetPrimary = (indexToPrimary, e) => {
    e?.stopPropagation();
    if (indexToPrimary === 0) return;
    const selected = safeImages[indexToPrimary];
    const filtered = safeImages.filter((_, idx) => idx !== indexToPrimary);
    onChange([selected, ...filtered]);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label and Count */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
          {label || (isEn ? 'Offer Images (Gallery)' : 'Imágenes de la Oferta (Galería)')}{' '}
          {required && <span className="text-[#AA303E]">*</span>}
        </label>
        <span className="text-[11px] font-semibold text-slate-500">
          {safeImages.length} {safeImages.length === 1 ? (isEn ? 'image' : 'imagen') : (isEn ? 'images' : 'imágenes')}
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={(e) => {
          if (e.target.files) {
            handleUploadFiles(Array.from(e.target.files));
          }
        }}
        className="hidden"
        id={`multi-upload-admin-${Math.random().toString(36).substring(7)}`}
      />

      {/* Grid of Images matching OfferCard Aspect Ratio [4/3] */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5"
      >
        {safeImages.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-sand-200 shadow-sm transition-all hover:shadow-md hover:border-ocean-300"
          >
            <img
              src={src.startsWith('/uploads') ? `http://localhost:5000${src}` : src}
              alt={`Offer image ${idx + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                if (src.includes('travel_agency/')) {
                  const pathSuffix = src.substring(src.indexOf('travel_agency/'));
                  const localFallback = `http://localhost:5000/uploads/${pathSuffix}`;
                  if (e.currentTarget.src !== localFallback) {
                    e.currentTarget.src = localFallback;
                    return;
                  }
                }
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

            {/* Primary Cover Badge */}
            {idx === 0 ? (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-navy-950/90 text-gold-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-gold-400/40 shadow-xs">
                  <Star size={10} className="fill-gold-300" />
                  <span>{isEn ? 'Primary' : 'Portada'}</span>
                </span>
              </div>
            ) : (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => handleSetPrimary(idx, e)}
                  className="px-2 py-0.5 rounded-md bg-white/90 hover:bg-white text-navy-950 text-[10px] font-bold shadow-xs transition-all cursor-pointer"
                  title={isEn ? 'Set as primary cover' : 'Fijar como portada'}
                >
                  {isEn ? 'Make Cover' : 'Hacer Portada'}
                </button>
              </div>
            )}

            {/* Delete Button */}
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={(e) => handleRemoveImage(idx, e)}
                className="w-7 h-7 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white flex items-center justify-center shadow-md backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title={isEn ? 'Delete this image' : 'Eliminar esta imagen'}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Index Counter */}
            <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white/90 drop-shadow-md">
              #{idx + 1}
            </div>
          </div>
        ))}

        {/* Upload New Image Box (Matching Exact Aspect Ratio [4/3]) */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-[4/3] w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-ocean-500 bg-ocean-50 scale-[1.02] shadow-sm'
              : 'border-slate-300 bg-slate-50/70 hover:border-ocean-500 hover:bg-ocean-50/40 hover:shadow-xs'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-1.5">
              <Loader2 size={24} className="animate-spin text-ocean-600" />
              <span className="text-[11px] font-bold text-navy-950">{isEn ? 'Uploading...' : 'Subiendo...'}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5 text-slate-500 hover:text-ocean-600">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 hover:scale-110 transition-transform">
                <Plus size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-navy-950">
                {isEn ? 'Add Images' : 'Añadir Fotos'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isEn ? 'Multiple allowed' : 'Múltiples permitidas'}
              </span>
            </div>
          )}
        </div>
      </div>

      {helperText && !error && !uploadError && (
        <p className="text-[11px] text-slate-400 font-medium">{helperText}</p>
      )}

      {(error || uploadError) && (
        <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error || uploadError}</span>
        </p>
      )}
    </div>
  );
}
