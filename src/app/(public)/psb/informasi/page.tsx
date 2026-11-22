import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  HelpCircle,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal, formatRupiah } from '@/lib/utils';

export const metadata = {
  title: 'Informasi, Alur & Biaya PSB',
  description: 'Informasi lengkap pendaftaran santri baru Yayasan Darussalam Bacan TA 2026/2027: alur, syarat berkas, dan rincian biaya.',
};

export default async function PsbInformasiPage() {
  const [units, period] = await Promise.all([
    prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.psbPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Penerimaan Santri Baru TA 2026/2027</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Informasi, Alur & Biaya Pendaftaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Panduan lengkap pendaftaran santri baru secara online untuk seluruh jenjang di bawah naungan Yayasan Darussalam Bacan.
          </p>
        </div>

        {/* Status Periode Aktif Banner */}
        {period && (
          <div className="bg-gradient-to-r from-[#0F2A24] to-[#173B32] text-[#F2EEE3] rounded-3xl p-6 sm:p-8 border border-[#266052] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-[#D8C28A] uppercase tracking-wider">
                Periode Pendaftaran Sedang Berlangsung
              </span>
              <h3 className="text-xl font-black text-white">{period.name}</h3>
              <p className="text-xs text-[#8FA39B]">
                Jadwal: {formatTanggal(period.startDate)} s/d {formatTanggal(period.endDate)}
              </p>
            </div>
            <Link
              href="/psb/daftar"
              className="px-6 py-3 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-xs sm:text-sm shadow-lg transition shrink-0"
            >
              Daftar Sekarang ↗
            </Link>
          </div>
        )}

        {/* 4 Langkah Alur Pendaftaran */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D8C28A]" />
              Alur 4 Langkah Pendaftaran Online
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2A24] text-[#D8C28A] font-black text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-bold text-[#0F2A24]">Isi Formulir Online</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pilih unit pendidikan yang dituju, lengkapi identitas calon santri dan orang tua.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2A24] text-[#D8C28A] font-black text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-bold text-[#0F2A24]">Unggah Berkas</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Upload scan/foto Pas Foto, Kartu Keluarga (KK), Akta Kelahiran, dan Ijazah/SKL.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2A24] text-[#D8C28A] font-black text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-bold text-[#0F2A24]">Cetak Kartu Peserta</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Sistem otomatis menerbitkan Nomor Registrasi dan Kartu Pendaftaran resmi siap cetak / PDF.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0F2A24] text-[#D8C28A] font-black text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="text-xs font-bold text-[#0F2A24]">Tes & Wawancara</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Verifikasi berkas, tes baca Qur&apos;an, dan konfirmasi kelulusan via portal atau WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Biaya Pendaftaran per Unit */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D8C28A]" />
              Tabel Rincian Biaya per Unit Pendidikan
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Unit Pendidikan</th>
                  <th className="py-3 px-4">Jenjang</th>
                  <th className="py-3 px-4">Biaya Pendaftaran</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map((unit, idx) => (
                  <tr key={unit.slug} className="hover:bg-[#FCFAF6]">
                    <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0F2A24]">
                      {unit.name}
                      {unit.npsn && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          NPSN: {unit.npsn}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{unit.level}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      {formatRupiah(unit.registrationFee)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/psb/daftar?unit=${unit.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-[#0F2A24] text-[#F2EEE3] text-[11px] font-bold hover:bg-[#173B32] transition"
                      >
                        Pilih Unit ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Syarat Berkas Administrasi */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#D8C28A]" />
            Dokumen Berkas yang Perlu Disiapkan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Pas Foto Santri:</strong> Berpakaian rapi / berpeci / berjilbab, ukuran foto standar formal (JPG/PNG).
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Kartu Keluarga (KK):</strong> Scan atau foto asli yang memuat data orang tua dan calon santri (PDF/JPG).
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Akta Kelahiran:</strong> Scan atau foto asli Akta Kelahiran dari Disdukcapil (PDF/JPG).
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ijazah / SKL:</strong> Ijazah terakhir atau Surat Keterangan Lulus dari sekolah sebelumnya.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
