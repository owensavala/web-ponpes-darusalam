import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Award, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Kelola Prestasi & Alumni - Admin Darussalam Bacan',
};

interface AdminPrestasiProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminPrestasiPage({ searchParams }: AdminPrestasiProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const [achievements, units] = await Promise.all([
    prisma.achievement.findMany({
      orderBy: { year: 'desc' },
      include: { unit: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      select: { id: true, shortName: true },
    }),
  ]);

  const itemToEdit = edit ? achievements.find((a) => a.id === edit) : null;

  async function saveAchievementAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const studentName = formData.get('studentName') as string;
    const year = parseInt(formData.get('year') as string, 10) || new Date().getFullYear();
    const description = formData.get('description') as string;
    const unitId = (formData.get('unitId') as string) || null;
    const imageUrl = (formData.get('imageUrl') as string) || null;

    if (id) {
      // Mode Update / Edit
      await prisma.achievement.update({
        where: { id },
        data: {
          title,
          category,
          studentName: studentName || null,
          year,
          description: description || null,
          imageUrl,
          unitId,
        },
      });
    } else {
      // Mode Create / Tambah Baru
      await prisma.achievement.create({
        data: {
          title,
          category,
          studentName: studentName || null,
          year,
          description: description || null,
          imageUrl,
          unitId,
        },
      });
    }

    revalidatePath('/admin/prestasi');
    revalidatePath('/informasi/prestasi-alumni');
    revalidatePath('/');
    redirect('/admin/prestasi');
  }

  async function deleteAchievementAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string;
    await prisma.achievement.delete({ where: { id } });

    revalidatePath('/admin/prestasi');
    revalidatePath('/informasi/prestasi-alumni');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Award className="w-6 h-6 text-[#D8C28A]" />
          Kelola Prestasi Santri & Sebaran Alumni
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tambah, perbarui (edit), atau hapus pencapaian santri dalam ajang lomba dan rekam jejak sukses alumni.
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
                  <span>Edit Data Prestasi</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  <span>Tambah Data Prestasi / Alumni</span>
                </>
              )}
            </h2>

            {itemToEdit && (
              <Link
                href="/admin/prestasi"
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </Link>
            )}
          </div>

          <form action={saveAchievementAction} className="space-y-4 text-xs">
            {itemToEdit && <input type="hidden" name="id" value={itemToEdit.id} />}

            <Input
              label="Judul Prestasi / Capaian"
              name="title"
              placeholder="Contoh: Juara 1 MTQ 10 Juz atau Studi ke Jerman"
              defaultValue={itemToEdit?.title || ''}
              required
            />

            <Select
              label="Kategori"
              name="category"
              defaultValue={itemToEdit?.category || 'PRESTASI'}
              options={[
                { value: 'PRESTASI', label: 'Prestasi Santri Aktif' },
                { value: 'ALUMNI', label: 'Kiprah / Beasiswa Alumni' },
              ]}
            />

            <Input
              label="Nama Santri / Alumni"
              name="studentName"
              placeholder="Contoh: Ahmad Farhan Mubarak"
              defaultValue={itemToEdit?.studentName || ''}
            />

            <Input
              label="Tahun Perolehan"
              name="year"
              type="number"
              defaultValue={itemToEdit ? itemToEdit.year : new Date().getFullYear()}
              required
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
                <option value="">Umum Pesantren</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName}
                  </option>
                ))}
              </select>
            </div>

            <ImageUploadField
              label="Foto Prestasi / Dokumentasi"
              name="imageUrl"
              folder="general"
              defaultValue={itemToEdit?.imageUrl || ''}
              helperText="Unggah foto piagam/piala dari HP/Laptop atau tempel link URL."
            />

            <Textarea
              label="Deskripsi Lengkap"
              name="description"
              rows={3}
              defaultValue={itemToEdit?.description || ''}
              placeholder="Rincian kejuaraan atau universitas tujuan..."
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
              {itemToEdit ? 'Simpan Perubahan Prestasi' : 'Simpan Data Prestasi'}
            </Button>
          </form>
        </div>

        {/* List Prestasi */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0F2A24] border-b border-slate-100 pb-3">
            Daftar Prestasi & Alumni Terdaftar ({achievements.length})
          </h2>

          <div className="space-y-3">
            {achievements.map((item) => {
              const isSelected = itemToEdit?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition ${
                    isSelected ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' : 'bg-[#FCFAF6] border-slate-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {item.category} • {item.year}
                      </span>
                      {item.unit && (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {item.unit.shortName}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-[#0F2A24] mt-1">{item.title}</h4>
                    {item.studentName && (
                      <p className="text-[11px] font-semibold text-emerald-800">
                        {item.studentName}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600 mt-1">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/prestasi?edit=${item.id}`}
                      className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                      title="Edit Data Prestasi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <form action={deleteAchievementAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <DeleteConfirmButton confirmMessage={`Apakah Anda yakin ingin menghapus data "${item.title}"?`} />
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
