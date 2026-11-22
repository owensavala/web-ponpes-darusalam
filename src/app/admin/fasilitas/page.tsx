import React from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Building, Plus, Trash2, Edit2, Sparkles, CheckCircle2, Save, X } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Kelola Fasilitas - Admin Darussalam Bacan',
};

interface AdminFasilitasProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminFasilitasPage({ searchParams }: AdminFasilitasProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const facilities = await prisma.facility.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const itemToEdit = edit ? facilities.find((f) => f.id === edit) : null;

  async function saveFacilityAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const imageUrl = (formData.get('imageUrl') as string) || null;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 0;

    if (id) {
      // Mode Update / Edit
      await prisma.facility.update({
        where: { id },
        data: {
          name,
          category,
          description: description || null,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          displayOrder,
        },
      });
    } else {
      // Mode Create / Tambah Baru
      await prisma.facility.create({
        data: {
          name,
          category,
          description: description || null,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          displayOrder,
        },
      });
    }

    revalidatePath('/admin/fasilitas');
    revalidatePath('/profil/fasilitas');
    revalidatePath('/');
    redirect('/admin/fasilitas');
  }

  async function deleteFacilityAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string;
    await prisma.facility.delete({ where: { id } });

    revalidatePath('/admin/fasilitas');
    revalidatePath('/profil/fasilitas');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
            <Building className="w-6 h-6 text-[#D8C28A]" />
            Kelola Fasilitas & Sarana Prasarana
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambah, perbarui (edit), atau hapus sarana prasarana yang tampil di halaman profil fasilitas publik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Tambah / Edit Fasilitas */}
        <div className={`bg-white rounded-3xl p-6 border shadow-sm lg:col-span-1 transition ${
          itemToEdit ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider flex items-center gap-2">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Edit Data Fasilitas</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  <span>Tambah Fasilitas Baru</span>
                </>
              )}
            </h2>

            {itemToEdit && (
              <Link
                href="/admin/fasilitas"
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </Link>
            )}
          </div>

          <form action={saveFacilityAction} className="space-y-4">
            {itemToEdit && <input type="hidden" name="id" value={itemToEdit.id} />}

            <Input
              label="Nama Fasilitas"
              name="name"
              placeholder="Misal: Masjid Jami' Darussalam"
              defaultValue={itemToEdit?.name || ''}
              required
            />

            <Select
              label="Kategori Fasilitas"
              name="category"
              defaultValue={itemToEdit?.category || 'IBADAH'}
              options={[
                { value: 'IBADAH', label: 'Sarana Ibadah' },
                { value: 'ASRAMA', label: 'Asrama & Tempat Tinggal' },
                { value: 'AKADEMIK', label: 'Gedung Kelas & Lab' },
                { value: 'PENUNJANG', label: 'Sarana Olahraga & Penunjang' },
              ]}
              required
            />

            <ImageUploadField
              label="Foto Fasilitas Kampus"
              name="imageUrl"
              folder="general"
              defaultValue={itemToEdit?.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
              helperText="Unggah foto dari HP/Laptop atau tempelkan link URL."
            />

            <Input
              label="Nomor Urutan Tampil"
              name="displayOrder"
              type="number"
              defaultValue={itemToEdit ? itemToEdit.displayOrder : facilities.length + 1}
              required
            />

            <Textarea
              label="Deskripsi Fasilitas"
              name="description"
              rows={3}
              defaultValue={itemToEdit?.description || ''}
              placeholder="Tuliskan spesifikasi, daya tampung, atau fasilitas yang ada di dalamnya..."
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className={`w-full text-white transition ${
                itemToEdit ? 'bg-amber-700 hover:bg-amber-800' : 'bg-[#0F2A24] hover:bg-[#173B32]'
              }`}
              icon={itemToEdit ? <Save className="w-4 h-4 text-[#D8C28A]" /> : <Plus className="w-4 h-4 text-[#D8C28A]" />}
            >
              {itemToEdit ? 'Simpan Perubahan Fasilitas' : 'Simpan Fasilitas Baru'}
            </Button>
          </form>
        </div>

        {/* Daftar Fasilitas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider">
              Daftar Fasilitas Terdaftar ({facilities.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const isSelected = itemToEdit?.id === fac.id;
              return (
                <div
                  key={fac.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200'
                  }`}
                >
                  <div className="relative h-40 bg-[#0F2A24] overflow-hidden">
                    <Image
                      src={fac.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                      alt={fac.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F2A24]/90 text-[#D8C28A] backdrop-blur-sm border border-[#D8C28A]/40">
                        {fac.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">
                        Urutan: {fac.displayOrder}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F2A24]">{fac.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {fac.description || 'Tidak ada deskripsi rinci.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aktif di Profil
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/fasilitas?edit=${fac.id}`}
                          className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                          title="Edit Fasilitas Ini"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <form action={deleteFacilityAction}>
                          <input type="hidden" name="id" value={fac.id} />
                          <DeleteConfirmButton confirmMessage={`Hapus fasilitas "${fac.name}"?`} />
                        </form>
                      </div>
                    </div>
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
