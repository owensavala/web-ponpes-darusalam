import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Phone,
  Calendar,
  Building,
  User,
  Users,
  ExternalLink,
  Printer,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { formatTanggal, PSB_STATUS_CONFIG, formatWaLink } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface PsbDetailProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Verifikasi Berkas Santri - Admin Darussalam Bacan',
};

export default async function AdminPsbDetailPage({ params }: PsbDetailProps) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;

  const registration = await prisma.psbRegistration.findUnique({
    where: { id },
    include: {
      unit: true,
      period: true,
    },
  });

  if (!registration) {
    notFound();
  }

  const registrationUnitId = registration.unitId;
  const registrationRegNumber = registration.regNumber;

  // RBAC check: Jika ADMIN_UNIT, pastikan pendaftar ini di unit miliknya
  if (session.role === 'ADMIN_UNIT' && (!session.unitId || registrationUnitId !== session.unitId)) {
    redirect('/admin/psb');
  }

  const statusInfo = PSB_STATUS_CONFIG[registration.status] || PSB_STATUS_CONFIG.PENDING;

  // Server Action untuk update status & catatan
  async function updateStatusAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession) throw new Error('UNAUTHORIZED');
    if (curSession.role === 'ADMIN_UNIT' && (!curSession.unitId || registrationUnitId !== curSession.unitId)) {
      throw new Error('Akses ditolak: Anda tidak memiliki wewenang memverifikasi pendaftar unit lain.');
    }

    const newStatus = formData.get('status') as string;
    const adminNotes = formData.get('adminNotes') as string;

    await prisma.psbRegistration.update({
      where: { id },
      data: {
        status: newStatus,
        adminNotes: adminNotes || null,
        verifiedAt: new Date(),
      },
    });

    revalidatePath(`/admin/psb/${id}`);
    revalidatePath('/admin/psb');
    revalidatePath(`/psb/kartu/${registrationRegNumber}`);
    revalidatePath('/psb/cek-status');
  }

  const waGuardianMsg = `Assalamu'alaikum Warahmatullahi Wabarakatuh, Bapak/Ibu ${registration.fatherName} (Wali dari ${registration.fullName}). Kami dari Panitia PSB Pondok Pesantren Darussalam Bacan mengonfirmasi bahwa status pendaftaran Anda saat ini: ${statusInfo.label}. ${registration.adminNotes ? `Catatan: ${registration.adminNotes}` : ''}`;
  const waGuardianUrl = formatWaLink(registration.guardianPhone, waGuardianMsg);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/psb"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pendaftar</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/psb/kartu/${registration.regNumber}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#0F2A24] text-xs font-semibold hover:bg-slate-50 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Lihat Kartu Cetak ↗</span>
          </Link>
          <a
            href={waGuardianUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Chat Wali Santri</span>
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Data Diri & Berkas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {registration.regNumber}
                </span>
                <h1 className="text-xl font-black text-[#0F2A24] mt-0.5">
                  {registration.fullName}
                </h1>
                <p className="text-xs text-slate-500">
                  Unit: <strong>{registration.unit.name}</strong> &bull; {registration.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim'}
                </p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.badgeClass}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Biodata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">NIK Santri:</span>
                <span className="font-mono font-bold text-slate-800">{registration.nik}</span>
              </div>
              <div>
                <span className="text-slate-400 block">NISN:</span>
                <span className="font-mono text-slate-800">{registration.nisn || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Jenis Kelamin:</span>
                <span className="text-slate-800">
                  {registration.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">TTL:</span>
                <span className="text-slate-800">
                  {registration.birthPlace}, {formatTanggal(registration.birthDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Asal Sekolah:</span>
                <span className="text-slate-800">{registration.previousSchool || '-'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Waktu Mendaftar:</span>
                <span className="text-slate-800">{formatTanggal(registration.createdAt)}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block">Alamat Domisili:</span>
                <span className="text-slate-800 leading-relaxed">{registration.address}</span>
              </div>
            </div>

            {/* Data Orang Tua */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-[#0F2A24] uppercase tracking-wider">
                Orang Tua / Wali
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Nama Ayah & Ibu:</span>
                  <span className="font-bold text-slate-800">
                    {registration.fatherName} & {registration.motherName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">No. WhatsApp Wali:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {registration.guardianPhone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pekerjaan Wali:</span>
                  <span className="text-slate-800">{registration.guardianJob || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dokumen Terunggah */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-[#0F2A24] uppercase tracking-wider border-b border-slate-100 pb-3">
              Pratinjau Berkas Terunggah
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pas Foto */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-[#0F2A24] block">Pas Foto Santri:</span>
                {registration.photoUrl ? (
                  <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={registration.photoUrl}
                      alt="Pas Foto"
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized={registration.photoUrl.startsWith('/uploads')}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Belum diunggah.</p>
                )}
              </div>

              {/* Kartu Keluarga */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-[#0F2A24] block">Kartu Keluarga (KK):</span>
                {registration.kkUrl ? (
                  registration.kkUrl.endsWith('.pdf') ? (
                    <a
                      href={registration.kkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-48 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center gap-2 text-rose-700 hover:bg-rose-100 transition"
                    >
                      <FileText className="w-10 h-10" />
                      <span className="text-xs font-bold">Buka Dokumen PDF ↗</span>
                    </a>
                  ) : (
                    <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={registration.kkUrl}
                        alt="KK"
                        fill
                        className="object-contain"
                        sizes="200px"
                        unoptimized={registration.kkUrl.startsWith('/uploads')}
                      />
                    </div>
                  )
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Belum diunggah.</p>
                )}
              </div>

              {/* Akta Kelahiran */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-[#0F2A24] block">Akta Kelahiran:</span>
                {registration.aktaUrl ? (
                  registration.aktaUrl.endsWith('.pdf') ? (
                    <a
                      href={registration.aktaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-48 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center gap-2 text-rose-700 hover:bg-rose-100 transition"
                    >
                      <FileText className="w-10 h-10" />
                      <span className="text-xs font-bold">Buka Dokumen PDF ↗</span>
                    </a>
                  ) : (
                    <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={registration.aktaUrl}
                        alt="Akta"
                        fill
                        className="object-contain"
                        sizes="200px"
                        unoptimized={registration.aktaUrl.startsWith('/uploads')}
                      />
                    </div>
                  )
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Belum diunggah.</p>
                )}
              </div>

              {/* Ijazah / SKL */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-[#0F2A24] block">Ijazah / SKL:</span>
                {registration.ijazahUrl ? (
                  registration.ijazahUrl.endsWith('.pdf') ? (
                    <a
                      href={registration.ijazahUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-48 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center gap-2 text-rose-700 hover:bg-rose-100 transition"
                    >
                      <FileText className="w-10 h-10" />
                      <span className="text-xs font-bold">Buka Dokumen PDF ↗</span>
                    </a>
                  ) : (
                    <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={registration.ijazahUrl}
                        alt="Ijazah"
                        fill
                        className="object-contain"
                        sizes="200px"
                        unoptimized={registration.ijazahUrl.startsWith('/uploads')}
                      />
                    </div>
                  )
                ) : (
                  <p className="text-xs text-slate-400 italic py-6 text-center">Belum diunggah.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tindakan Verifikasi & Ubah Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F2A24] border-b border-slate-100 pb-3">
              Perbarui Status & Catatan
            </h3>

            <form action={updateStatusAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                  Pilih Status Pendaftaran
                </label>
                <select
                  name="status"
                  defaultValue={registration.status}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F2A24]"
                >
                  <option value="PENDING">Menunggu Verifikasi</option>
                  <option value="VERIFIED">Berkas Terverifikasi</option>
                  <option value="REVISION">Perlu Perbaikan Berkas</option>
                  <option value="ACCEPTED">Selamat, DITERIMA!</option>
                  <option value="REJECTED">Belum Diterima</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                  Catatan Panitia (Bisa Dilihat Santri)
                </label>
                <textarea
                  name="adminNotes"
                  defaultValue={registration.adminNotes || ''}
                  rows={4}
                  placeholder="Contoh: Berkas valid. Silakan hadir tes sima'an hari Sabtu pukul 09.00 WIT."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2A24]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Catatan ini akan tampil di kartu dan halaman cek status santri.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full bg-[#0F2A24] hover:bg-[#173B32] text-white"
              >
                Simpan Perubahan Status
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
