import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Phone,
  QrCode,
  Share2,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal, formatRupiah, PSB_STATUS_CONFIG, formatWaLink } from '@/lib/utils';
import PrintButton from '@/components/public/PrintButton';

interface KartuPageProps {
  params: Promise<{ regNumber: string }>;
}

export async function generateMetadata({ params }: KartuPageProps) {
  const { regNumber } = await params;
  return {
    title: `Kartu Pendaftaran ${regNumber} - Ponpes Darussalam Bacan`,
    description: `Kartu Tanda Pendaftaran Resmi Santri Baru Ponpes Darussalam Kupal, Bacan Selatan.`,
  };
}

export default async function KartuPendaftaranPage({ params }: KartuPageProps) {
  const { regNumber } = await params;

  const registration = await prisma.psbRegistration.findUnique({
    where: { regNumber },
    include: {
      unit: true,
      period: true,
    },
  });

  if (!registration) {
    notFound();
  }

  const settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });
  const statusInfo = PSB_STATUS_CONFIG[registration.status] || PSB_STATUS_CONFIG.PENDING;

  const waPanitiaMsg = `Assalamu'alaikum Panitia PSB Darussalam Bacan, saya ingin konfirmasi pendaftaran dengan No. Registrasi: ${registration.regNumber} atas nama ${registration.fullName}.`;
  const waPanitiaUrl = formatWaLink(settings?.mainWhatsapp, waPanitiaMsg);

  return (
    <div className="bg-[#FAF8F2] py-8 sm:py-14 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Controls (Hidden on Print) */}
        <div className="no-print mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Pendaftaran Berhasil Diterbitkan
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Simpan atau cetak kartu ini sebagai bukti resmi pendaftaran Anda.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <PrintButton />
            <a
              href={waPanitiaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Konfirmasi WA</span>
            </a>
          </div>
        </div>

        {/* KARTU RESMI (Printable Container) */}
        <div className="print-page bg-white rounded-3xl border-2 border-[#0F2A24] shadow-xl p-6 sm:p-10 relative overflow-hidden text-[#0F2A24]">
          {/* Watermark Logo */}
          <div className="absolute right-4 bottom-10 opacity-5 pointer-events-none select-none">
            <BookOpen className="w-80 h-80" />
          </div>

          {/* Kop Surat Resmi */}
          <div className="border-b-4 border-double border-[#0F2A24] pb-5 mb-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A24] text-[#D8C28A] flex items-center justify-center font-bold text-xl border-2 border-[#D8C28A]">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[#0F2A24]">
                  PANITIA PENERIMAAN SANTRI BARU (PSB)
                </h2>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#173B32]">
                  PONDOK PESANTREN DARUSSALAM BACAN
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  YAYASAN DARUSSALAM BACAN &bull; NPYP: {settings?.npyp || 'AZ5439'}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              {settings?.address || 'Jl. Pesantren, Desa Kupal, Kec. Bacan Selatan, Halmahera Selatan, Maluku Utara'} &bull; WA: +{settings?.mainWhatsapp || '6282293883344'}
            </p>
          </div>

          {/* Judul Kartu & Nomor Registrasi */}
          <div className="text-center mb-6 space-y-1.5">
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase bg-[#0F2A24] text-[#F2EEE3] py-1.5 px-4 rounded-xl inline-block">
              KARTU TANDA BUKTI PENDAFTARAN SANTRI BARU
            </h1>
            <div className="text-xs text-slate-500 font-medium">
              {registration.period.name}
            </div>
            <div className="pt-1">
              <span className="text-xs text-slate-500">Nomor Registrasi Resmi:</span>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#0F2A24] tracking-wider">
                {registration.regNumber}
              </div>
            </div>
          </div>

          {/* Status Pendaftaran Banner */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Status Berkas:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                {statusInfo.label}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Tgl Daftar: {formatTanggal(registration.createdAt)}
            </span>
          </div>

          {/* Grid Biodata & Foto */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-200">
            {/* Foto Santri & QR Box */}
            <div className="sm:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative w-36 h-48 rounded-2xl overflow-hidden border-2 border-[#0F2A24] bg-slate-100 shadow-sm flex items-center justify-center">
                {registration.photoUrl ? (
                  <Image
                    src={registration.photoUrl}
                    alt={registration.fullName}
                    fill
                    className="object-cover"
                    sizes="144px"
                    unoptimized={registration.photoUrl.startsWith('/uploads')}
                  />
                ) : (
                  <div className="p-4 text-center">
                    <span className="text-[11px] text-slate-400 block font-semibold">PAS FOTO 3x4</span>
                    <span className="text-[9px] text-slate-400">Tempel foto jika belum diunggah</span>
                  </div>
                )}
              </div>

              {/* QR Verification Placeholder */}
              <div className="p-2 border border-slate-200 rounded-xl bg-white shadow-xs flex flex-col items-center">
                <QrCode className="w-16 h-16 text-[#0F2A24]" />
                <span className="text-[9px] text-slate-500 mt-0.5 font-mono">
                  {registration.regNumber}
                </span>
              </div>
            </div>

            {/* Tabel Data Diri */}
            <div className="sm:col-span-8 space-y-2 text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Unit Pilihan:</span>
                <span className="col-span-2 font-bold text-[#0F2A24]">{registration.unit.name}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tipe Mukim:</span>
                <span className="col-span-2 font-bold text-emerald-800">
                  {registration.isBoarding ? 'Mukim (Tinggal di Asrama)' : 'Non-Mukim (Laju)'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nama Calon Santri:</span>
                <span className="col-span-2 font-black text-sm text-[#0F2A24]">{registration.fullName}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">NIK:</span>
                <span className="col-span-2 font-mono font-bold text-slate-700">{registration.nik}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">NISN:</span>
                <span className="col-span-2 font-mono text-slate-700">{registration.nisn || '-'}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Jenis Kelamin:</span>
                <span className="col-span-2 text-slate-700">
                  {registration.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tempat, Tgl Lahir:</span>
                <span className="col-span-2 text-slate-700">
                  {registration.birthPlace}, {formatTanggal(registration.birthDate)}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Sekolah Asal:</span>
                <span className="col-span-2 text-slate-700">{registration.previousSchool || '-'}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Nama Orang Tua:</span>
                <span className="col-span-2 text-slate-700">
                  Ayah: {registration.fatherName} &bull; Ibu: {registration.motherName}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">No. WhatsApp Wali:</span>
                <span className="col-span-2 font-mono font-bold text-slate-700">{registration.guardianPhone}</span>
              </div>
              <div className="grid grid-cols-3 py-1">
                <span className="text-slate-500 font-medium">Alamat:</span>
                <span className="col-span-2 text-slate-700 leading-relaxed">{registration.address}</span>
              </div>
            </div>
          </div>

          {/* Petunjuk & Jadwal Seleksi */}
          <div className="my-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
            <h4 className="font-bold text-[#0F2A24] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D8C28A]" />
              Petunjuk Pelaksanaan Tes & Wawancara:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
              <li>Membawa Kartu Tanda Pendaftaran ini saat hadir ke lokasi pesantren di Desa Kupal.</li>
              <li>Membawa berkas fisik asli: Fotokopi KK (2 lembar), Fotokopi Akta (2 lembar), Pas Foto (3 lembar).</li>
              <li>Calon santri mengenakan pakaian muslim rapi, sopan, dan menutup aurat (putra: baju koko & peci, putri: busana muslimah & jilbab).</li>
              <li>Jadwal tes sima&apos;an dan wawancara dapat dikonfirmasi via WhatsApp Panitia.</li>
            </ul>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs pt-4">
            <div>
              <p className="text-slate-500 text-[11px]">Orang Tua / Wali Calon Santri,</p>
              <div className="h-16 flex items-end justify-center">
                <span className="border-b border-slate-400 w-40 block" />
              </div>
              <p className="font-bold text-[#0F2A24] mt-1">{registration.fatherName}</p>
            </div>

            <div>
              <p className="text-slate-500 text-[11px]">
                Kupal, {formatTanggal(registration.createdAt)}
                <br />
                Panitia PSB Darussalam Bacan,
              </p>
              <div className="h-16 flex items-end justify-center">
                <span className="border-b border-slate-400 w-40 block" />
              </div>
              <p className="font-bold text-[#0F2A24] mt-1">( Tanda Tangan & Stempel )</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions (Hidden on Print) */}
        <div className="no-print mt-6 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/psb/cek-status"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0F2A24] hover:bg-slate-50 transition shadow-sm"
            >
              Halaman Cek Status Kelulusan ↗
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#0F2A24] text-white text-xs font-bold hover:bg-[#173B32] transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
