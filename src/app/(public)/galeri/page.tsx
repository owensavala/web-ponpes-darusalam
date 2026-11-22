import React from 'react';
import Image from 'next/image';
import { Camera, Video, Calendar, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal } from '@/lib/utils';

export const metadata = {
  title: 'Galeri Foto & Video',
  description: 'Dokumentasi visual kegiatan santri, halaqah tahfizh, pembelajaran formal, dan kehidupan di Ponpes Darussalam Kupal Bacan.',
};

export default async function GaleriPage() {
  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      unit: true,
    },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Kegiatan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Galeri Santri & Pesantren
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Merekam jejak kebersamaan, kesungguhan belajar Al-Qur&apos;an, dan ragam kreativitas santri di Halmahera Selatan.
          </p>
        </div>

        {/* Albums */}
        <div className="space-y-12">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {album.unit ? album.unit.shortName : 'Umum Yayasan'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {album.items.length} Dokumentasi
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-[#0F2A24] mt-1">{album.title}</h2>
                  {album.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{album.description}</p>
                  )}
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {album.items.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl overflow-hidden bg-[#0F2A24] h-52 border border-slate-100 shadow-xs"
                  >
                    <Image
                      src={item.url}
                      alt={item.caption || album.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      unoptimized={item.url.startsWith('/uploads')}
                    />
                    {item.caption && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[11px] opacity-90 group-hover:opacity-100 transition">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
