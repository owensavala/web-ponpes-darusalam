import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, BookOpen, Award, ArrowRight } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Pengasuh & Dewan Pengurus',
  description: 'Profil KH. Asep Sofyan, Lc., M.Pd.I, Bapak Yahya Haji, serta jajaran pimpinan unit dan asatidz Pondok Pesantren Darussalam Bacan.',
};

export default async function PengasuhPengurusPage() {
  const leaders = await prisma.leadership.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const pengasuh = leaders.filter((l) => l.category === 'PENGASUH');
  const yayasan = leaders.filter((l) => l.category === 'YAYASAN');
  const kepalaUnit = leaders.filter((l) => l.category === 'KEPALA_UNIT');

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Users className="w-3.5 h-3.5" />
            <span>Struktur Kepemimpinan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Pengasuh & Dewan Pengurus
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Sosok para asatidz, ulama, dan pimpinan yang mengabdikan diri mendidik santri dan memajukan peradaban Islam di Halmahera Selatan.
          </p>
        </div>

        {/* Section 1: Pengasuh Pondok Pesantren (Featured) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-black text-[#0F2A24] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8C28A]" />
              Pengasuh Pondok Pesantren
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pengasuh.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-[#0F2A24] shrink-0 border-2 border-[#D8C28A] shadow">
                  <Image
                    src={
                      person.photoUrl ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-[#173B32] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {person.position}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0F2A24]">
                    {person.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Yayasan Darussalam Bacan */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-black text-[#0F2A24] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8C28A]" />
              Pimpinan Yayasan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {yayasan.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6"
              >
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-[#0F2A24] shrink-0 border-2 border-[#D8C28A] shadow">
                  <Image
                    src={
                      person.photoUrl ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={person.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-[#173B32] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {person.position}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0F2A24]">
                    {person.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Kepala Unit Pendidikan */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-xl font-black text-[#0F2A24] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8C28A]" />
              Kepala & Pimpinan Unit Pendidikan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kepalaUnit.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F2A24] text-[#D8C28A] flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#173B32] uppercase">
                    {person.position}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F2A24] mt-0.5">
                    {person.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
