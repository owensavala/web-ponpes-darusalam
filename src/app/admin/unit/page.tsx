import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Building, Save, CheckCircle2, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Kelola Unit Pendidikan - Admin Darussalam Bacan',
};

interface AdminUnitProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminUnitPage({ searchParams }: AdminUnitProps) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await searchParams;

  const isSuperAdmin = session.role === 'SUPER_ADMIN';
  const isAdminUnit = session.role === 'ADMIN_UNIT';

  // Tentukan unit mana yang diedit (ADMIN_UNIT terkunci mutlak ke unit miliknya)
  let currentUnitId = id;
  if (isAdminUnit) {
    currentUnitId = session.unitId || undefined;
  }

  const units = await prisma.educationUnit.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const selectedUnit = isAdminUnit
    ? units.find((u) => u.id === session.unitId) || units[0]
    : units.find((u) => u.id === currentUnitId) || units[0];

  async function updateUnitAction(formData: FormData) {
    'use server';
    const currentSession = await getSession();
    if (!currentSession) throw new Error('UNAUTHORIZED');

    const unitId = formData.get('unitId') as string;
    if (currentSession.role === 'ADMIN_UNIT' && currentSession.unitId !== unitId) {
      throw new Error('Akses ditolak: Anda hanya dapat mengubah unit pendidikan Anda sendiri.');
    }
    const name = formData.get('name') as string;
    const shortName = formData.get('shortName') as string;
    const level = formData.get('level') as string;
    const npsn = formData.get('npsn') as string;
    const accreditation = formData.get('accreditation') as string;
    const headmasterName = formData.get('headmasterName') as string;
    const headmasterPhoto = (formData.get('headmasterPhoto') as string) || null;
    const heroImageUrl = (formData.get('heroImageUrl') as string) || null;
    const tagline = formData.get('tagline') as string;
    const description = formData.get('description') as string;
    const vision = formData.get('vision') as string;
    const mission = formData.get('mission') as string;
    const curriculum = formData.get('curriculum') as string;
    const dailySchedule = formData.get('dailySchedule') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const registrationFee = parseInt(formData.get('registrationFee') as string, 10) || 0;
    const isPsbOpen = formData.get('isPsbOpen') === 'true';

    await prisma.educationUnit.update({
      where: { id: unitId },
      data: {
        name,
        shortName,
        level,
        npsn: npsn || null,
        accreditation: accreditation || null,
        headmasterName: headmasterName || null,
        headmasterPhoto,
        heroImageUrl,
        tagline: tagline || null,
        description,
        vision: vision || null,
        mission: mission || null,
        curriculum: curriculum || null,
        dailySchedule: dailySchedule || null,
        whatsappNumber: whatsappNumber || null,
        registrationFee,
        isPsbOpen,
      },
    });

    revalidatePath(`/admin/unit?id=${unitId}`);
    revalidatePath(`/unit/${selectedUnit.slug}`);
    revalidatePath('/psb/informasi');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Building className="w-6 h-6 text-[#D8C28A]" />
          Kelola Profil Unit Pendidikan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur informasi resmi, kurikulum, legalitas (NPSN, Akreditasi), dan kontak operator masing-masing unit.
        </p>
      </div>

      {/* Unit Selector Tabs (Khusus SUPER_ADMIN) */}
      {isSuperAdmin && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {units.map((u) => (
            <a
              key={u.id}
              href={`/admin/unit?id=${u.id}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedUnit.id === u.id
                  ? 'bg-[#0F2A24] text-[#D8C28A] shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {u.shortName}
            </a>
          ))}
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <form action={updateUnitAction} className="space-y-6">
          <input type="hidden" name="unitId" value={selectedUnit.id} />

          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">{selectedUnit.name}</h2>
              <span className="text-[11px] text-slate-500 font-mono">slug: /unit/{selectedUnit.slug}</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4 text-[#D8C28A]" />}
              className="bg-[#0F2A24] hover:bg-[#173B32] text-white"
            >
              Simpan Perubahan
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nama Lengkap Unit"
              name="name"
              defaultValue={selectedUnit.name}
              required
            />
            <Input
              label="Nama Singkat (Label Tab)"
              name="shortName"
              defaultValue={selectedUnit.shortName}
              required
            />
            <Input
              label="Jenjang Pendidikan"
              name="level"
              defaultValue={selectedUnit.level}
              required
            />
            <Input
              label="NPSN (Nomor Pokok Sekolah Nasional)"
              name="npsn"
              defaultValue={selectedUnit.npsn || ''}
              placeholder="Contoh: 70058312"
            />
            <Input
              label="Status Akreditasi"
              name="accreditation"
              defaultValue={selectedUnit.accreditation || ''}
              placeholder="Contoh: A, B, C, atau Dalam Proses"
            />
            <Input
              label="Nama Kepala Unit / Pimpinan"
              name="headmasterName"
              defaultValue={selectedUnit.headmasterName || ''}
            />
            <Input
              label="No. WhatsApp Operator Unit"
              name="whatsappNumber"
              defaultValue={selectedUnit.whatsappNumber || ''}
              placeholder="Format: 628xxxx"
            />
            <Input
              label="Biaya Pendaftaran Santri Baru (Rp)"
              name="registrationFee"
              type="number"
              defaultValue={selectedUnit.registrationFee}
              required
            />

            <ImageUploadField
              label="Foto Kepala Unit / Pimpinan"
              name="headmasterPhoto"
              folder="units"
              defaultValue={selectedUnit.headmasterPhoto}
              helperText="Unggah foto formal pimpinan dari HP/Laptop atau tempel link URL."
            />

            <ImageUploadField
              label="Foto Banner / Sampul Mini-Site Unit"
              name="heroImageUrl"
              folder="units"
              defaultValue={selectedUnit.heroImageUrl}
              helperText="Unggah foto gedung/kegiatan unit atau tempel link URL."
            />

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                Status Penerimaan Santri Baru (PSB)
              </label>
              <select
                name="isPsbOpen"
                defaultValue={selectedUnit.isPsbOpen ? 'true' : 'false'}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white"
              >
                <option value="true">Buka Pendaftaran (Dibuka)</option>
                <option value="false">Tutup Pendaftaran (Ditutup)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Motto / Tagline Unit"
                name="tagline"
                defaultValue={selectedUnit.tagline || ''}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Deskripsi Profil Unit"
                name="description"
                rows={4}
                defaultValue={selectedUnit.description}
                required
              />
            </div>

            <Textarea
              label="Visi Unit"
              name="vision"
              rows={3}
              defaultValue={selectedUnit.vision || ''}
            />

            <Textarea
              label="Misi Unit"
              name="mission"
              rows={3}
              defaultValue={selectedUnit.mission || ''}
            />

            <div className="sm:col-span-2">
              <Textarea
                label="Kurikulum & Program Pembelajaran (Mendukung Markdown)"
                name="curriculum"
                rows={5}
                defaultValue={selectedUnit.curriculum || ''}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Jadwal Rutinitas Santri Harian (Khusus Asrama/Pondok)"
                name="dailySchedule"
                rows={5}
                defaultValue={selectedUnit.dailySchedule || ''}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4 text-[#D8C28A]" />}
              className="bg-[#0F2A24] hover:bg-[#173B32] text-white"
            >
              Simpan Profil {selectedUnit.shortName}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
