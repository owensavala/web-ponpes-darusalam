import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Download, Plus, Trash2, Edit2, FileText, Save, X } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';

export const metadata = {
  title: 'Kelola Unduhan - Admin Darussalam Bacan',
};

interface AdminUnduhanProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminUnduhanPage({ searchParams }: AdminUnduhanProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const [documents, units] = await Promise.all([
    prisma.documentDownload.findMany({
      orderBy: { createdAt: 'desc' },
      include: { unit: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      select: { id: true, shortName: true },
    }),
  ]);

  const itemToEdit = edit ? documents.find((d) => d.id === edit) : null;

  async function saveDocAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const fileSize = formData.get('fileSize') as string;
    const unitId = (formData.get('unitId') as string) || null;

    if (id) {
      // Mode Update / Edit
      await prisma.documentDownload.update({
        where: { id },
        data: {
          title,
          category,
          fileUrl,
          fileSize: fileSize || 'PDF',
          unitId,
        },
      });
    } else {
      // Mode Create / Tambah Baru
      await prisma.documentDownload.create({
        data: {
          title,
          category,
          fileUrl,
          fileSize: fileSize || 'PDF',
          unitId,
        },
      });
    }

    revalidatePath('/admin/unduhan');
    revalidatePath('/informasi/unduhan');
    revalidatePath('/');
    redirect('/admin/unduhan');
  }

  async function deleteDocAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string;
    await prisma.documentDownload.delete({ where: { id } });

    revalidatePath('/admin/unduhan');
    revalidatePath('/informasi/unduhan');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Download className="w-6 h-6 text-[#D8C28A]" />
          Kelola Dokumen Unduhan Publik
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tambah, perbarui (edit), atau hapus berkas brosur PSB, formulir cetak offline, dan surat keputusan resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah / Edit */}
        <div className={`lg:col-span-5 bg-white rounded-3xl p-6 border shadow-sm space-y-4 transition ${
          itemToEdit ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F2A24] flex items-center gap-1.5 uppercase tracking-wider">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Edit Data Dokumen</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  <span>Tambah Dokumen Baru</span>
                </>
              )}
            </h2>

            {itemToEdit && (
              <Link
                href="/admin/unduhan"
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </Link>
            )}
          </div>

          <form action={saveDocAction} className="space-y-4 text-xs">
            {itemToEdit && <input type="hidden" name="id" value={itemToEdit.id} />}

            <Input
              label="Judul Dokumen"
              name="title"
              placeholder="Contoh: Brosur Resmi PSB 2026/2027"
              defaultValue={itemToEdit?.title || ''}
              required
            />

            <Select
              label="Kategori Dokumen"
              name="category"
              defaultValue={itemToEdit?.category || 'PSB'}
              options={[
                { value: 'PSB', label: 'Brosur & Formulir PSB' },
                { value: 'AKADEMIK', label: 'Panduan & Kalender Akademik' },
                { value: 'SURAT', label: 'Surat Keputusan & Izin Operasional' },
              ]}
            />

            <Input
              label="URL Berkas / Dokumen"
              name="fileUrl"
              placeholder="https://... atau /uploads/documents/..."
              defaultValue={itemToEdit?.fileUrl || ''}
              helperText="Tempelkan link unduhan Google Drive / server PDF."
              required
            />

            <Input
              label="Estimasi Ukuran File (opsional)"
              name="fileSize"
              placeholder="Contoh: 2.4 MB"
              defaultValue={itemToEdit?.fileSize || 'PDF'}
            />

            <div>
              <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                Unit Pendidikan Terkait
              </label>
              <select
                name="unitId"
                defaultValue={itemToEdit?.unitId || ''}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="">Umum Yayasan</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className={`w-full text-white transition ${
                itemToEdit ? 'bg-amber-700 hover:bg-amber-800' : 'bg-[#0F2A24] hover:bg-[#173B32]'
              }`}
              icon={itemToEdit ? <Save className="w-4 h-4 text-[#D8C28A]" /> : <Plus className="w-4 h-4 text-[#D8C28A]" />}
            >
              {itemToEdit ? 'Simpan Perubahan Dokumen' : 'Simpan Dokumen'}
            </Button>
          </form>
        </div>

        {/* List Dokumen */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0F2A24] border-b border-slate-100 pb-3">
            Daftar Dokumen Unduhan ({documents.length})
          </h2>

          <div className="space-y-3">
            {documents.map((doc) => {
              const isSelected = itemToEdit?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                    isSelected ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' : 'bg-[#FCFAF6] border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#173B32] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#0F2A24] truncate">{doc.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {doc.category} • {doc.fileSize || 'PDF'} • Diunduh {doc.downloads} kali
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/unduhan?edit=${doc.id}`}
                      className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                      title="Edit Dokumen Ini"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <form action={deleteDocAction}>
                      <input type="hidden" name="id" value={doc.id} />
                      <DeleteConfirmButton confirmMessage={`Hapus dokumen "${doc.title}"?`} />
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
