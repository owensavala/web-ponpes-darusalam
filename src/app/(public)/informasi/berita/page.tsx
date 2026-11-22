import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, Eye, ArrowRight, Search, Tag } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal } from '@/lib/utils';

interface BeritaPageProps {
  searchParams: Promise<{ unit?: string; q?: string }>;
}

export const metadata = {
  title: 'Warta & Berita Pesantren',
  description: 'Kabar terkini seputar kegiatan belajar, tahfizh, prestasi santri, dan aktivitas Yayasan Darussalam Bacan.',
};

export default async function BeritaListPage({ searchParams }: BeritaPageProps) {
  const { unit, q } = await searchParams;

  const [posts, units] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        type: 'BERITA',
        ...(unit ? { unit: { slug: unit } } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { excerpt: { contains: q } },
                { content: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
      include: { unit: true, author: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kabar Pesantren</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Warta & Berita Terkini
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Informasi resmi seputar dinamika santri, kegiatan akademik, tahfizh, dan perkembangan 5 unit pendidikan Darussalam Bacan.
          </p>
        </div>

        {/* Filter Unit Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/informasi/berita"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              !unit
                ? 'bg-[#0F2A24] text-[#D8C28A]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Unit
          </Link>
          {units.map((u) => (
            <Link
              key={u.slug}
              href={`/informasi/berita?unit=${u.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                unit === u.slug
                  ? 'bg-[#0F2A24] text-[#D8C28A]'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {u.shortName}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Belum ada berita untuk kategori ini.</h3>
            <p className="text-xs text-slate-500 mt-1">Silakan pilih kategori unit lainnya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition"
              >
                <div className="relative h-48 bg-[#0F2A24] overflow-hidden">
                  <Image
                    src={
                      post.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={post.thumbnailUrl?.startsWith('/uploads')}
                  />
                  {post.unit && (
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F2A24]/85 text-[#D8C28A] backdrop-blur-sm border border-[#D8C28A]/30">
                        {post.unit.shortName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatTanggal(post.publishedAt)}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {post.views}
                      </span>
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-[#0F2A24] group-hover:text-[#173B32] transition line-clamp-2">
                      <Link href={`/informasi/berita/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt || post.content.slice(0, 120)}...
                    </p>
                  </div>

                  <Link
                    href={`/informasi/berita/${post.slug}`}
                    className="text-xs font-bold text-[#0F2A24] hover:text-[#173B32] hover:underline inline-flex items-center gap-1 pt-2"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
