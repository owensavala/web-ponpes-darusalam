'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  label: string;
  folder?: 'psb' | 'posts' | 'units' | 'gallery' | 'documents' | 'general';
  accept?: string;
  value?: string | null;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  isPdfAllowed?: boolean;
  disabled?: boolean;
}

export default function FileUpload({
  label,
  folder = 'general',
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  value,
  onChange,
  required = false,
  helperText = 'Maksimal 5MB. Format: JPG, PNG, WebP, PDF.',
  isPdfAllowed = true,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = async (file: File) => {
    setErrorMessage(null);

    // Validasi Ukuran (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(`Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maksimal 5 MB.`);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengunggah file.');
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat unggah berkas.';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isPdf = value?.toLowerCase().endsWith('.pdf');

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-[#0F2A24]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tersimpan
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className="relative group border-2 border-dashed border-[#173B32]/30 bg-emerald-50/40 rounded-xl p-3 flex items-center justify-between gap-4 transition hover:border-[#173B32]/60">
          <div className="flex items-center gap-3 overflow-hidden">
            {isPdf ? (
              <div className="w-12 h-12 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-rose-600" />
              </div>
            ) : (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 bg-emerald-50 shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt={label || 'Berkas Gambar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23173B32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                  }}
                />
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-[#0F2A24] truncate">
                {value.split('/').pop()}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#065F46] hover:text-[#047857] hover:underline font-medium inline-block mt-0.5"
              >
                Buka / Lihat Berkas ↗
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="px-2.5 py-1 text-xs font-semibold text-[#0F2A24] bg-white border border-[#173B32]/20 rounded-lg hover:bg-[#F2EEE3] transition"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition"
              title="Hapus berkas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-5 text-center transition flex flex-col items-center justify-center gap-2 ${
            dragActive
              ? 'border-[#D8C28A] bg-[#173B32]/5'
              : 'border-slate-300 bg-white hover:border-[#173B32]/50 hover:bg-[#FCFAF6]'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#173B32]" />
              <p className="text-xs font-medium text-slate-600">Mengunggah berkas...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-[#173B32]/10 flex items-center justify-center text-[#173B32]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0F2A24]">
                  Klik untuk unggah atau seret berkas ke sini
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
