'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye, Calendar, Sparkles, Pin } from 'lucide-react';
import Button from '@/components/ui/Button';
import PostFormModal from './PostFormModal';
import { formatTanggal } from '@/lib/utils';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  thumbnailUrl?: string | null;
  type: string;
  status: string;
  isPinned: boolean;
  views: number;
  publishedAt: Date | string | null;
  unitId?: string | null;
  unit?: { shortName: string } | null;
  author: { name: string };
}

interface PostManagerProps {
  initialPosts: PostItem[];
  units: { id: string; shortName: string }[];
}

export default function PostManager({ initialPosts, units }: PostManagerProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedPost(null);
    setModalOpen(true);
  };

  const handleEdit = (post: PostItem) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel: "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D8C28A]" />
            Kelola Warta & Pengumuman Resmi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {initialPosts.length} artikel terdaftar dalam sistem yayasan.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleCreate}
          className="bg-[#0F2A24] hover:bg-[#173B32] text-white"
          icon={<Plus className="w-4 h-4 text-[#D8C28A]" />}
        >
          Tulis Berita Baru
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCFAF6] border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Artikel / Warta</th>
                <th className="py-3.5 px-4">Kategori & Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Dibaca</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Belum ada berita atau pengumuman yang ditulis.
                  </td>
                </tr>
              ) : (
                initialPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {post.thumbnailUrl ? (
                            <Image
                              src={post.thumbnailUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized={post.thumbnailUrl.startsWith('/uploads')}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                              Foto
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            {post.isPinned && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                <Pin className="w-2.5 h-2.5" /> Pinned
                              </span>
                            )}
                            <strong className="text-xs text-[#0F2A24] line-clamp-1">
                              {post.title}
                            </strong>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Penulis: {post.author.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 block w-max">
                        {post.type}
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold block mt-1">
                        {post.unit ? post.unit.shortName : 'Umum Yayasan'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {post.views}x
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatTanggal(post.publishedAt)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/informasi/berita/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-500 hover:text-[#0F2A24] rounded-lg hover:bg-slate-100 transition"
                          title="Lihat Halaman Publik"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1.5 text-[#0F2A24] hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {modalOpen && (
        <PostFormModal
          units={units}
          postToEdit={selectedPost}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
