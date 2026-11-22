'use client';

import React, { useState } from 'react';
import FileUpload from '@/components/ui/FileUpload';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  name: string;
  defaultValue?: string | null;
  folder?: 'posts' | 'units' | 'gallery' | 'documents' | 'general';
  helperText?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  name,
  defaultValue = '',
  folder = 'general',
  helperText = 'Format: JPG, PNG, WebP. Maksimal 5MB.',
  required = false,
}: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue || '');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#0F2A24] uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
              mode === 'upload' ? 'bg-white text-[#0F2A24] shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3 h-3 text-[#D8C28A]" />
            Unggah File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition ${
              mode === 'url' ? 'bg-white text-[#0F2A24] shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-[#D8C28A]" />
            Link URL
          </button>
        </div>
      </div>

      {/* Hidden input to pass value to FormData in Server Action */}
      <input type="hidden" name={name} value={imageUrl} />

      {mode === 'upload' ? (
        <FileUpload
          label=""
          folder={folder}
          value={imageUrl}
          onChange={(url) => setImageUrl(url)}
          helperText={helperText}
          isPdfAllowed={false}
          required={required && !imageUrl}
        />
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... atau https://..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0F2A24] focus:outline-none focus:ring-2 focus:ring-[#D8C28A] bg-white"
          />
          <p className="text-[10px] text-slate-500">
            Tempelkan link gambar web langsung jika tidak ingin mengunggah file dari perangkat.
          </p>
        </div>
      )}
    </div>
  );
}
