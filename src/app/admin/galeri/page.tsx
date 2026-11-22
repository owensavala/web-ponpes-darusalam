import React from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Camera, Plus, Trash2, Edit2, Image as ImageIcon, Save, X } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Kelola Galeri - Admin Darussalam Bacan',
};

interface AdminGaleriProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminGaleriPage({ searchParams }: AdminGaleriProps) {
  const session = await getSession();

  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_UNIT')) {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const unitFilter =
    session.role === 'ADMIN_UNIT' && session.unitId ? { unitId: session.unitId } : {};

  const [albums, units] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where: unitFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        unit: true,
      },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      select: { id: true, shortName: true },
    }),
  ]);

  const itemToEdit = edit ? albums.find((a) => a.id === edit) : null;

  async function saveAlbumAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession) throw new Error('UNAUTHORIZED');

    const albumId = formData.get('albumId') as string | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    let unitId = (formData.get('unitId') as string) || null;
    if (curSession.role === 'ADMIN_UNIT') {
      unitId = curSession.unitId || null;
    }

    const photoUrl = formData.get('photoUrl') as string;
    const caption = formData.get('caption') as string;

    if (albumId) {
      // Mode Update / Edit Album
      const existing = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
      if (curSession.role === 'ADMIN_UNIT' && existing?.unitId !== curSession.unitId) {
        throw new Error('Akses ditolak: Anda tidak memiliki izin mengedit album ini.');
      }

      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data: {
          title,
          description: description || null,
          unitId,
        },
      });

      if (photoUrl) {
        await prisma.galleryItem.create({
          data: {
            albumId,
            url: photoUrl,
            caption: caption || null,
            mediaType: 'IMAGE',
          },
        });
      }
    } else {
      // Mode Create / Tambah Album Baru
      const album = await prisma.galleryAlbum.create({
        data: {
          title,
          description: description || null,
          unitId,
        },
      });

      if (photoUrl) {
        await prisma.galleryItem.create({
          data: {
            albumId: album.id,
            url: photoUrl,
            caption: caption || null,
            mediaType: 'IMAGE',
          },
        });
      }
    }

    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
    redirect('/admin/galeri');
  }

  async function deleteAlbumAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession) throw new Error('UNAUTHORIZED');

    const albumId = formData.get('albumId') as string;
    const existingAlbum = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
    if (curSession.role === 'ADMIN_UNIT' && existingAlbum?.unitId !== curSession.unitId) {
      throw new Error('Akses ditolak: Anda tidak memiliki izin menghapus album ini.');
    }

    await prisma.galleryAlbum.delete({ where: { id: albumId } });
    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#D8C28A]" />
          Kelola Galeri Foto & Video
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tambah, perbarui (edit), atau hapus album kegiatan santri dan dokumentasi visual pesantren.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah / Edit Album */}
        <div className={`lg:col-span-4 bg-white rounded-3xl p-6 border shadow-sm space-y-4 transition ${
          itemToEdit ? 'border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F2A24] flex items-center gap-1.5 uppercase tracking-wider">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-amber-600" />
                  <span>Edit Data Album</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  <span>Tambah Album Baru</span>
                </>
              )}
            </h2>

            {itemToEdit && (
              <Link
                href="/admin/galeri"
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </Link>
            )}
          </div>

          <form action={saveAlbumAction} className="space-y-4 text-xs">
            {itemToEdit && <input type="hidden" name="albumId" value={itemToEdit.id} />}

            <Input
              label="Judul Album"
              name="title"
              placeholder="Contoh: Latihan Hadrah Santri Putra"
              defaultValue={itemToEdit?.title || ''}
              required
            />
            <Textarea
              label="Keterangan Album"
              name="description"
              rows={2}
              defaultValue={itemToEdit?.description || ''}
              placeholder="Deskripsi kegiatan..."
            />

            {session.role === 'SUPER_ADMIN' && (
              <div>
                <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                  Unit Pendidikan
                </label>
                <select
                  name="unitId"
                  defaultValue={itemToEdit?.unitId || ''}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">Umum / Yayasan</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shortName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <ImageUploadField
              label={itemToEdit ? "Tambah Foto Baru ke Album (Opsional)" : "Foto Awal Dokumentasi"}
              name="photoUrl"
              folder="gallery"
              helperText="Unggah foto kegiatan langsung dari HP/Laptop atau tempel URL."
            />
            <Input
              label="Keterangan / Caption Foto"
              name="caption"
              placeholder="Contoh: Suasana latihan sore..."
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
              {itemToEdit ? 'Simpan Perubahan Album' : 'Simpan Album'}
            </Button>
          </form>
        </div>

        {/* List Album & Foto */}
        <div className="lg:col-span-8 space-y-6">
          {albums.map((album) => {
            const isSelected = itemToEdit?.id === album.id;
            return (
              <div
                key={album.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm space-y-4 transition ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {album.unit ? album.unit.shortName : 'Yayasan Pusat'}
                    </span>
                    <h3 className="text-base font-bold text-[#0F2A24] mt-1">{album.title}</h3>
                    {album.description && (
                      <p className="text-xs text-slate-500">{album.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/galeri?edit=${album.id}`}
                      className="text-amber-600 hover:text-amber-800 p-1.5 rounded-lg hover:bg-amber-50 transition border border-transparent hover:border-amber-200"
                      title="Edit Album Ini"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <form action={deleteAlbumAction}>
                      <input type="hidden" name="albumId" value={album.id} />
                      <DeleteConfirmButton confirmMessage={`Apakah Anda yakin ingin menghapus album "${album.title}"?`} />
                    </form>
                  </div>
                </div>

                {/* Grid Foto */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {album.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <Image
                        src={item.url}
                        alt={item.caption || 'Foto'}
                        fill
                        className="object-cover"
                        sizes="150px"
                        unoptimized={item.url.startsWith('/uploads')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
