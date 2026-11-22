import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, GraduationCap, Sparkles, Building } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Prestasi Santri & Sebaran Alumni',
  description: 'Rekam jejak kejuaraan santri dan kesuksesan alumni Ponpes Darussalam Bacan hingga studi lanjut ke Jerman.',
};

export default async function PrestasiAlumniPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { year: 'desc' },
    include: { unit: true },
  });

  const prestasi = achievements.filter((a) => a.category === 'PRESTASI');
  const alumni = achievements.filter((a) => a.category === 'ALUMNI');

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Kiprah & Rekam Jejak</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Prestasi Santri & Sebaran Alumni
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Melangkah dari Desa Kupal di Halmahera Selatan menuju panggung prestasi daerah, nasional, hingga kancah internasional.
          </p>
        </div>

        {/* Featured Story: Santri ke Jerman */}
        <div className="bg-gradient-to-br from-[#0F2A24] to-[#173B32] text-[#F2EEE3] rounded-3xl p-8 sm:p-12 border border-[#266052] shadow-xl relative overflow-hidden bg-islamic-pattern">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#D8C28A] uppercase tracking-wider bg-[#081714] px-3 py-1 rounded-full border border-[#D8C28A]/40 inline-block">
              Sorotan Prestasi Global
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Santri Darussalam Bacan Tembus Beasiswa Studi Lanjut ke Jerman
            </h2>
            <p className="text-xs sm:text-sm text-[#8FA39B] leading-relaxed">
              Alumni MA Darussalam Bacan berhasil menorehkan prestasi gemilang dengan lolos seleksi beasiswa studi teknik di universitas terkemuka di Jerman. Mengukuhkan komitmen pesantren bahwa hafizh Qur&apos;an mampu berdaya saing global dan menguasai teknologi modern.
            </p>
            <div className="pt-2">
              <Link
                href="/informasi/berita/santri-darussalam-bacan-studi-lanjut-ke-jerman"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8C28A] text-[#0F2A24] text-xs font-bold hover:bg-[#C5A55D] transition"
              >
                <span>Baca Berita Selengkapnya</span>
                <Sparkles className="w-4 h-4 text-[#0F2A24]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 1: Sebaran Alumni */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-[#0F2A24] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#D8C28A]" />
              Kiprah & Sebaran Alumni
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    Alumni Tahun {item.year}
                  </span>
                  {item.unit && (
                    <span className="text-slate-400 font-medium">{item.unit.shortName}</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#0F2A24]">{item.title}</h3>
                {item.studentName && (
                  <p className="text-xs font-semibold text-[#173B32]">{item.studentName}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Kejuaraan & Prestasi */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-[#0F2A24] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D8C28A]" />
              Kejuaraan & Prestasi Santri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestasi.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
                    Tahun {item.year}
                  </span>
                  {item.unit && (
                    <span className="text-slate-400 font-medium">{item.unit.shortName}</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#0F2A24]">{item.title}</h3>
                {item.studentName && (
                  <p className="text-xs font-semibold text-emerald-800">{item.studentName}</p>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
