import React from 'react';
import Link from 'next/link';
import { Bell, Calendar, Eye, ArrowRight, AlertCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal } from '@/lib/utils';

export const metadata = {
  title: 'Pengumuman Resmi',
  description: 'Pengumuman dan edaran resmi dari Yayasan Darussalam Bacan dan unit pendidikan.',
};

export default async function PengumumanPage() {
  const announcements = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'PENGUMUMAN',
    },
    orderBy: { publishedAt: 'desc' },
    include: { unit: true },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Bell className="w-3.5 h-3.5" />
            <span>Papan Informasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Pengumuman & Edaran Resmi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Segala bentuk pemberitahuan formal mengenai jadwal akademik, PSB, dan kegiatan kepesantrenan.
          </p>
        </div>

        {/* List Pengumuman */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Belum ada pengumuman baru.</h3>
            </div>
          ) : (
            announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      PENGUMUMAN
                    </span>
                    {item.unit && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                        {item.unit.shortName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatTanggal(item.publishedAt)}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#0F2A24]">
                  <Link href={`/informasi/berita/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                  {item.excerpt || item.content.slice(0, 200)}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/informasi/berita/${item.slug}`}
                    className="text-xs font-bold text-[#0F2A24] hover:text-[#173B32] inline-flex items-center gap-1"
                  >
                    <span>Baca Pengumuman Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
