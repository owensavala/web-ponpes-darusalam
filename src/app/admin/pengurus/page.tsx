import React from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Users, Plus, Trash2, Edit2, ShieldCheck, CheckCircle2, Save, X } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Kelola Pengurus & Asatidz - Admin Darussalam Bacan',
};

interface AdminPengurusProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminPengurusPage({ searchParams }: AdminPengurusProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const leaders = await prisma.leadership.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const itemToEdit = edit ? leaders.find((l) => l.id === edit) : null;

  async function saveLeaderAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string | null;
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const category = formData.get('category') as string;
    const bio = formData.get('bio') as string;
    const photoUrl = (formData.get('photoUrl') as string) || null;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || 0;

    if (id) {
      // Mode Update / Edit
      await prisma.leadership.update({
        where: { id },
        data: {
          name,
          position,
          category,
          bio: bio || null,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          displayOrder,
        },
      });
    } else {
      // Mode Create / Tambah Baru
      await prisma.leadership.create({
        data: {
          name,
          position,
          category,
          bio: bio || null,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          displayOrder,
        },
      });
    }

    revalidatePath('/admin/pengurus');
    revalidatePath('/profil/pengasuh-pengurus');
    revalidatePath('/');
    redirect('/admin/pengurus');
  }

  async function deleteLeaderAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') throw new Error('UNAUTHORIZED');

    const id = formData.get('id') as string;
    await prisma.leadership.delete({ where: { id } });

    revalidatePath('/admin/pengurus');
    revalidatePath('/profil/pengasuh-pengurus');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#D8C28A]" />
            Kelola Pengasuh, Pimpinan & Asatidz
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan, perbarui (edit), atau hapus kyai, dewan pembina yayasan, kepala unit, dan dewan asatidz.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Tambah / Edit Tokoh */}
        <div className={`bg-white rounded-3xl p-6 border shadow-sm lg:col-span-1 transition ${
          itemToEdit ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider flex items-center gap-2">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Edit Data Tokoh</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  <span>Tambah Tokoh Baru</span>
                </>
              )}
            </h2>

            {itemToEdit && (
              <Link
                href="/admin/pengurus"
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </Link>
            )}
          </div>

          <form action={saveLeaderAction} className="space-y-4">
            {itemToEdit && <input type="hidden" name="id" value={itemToEdit.id} />}

            <Input
              label="Nama Lengkap & Gelar"
              name="name"
              placeholder="Misal: KH. Asep Sofyan, Lc., M.Pd.I"
              defaultValue={itemToEdit?.name || ''}
              required
            />

            <Input
              label="Jabatan / Amanah"
              name="position"
              placeholder="Misal: Pengasuh Pondok Pesantren"
              defaultValue={itemToEdit?.position || ''}
              required
            />

            <Select
              label="Kelompok Struktur"
              name="category"
              defaultValue={itemToEdit?.category || 'PENGASUH'}
              options={[
                { value: 'PENGASUH', label: 'Pengasuh Utama Pesantren' },
                { value: 'YAYASAN', label: 'Dewan Yayasan Darussalam' },
                { value: 'KEPALA_UNIT', label: 'Pimpinan / Kepala Unit Pendidikan' },
                { value: 'ASATIDZ', label: 'Dewan Guru & Musyrif Asrama' },
              ]}
              required
            />

            <ImageUploadField
              label="Foto Tokoh / Asatidz"
              name="photoUrl"
              folder="general"
              defaultValue={itemToEdit?.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
              helperText="Unggah pas foto dari HP/Laptop atau tempelkan link URL."
            />

            <Input
              label="Nomor Urutan Tampil"
              name="displayOrder"
              type="number"
              defaultValue={itemToEdit ? itemToEdit.displayOrder : leaders.length + 1}
              required
            />

            <Textarea
              label="Biografi Singkat / Riwayat Pendidikan"
              name="bio"
              rows={3}
              defaultValue={itemToEdit?.bio || ''}
              placeholder="Alumnus Al-Azhar Kairo / Universitas Islam Negeri, mengajar tafsir dan hadits..."
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
              {itemToEdit ? 'Simpan Perubahan Tokoh' : 'Simpan Data Tokoh'}
            </Button>
          </form>
        </div>

        {/* Daftar Tokoh Terdaftar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider">
              Daftar Pengurus & Asatidz Terdaftar ({leaders.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leaders.map((leader) => {
              const isSelected = itemToEdit?.id === leader.id;
              return (
                <div
                  key={leader.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0F2A24] shrink-0 border border-[#D8C28A]/40">
                      <Image
                        src={leader.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                        alt={leader.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#173B32] border border-emerald-200">
                          {leader.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Urut #{leader.displayOrder}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F2A24] mt-1 truncate">{leader.name}</h3>
                      <p className="text-[11px] text-[#D8C28A] font-semibold">{leader.position}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1 mr-2">
                      {leader.bio || 'Tidak ada biografi singkat.'}
                    </p>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/admin/pengurus?edit=${leader.id}`}
                        className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                        title="Edit Data Tokoh"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <form action={deleteLeaderAction}>
                        <input type="hidden" name="id" value={leader.id} />
                        <DeleteConfirmButton confirmMessage={`Hapus tokoh "${leader.name}"?`} />
                      </form>
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
