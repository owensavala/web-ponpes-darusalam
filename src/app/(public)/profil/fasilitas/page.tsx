import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building, Sparkles, CheckCircle2 } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Sarana & Fasilitas',
  description: 'Fasilitas Masjid Jami Darussalam, Kompleks Asrama Putra & Putri, Ruang Kelas, dan Laboratorium di Ponpes Darussalam Kupal.',
};

export default async function FasilitasPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Building className="w-3.5 h-3.5" />
            <span>Sarana Prasarana</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Fasilitas Kampus Pesantren
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Mendukung ekosistem belajar yang asri, kondusif, dan nyaman bagi para santri mukim di Desa Kupal, Halmahera Selatan.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-[#0F2A24] overflow-hidden">
                <Image
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F2A24]/90 text-[#D8C28A] backdrop-blur-sm border border-[#D8C28A]/40">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-[#0F2A24] group-hover:text-[#173B32] transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tersedia & Terawat</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
