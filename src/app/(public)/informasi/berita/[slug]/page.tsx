import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Eye,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  Building,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal } from '@/lib/utils';

interface BeritaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return { title: 'Berita Tidak Ditemukan' };

  return {
    title: `${post.title} - Ponpes Darussalam Bacan`,
    description: post.excerpt || post.content.slice(0, 160),
  };
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;

  // Increment view count
  const post = await prisma.post.update({
    where: { slug },
    data: { views: { increment: 1 } },
    include: {
      unit: true,
      author: true,
    },
  }).catch(() => null);

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Rekomendasi berita terkait
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: post.id },
      ...(post.unitId ? { unitId: post.unitId } : {}),
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/informasi/berita"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:text-[#173B32] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Berita</span>
          </Link>
          {post.unit && (
            <Link
              href={`/unit/${post.unit.slug}`}
              className="text-xs font-bold text-[#D8C28A] bg-[#0F2A24] px-3 py-1 rounded-full border border-[#D8C28A]/30"
            >
              {post.unit.name}
            </Link>
          )}
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D8C28A]" />
                {formatTanggal(post.publishedAt)}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#D8C28A]" />
                {post.author.name}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#D8C28A]" />
                {post.views} Kali Dibaca
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A24] tracking-tight leading-snug">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {post.thumbnailUrl && (
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-[#0F2A24] border border-slate-200">
              <Image
                src={post.thumbnailUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 800px"
                priority
                unoptimized={post.thumbnailUrl.startsWith('/uploads')}
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-800 space-y-4 whitespace-pre-line pt-2">
            {post.content}
          </div>

          {/* Footer Share & Tag */}
          <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Kategori:</span>
              <span className="font-bold text-[#0F2A24] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {post.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Bagikan:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${post.title} - Baca selengkapnya di: ${process.env.NEXT_PUBLIC_APP_URL || ''}/informasi/berita/${post.slug}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* Rekomendasi Terkait */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-base font-bold text-[#0F2A24]">Berita Terkait Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition"
                >
                  <span className="text-[10px] text-slate-400">
                    {formatTanggal(rel.publishedAt)}
                  </span>
                  <h4 className="text-xs font-bold text-[#0F2A24] line-clamp-2">
                    <Link href={`/informasi/berita/${rel.slug}`} className="hover:underline">
                      {rel.title}
                    </Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
