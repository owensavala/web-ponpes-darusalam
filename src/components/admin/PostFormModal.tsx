'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, X, Save, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import Modal from '@/components/ui/Modal';

interface PostData {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  thumbnailUrl?: string | null;
  type: string;
  status: string;
  isPinned: boolean;
  unitId?: string | null;
}

interface PostFormModalProps {
  units: { id: string; shortName: string }[];
  postToEdit?: PostData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostFormModal({
  units,
  postToEdit,
  isOpen,
  onClose,
}: PostFormModalProps) {
  const router = useRouter();
  const isEditing = !!postToEdit?.id;

  const [formData, setFormData] = useState<PostData>({
    title: postToEdit?.title || '',
    excerpt: postToEdit?.excerpt || '',
    content: postToEdit?.content || '',
    thumbnailUrl: postToEdit?.thumbnailUrl || '',
    type: postToEdit?.type || 'BERITA',
    status: postToEdit?.status || 'PUBLISHED',
    isPinned: postToEdit?.isPinned || false,
    unitId: postToEdit?.unitId || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMessage('Judul dan konten berita wajib diisi.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/posts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEditing ? { id: postToEdit!.id } : {}),
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan artikel.');
      }

      onClose();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Warta / Pengumuman' : 'Tulis Berita / Pengumuman Baru'}
      description="Unggah informasi warta kegiatan santri atau surat edaran resmi yayasan."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Input
          label="Judul Warta / Pengumuman"
          placeholder="Contoh: Wisuda Tahfizh Akbar 30 Juz Angkatan Ke-IV"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Kategori Tulisan"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: 'BERITA', label: 'Berita / Warta' },
              { value: 'PENGUMUMAN', label: 'Pengumuman Resmi' },
            ]}
          />

          <Select
            label="Unit Terkait"
            value={formData.unitId || ''}
            onChange={(e) => setFormData({ ...formData, unitId: e.target.value || null })}
          >
            <option value="">Umum / Yayasan</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.shortName}
              </option>
            ))}
          </Select>

          <Select
            label="Status Publikasi"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'PUBLISHED', label: 'Terbitkan (PUBLISHED)' },
              { value: 'DRAFT', label: 'Simpan Draf (DRAFT)' },
            ]}
          />
        </div>

        {/* Real File Upload with Drag & Drop */}
        <FileUpload
          label="Foto Sampul / Thumbnail Berita (Upload File Nyata)"
          folder="posts"
          accept="image/jpeg,image/png,image/webp"
          value={formData.thumbnailUrl}
          onChange={(url) => setFormData((prev) => ({ ...prev, thumbnailUrl: url }))}
          helperText="Format JPG, PNG, atau WebP. Maks 5MB."
        />

        <Textarea
          label="Ringkasan Singkat (Lead / Excerpt)"
          rows={2}
          placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
          value={formData.excerpt || ''}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        />

        <Textarea
          label="Isi Konten Lengkap"
          rows={8}
          placeholder="Tuliskan isi berita atau pengumuman secara mendalam..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isPinned"
            checked={formData.isPinned}
            onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
            className="w-4 h-4 accent-[#0F2A24] rounded"
          />
          <label htmlFor="isPinned" className="text-xs font-semibold text-[#0F2A24] cursor-pointer">
            Sematkan di Halaman Utama (Pinned Post)
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="bg-[#0F2A24] hover:bg-[#173B32] text-white font-bold"
            icon={<Save className="w-4 h-4 text-[#D8C28A]" />}
          >
            {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
