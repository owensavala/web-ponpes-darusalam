import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  Users,
  GraduationCap,
  FileText,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatRupiah, formatTanggal, formatWaLink } from '@/lib/utils';

interface UnitPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: UnitPageProps) {
  const { slug } = await params;
  const unit = await prisma.educationUnit.findUnique({
    where: { slug },
  });

  if (!unit) {
    return { title: 'Unit Tidak Ditemukan' };
  }

  return {
    title: `${unit.name} - Pondok Pesantren Darussalam Bacan`,
    description: unit.tagline || unit.description.slice(0, 150),
  };
}

export default async function UnitDetailPage({ params }: UnitPageProps) {
  const { slug } = await params;

  const unit = await prisma.educationUnit.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      },
      achievements: {
        orderBy: { year: 'desc' },
        take: 3,
      },
      galleries: {
        take: 1,
        include: { items: { take: 4 } },
      },
    },
  });

  if (!unit) {
    notFound();
  }

  // Parse Ekstrakurikuler jika ada
  let extraList: string[] = [];
  try {
    if (unit.extracurriculars) {
      extraList = JSON.parse(unit.extracurriculars);
    }
  } catch {
    extraList = [];
  }

  const waGreeting = `Assalamu'alaikum Warahmatullahi Wabarakatuh, saya ingin menanyakan informasi pendaftaran dan program di ${unit.name}.`;
  const waUrl = formatWaLink(unit.whatsappNumber, waGreeting);

  return (
    <div className="bg-[#FAF8F2] pb-20">
      {/* 1. UNIT HERO HEADER */}
      <section className="bg-[#0F2A24] text-[#F2EEE3] py-14 sm:py-20 border-b border-[#173B32] bg-islamic-pattern relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#173B32] text-[#D8C28A] border border-[#D8C28A]/30">
                  {unit.level}
                </span>
                {unit.npsn && (
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#081714] text-[#8FA39B] border border-[#266052]">
                    NPSN: {unit.npsn}
                  </span>
                )}
                {unit.accreditation && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    Akreditasi {unit.accreditation}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black text-[#F2EEE3] tracking-tight leading-snug">
                {unit.name}
              </h1>

              {unit.tagline && (
                <p className="text-sm sm:text-base text-[#D8C28A] font-medium italic">
                  &ldquo;{unit.tagline}&rdquo;
                </p>
              )}

              <p className="text-xs sm:text-sm text-[#8FA39B] leading-relaxed max-w-2xl">
                {unit.description}
              </p>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/psb/daftar?unit=${unit.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-xs sm:text-sm shadow-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Daftar {unit.shortName} Online</span>
                </Link>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#173B32] hover:bg-[#1E4D41] text-[#F2EEE3] border border-[#266052] text-xs font-semibold transition"
                >
                  <Phone className="w-4 h-4 text-[#D8C28A]" />
                  <span>Konsultasi WA Operator</span>
                </a>
              </div>
            </div>

            {/* Right: Info Box / Kepala Unit */}
            <div className="lg:col-span-4">
              <div className="bg-[#173B32] border-2 border-[#266052] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#D8C28A] pb-2 border-b border-[#266052]">
                  Informasi Unit & PSB
                </div>

                <div className="space-y-3 text-xs text-[#F2EEE3]/90">
                  <div className="flex justify-between items-center py-1 border-b border-[#266052]/60">
                    <span className="text-[#8FA39B]">Pimpinan / Kepala:</span>
                    <strong className="text-white">{unit.headmasterName || 'Asatidz'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#266052]/60">
                    <span className="text-[#8FA39B]">Status PSB:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {unit.isPsbOpen ? 'Dibuka (2026/2027)' : 'Ditutup'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#266052]/60">
                    <span className="text-[#8FA39B]">Biaya Pendaftaran:</span>
                    <strong className="text-[#D8C28A] font-bold">
                      {formatRupiah(unit.registrationFee)}
                    </strong>
                  </div>
                  {unit.whatsappNumber && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-[#8FA39B]">No. WhatsApp:</span>
                      <span className="text-white font-mono">+{unit.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/psb/informasi"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0F2A24] text-xs font-semibold text-[#D8C28A] border border-[#D8C28A]/30 hover:bg-[#081714] transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Rincian Biaya & Syarat Berkas ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT (VISI, KURIKULUM, EKSKUL, JADWAL) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {/* Visi & Misi */}
        {(unit.vision || unit.mission) && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D8C28A]" />
                Visi & Misi {unit.shortName}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {unit.vision && (
                <div>
                  <h3 className="text-xs font-bold text-[#173B32] uppercase tracking-wider mb-2">
                    Visi
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-[#FCFAF6] p-4 rounded-2xl border border-slate-100">
                    &ldquo;{unit.vision}&rdquo;
                  </p>
                </div>
              )}
              {unit.mission && (
                <div>
                  <h3 className="text-xs font-bold text-[#173B32] uppercase tracking-wider mb-2">
                    Misi
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-1">
                    {unit.mission}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kurikulum & Jadwal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kurikulum */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-[#D8C28A]" />
              <h2 className="text-lg font-black text-[#0F2A24]">
                Kurikulum & Program Pembelajaran
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {unit.curriculum ||
                'Kurikulum terpadu yang memadukan kurikulum nasional dan nilai-nilai kepesantrenan.'}
            </div>
          </div>

          {/* Jadwal Harian / Ekstrakurikuler */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ekstrakurikuler */}
            {extraList.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#0F2A24] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D8C28A]" />
                  Ekstrakurikuler & Minat Bakat
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {extraList.map((ekskul, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {ekskul}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Jadwal Harian Khusus Pondok */}
            {unit.dailySchedule && (
              <div className="bg-[#0F2A24] text-[#F2EEE3] rounded-3xl p-6 border border-[#173B32] shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-[#D8C28A] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Jadwal Rutinitas Santri
                </h3>
                <div className="text-xs text-[#8FA39B] whitespace-pre-line leading-relaxed">
                  {unit.dailySchedule}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Berita Terkait Unit Ini */}
        {unit.posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D8C28A]" />
              Warta & Berita Terkait {unit.shortName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unit.posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition"
                >
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTanggal(post.publishedAt)}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F2A24] line-clamp-2">
                    <Link href={`/informasi/berita/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {post.excerpt || post.content.slice(0, 80)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
