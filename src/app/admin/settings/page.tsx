import React from 'react';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Settings, Save, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import ImageUploadField from '@/components/admin/ImageUploadField';

export const metadata = {
  title: 'Pengaturan Global - Admin Darussalam Bacan',
};

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin?error=forbidden');
  }

  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  async function updateSettingsAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') {
      throw new Error('Akses ditolak: Hanya Super Admin yang diizinkan memperbarui pengaturan yayasan.');
    }
    const siteName = formData.get('siteName') as string;
    const foundationName = formData.get('foundationName') as string;
    const npyp = formData.get('npyp') as string;
    const skMenkumham = formData.get('skMenkumham') as string;
    const address = formData.get('address') as string;
    const mainWhatsapp = formData.get('mainWhatsapp') as string;
    const email = formData.get('email') as string;
    const heroTagline = formData.get('heroTagline') as string;
    const heroImageUrl = (formData.get('heroImageUrl') as string) || null;

    const greetingName = formData.get('greetingName') as string;
    const greetingTitle = formData.get('greetingTitle') as string;
    const greetingText = formData.get('greetingText') as string;
    const greetingPhotoUrl = (formData.get('greetingPhotoUrl') as string) || null;

    const historyText = formData.get('historyText') as string;
    const visionText = formData.get('visionText') as string;
    const missionText = formData.get('missionText') as string;

    const instagramUrl = formData.get('instagramUrl') as string;
    const facebookUrl = formData.get('facebookUrl') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;

    await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        siteName,
        foundationName,
        npyp,
        skMenkumham: skMenkumham || null,
        address,
        mainWhatsapp,
        email,
        heroTagline,
        heroImageUrl,
        greetingName,
        greetingTitle,
        greetingText,
        greetingPhotoUrl,
        historyText,
        visionText,
        missionText,
        instagramUrl: instagramUrl || null,
        facebookUrl: facebookUrl || null,
        youtubeUrl: youtubeUrl || null,
      },
      create: {
        id: 'default',
        siteName,
        foundationName,
        npyp,
        skMenkumham: skMenkumham || null,
        address,
        mainWhatsapp,
        email,
        heroTagline,
        heroImageUrl,
        greetingName,
        greetingTitle,
        greetingText,
        greetingPhotoUrl,
        historyText,
        visionText,
        missionText,
      },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/profil/sejarah-visi-misi');
    revalidatePath('/profil/pengasuh-pengurus');
    revalidatePath('/kontak');
    revalidatePath('/');
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#D8C28A]" />
          Pengaturan Global Yayasan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola identitas kelembagaan, sambutan pengasuh pondok, alamat, dan media sosial.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <form action={updateSettingsAction} className="space-y-8">
          {/* Identitas Dasar */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Identitas Badan Hukum & Kontak
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lembaga / Situs"
                name="siteName"
                defaultValue={settings?.siteName}
                required
              />
              <Input
                label="Nama Badan Hukum Yayasan"
                name="foundationName"
                defaultValue={settings?.foundationName}
                required
              />
              <Input
                label="NPYP (Nomor Pokok Yayasan Pendidikan)"
                name="npyp"
                defaultValue={settings?.npyp}
                required
              />
              <Input
                label="Nomor SK Kemenkumham RI"
                name="skMenkumham"
                defaultValue={settings?.skMenkumham || 'AHU 00147.50.10.2014'}
                placeholder="Contoh: AHU 00147.50.10.2014"
              />
              <Input
                label="Nomor WhatsApp Utama Yayasan"
                name="mainWhatsapp"
                defaultValue={settings?.mainWhatsapp}
                required
              />
              <Input
                label="Alamat Surel / Email Resmi"
                name="email"
                defaultValue={settings?.email}
                required
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Alamat Lengkap Kampus Pesantren"
                  name="address"
                  rows={2}
                  defaultValue={settings?.address}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Tagline Hero Utama"
                  name="heroTagline"
                  defaultValue={settings?.heroTagline}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Foto Latar Hero Beranda"
                  name="heroImageUrl"
                  folder="general"
                  defaultValue={settings?.heroImageUrl}
                  helperText="Unggah foto panorama pondok pesantren untuk latar belakang beranda utama."
                />
              </div>
            </div>
          </div>

          {/* Sambutan Pengasuh */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Sambutan Pengasuh Pondok Pesantren
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Pengasuh Pondok"
                name="greetingName"
                defaultValue={settings?.greetingName}
                required
              />
              <Input
                label="Judul Sambutan"
                name="greetingTitle"
                defaultValue={settings?.greetingTitle}
                required
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Teks Kalam / Sambutan Pengasuh"
                  name="greetingText"
                  rows={6}
                  defaultValue={settings?.greetingText}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Foto KH. Asep Sofyan (Pengasuh)"
                  name="greetingPhotoUrl"
                  folder="general"
                  defaultValue={settings?.greetingPhotoUrl}
                  helperText="Unggah foto formal Pengasuh Pondok untuk ditampilkan di kotak sambutan beranda."
                />
              </div>
            </div>
          </div>

          {/* Visi, Misi & Sejarah */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Sejarah, Visi & Misi Yayasan
            </h2>
            <div className="space-y-4">
              <Textarea
                label="Teks Sejarah Singkat"
                name="historyText"
                rows={4}
                defaultValue={settings?.historyText || ''}
              />
              <Textarea
                label="Teks Visi Lembaga"
                name="visionText"
                rows={3}
                defaultValue={settings?.visionText || ''}
              />
              <Textarea
                label="Teks Misi Lembaga"
                name="missionText"
                rows={5}
                defaultValue={settings?.missionText || ''}
              />
            </div>
          </div>

          {/* Media Sosial */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider border-b border-slate-100 pb-2">
              4. Akun Media Sosial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="URL Instagram"
                name="instagramUrl"
                defaultValue={settings?.instagramUrl || ''}
                placeholder="https://instagram.com/..."
              />
              <Input
                label="URL Facebook"
                name="facebookUrl"
                defaultValue={settings?.facebookUrl || ''}
                placeholder="https://facebook.com/..."
              />
              <Input
                label="URL YouTube"
                name="youtubeUrl"
                defaultValue={settings?.youtubeUrl || ''}
                placeholder="https://youtube.com/@..."
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
              Simpan Pengaturan Yayasan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
