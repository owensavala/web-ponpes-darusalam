import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  GraduationCap,
  Calendar,
  Eye,
  MapPin,
  Clock,
  Phone,
  FileCheck,
  Building,
  Compass,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatTanggal, formatRupiah } from '@/lib/utils';

export default async function HomePage() {
  // Ambil data untuk Beranda
  const [settings, units, recentPosts, achievements, activePeriod] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 'default' } }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      include: { unit: true },
    }),
    prisma.achievement.findMany({
      orderBy: { year: 'desc' },
      take: 3,
      include: { unit: true },
    }),
    prisma.psbPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION (Forest Cream Luxury Islamic Palette) */}
      <section className="relative bg-[#0F2A24] text-[#F2EEE3] overflow-hidden border-b border-[#173B32] bg-islamic-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#173B32] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D8C28A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Arabic Salam Header */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173B32] border border-[#D8C28A]/40 text-[#D8C28A] text-xs font-semibold shadow-inner">
                <span className="font-arabic text-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8C28A]" />
                <span>Pondok Pesantren Darussalam Kupal</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#F2EEE3] tracking-tight leading-[1.15]">
                Mencetak Generasi{' '}
                <span className="text-[#D8C28A] underline decoration-[#D8C28A]/40 decoration-wavy underline-offset-8">
                  Qur&apos;ani & Berwawasan Global
                </span>{' '}
                di Bumi Saruma
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#8FA39B] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pusat pendidikan Islam terpadu di bawah naungan <strong>Yayasan Darussalam Bacan</strong> (NPYP: AZ5439). 
                Memadukan keteguhan tahfizh Al-Qur&apos;an 30 juz, sanad kitab kuning, dan kurikulum formal nasional dari tingkat dasar hingga pendidikan tinggi.
              </p>

              {/* CTA Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/psb/daftar"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-sm shadow-xl transition transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#0F2A24]" />
                  <span>Daftar PSB Online 2026/2027</span>
                  <ArrowRight className="w-4 h-4 text-[#0F2A24]" />
                </Link>

                <Link
                  href="#unit-pendidikan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#173B32] hover:bg-[#1E4D41] text-[#F2EEE3] border border-[#266052] font-semibold text-sm transition"
                >
                  <Building className="w-4 h-4 text-[#D8C28A]" />
                  <span>Jelajahi Unit Pendidikan</span>
                </Link>

                <Link
                  href="/psb/cek-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold text-[#8FA39B] hover:text-[#D8C28A] transition"
                >
                  <FileCheck className="w-4 h-4 text-[#D8C28A]" />
                  <span>Cek Status Pendaftaran</span>
                </Link>
              </div>

              {/* Quick Stats Bar */}
              <div className="pt-6 border-t border-[#173B32] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
                <div className="p-3 rounded-2xl bg-[#173B32]/40 border border-[#266052]/50">
                  <p className="text-xl sm:text-2xl font-black text-[#D8C28A]">5 Unit</p>
                  <p className="text-[11px] text-[#8FA39B] uppercase font-semibold">Pendidikan Terpadu</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#173B32]/40 border border-[#266052]/50">
                  <p className="text-xl sm:text-2xl font-black text-[#D8C28A]">30 Juz</p>
                  <p className="text-[11px] text-[#8FA39B] uppercase font-semibold">Tahfizh & Asrama</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#173B32]/40 border border-[#266052]/50">
                  <p className="text-xl sm:text-2xl font-black text-[#D8C28A]">Global</p>
                  <p className="text-[11px] text-[#8FA39B] uppercase font-semibold">Jerman & Australia</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#173B32]/40 border border-[#266052]/50">
                  <p className="text-xl sm:text-2xl font-black text-[#D8C28A]">Desa Kupal</p>
                  <p className="text-[11px] text-[#8FA39B] uppercase font-semibold">Lokasi Strategis</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-[#173B32] border-2 border-[#D8C28A]/40 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-4 border-b border-[#266052]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-[#F2EEE3]">PSB Gelombang I Aktif</span>
                  </div>
                  <span className="text-[11px] bg-[#0F2A24] text-[#D8C28A] font-extrabold px-2.5 py-1 rounded-full border border-[#D8C28A]/30">
                    TA 2026/2027
                  </span>
                </div>

                {/* Quick Unit Selector */}
                <div className="py-4 space-y-2.5">
                  <p className="text-xs font-semibold text-[#8FA39B] uppercase tracking-wider">
                    Pilih Jenjang Sekolah / Asrama:
                  </p>
                  {units.map((unit) => (
                    <Link
                      key={unit.slug}
                      href={`/unit/${unit.slug}`}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#0F2A24]/70 hover:bg-[#0F2A24] border border-[#266052] transition"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#F2EEE3] group-hover:text-[#D8C28A] transition">
                          {unit.name}
                        </div>
                        <div className="text-[10px] text-[#8FA39B]">
                          {unit.level} {unit.npsn ? `• NPSN: ${unit.npsn}` : ''}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8FA39B] group-hover:text-[#D8C28A] group-hover:translate-x-1 transition" />
                    </Link>
                  ))}
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-[#266052] flex items-center justify-between">
                  <div className="text-[11px] text-[#8FA39B]">
                    Biaya pendaftaran mulai <strong className="text-[#D8C28A]">Rp 50.000</strong>
                  </div>
                  <Link
                    href="/psb/informasi"
                    className="text-xs font-bold text-[#D8C28A] hover:underline"
                  >
                    Rincian Biaya ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SAMBUTAN PENGASUH PONDOK */}
      <section className="py-16 sm:py-20 bg-[#FAF8F2] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo & Identity */}
              <div className="lg:col-span-4 text-center">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto rounded-2xl overflow-hidden border-4 border-[#0F2A24] shadow-xl bg-[#173B32]">
                  <Image
                    src={settings?.greetingPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                    alt="KH. Asep Sofyan, Lc., M.Pd.I"
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F2A24]">
                    {settings?.greetingName || 'KH. Asep Sofyan, Lc., M.Pd.I'}
                  </h3>
                  <p className="text-xs font-medium text-[#71867E]">
                    Pengasuh Pondok Pesantren Darussalam Bacan
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Alumnus Univ. Al-Azhar Kairo Mesir
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kalam Pengasuh</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A24] tracking-tight">
                  {settings?.greetingTitle || 'Menempa Santri Berakhlak Qur&apos;ani Menuju Kejayaan Ummat'}
                </h2>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
                  {settings?.greetingText || `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Puji syukur ke hadirat Allah SWT. Pondok Pesantren Darussalam Bacan hadir di Desa Kupal, Halmahera Selatan sebagai wadah pembinaan generasi muda Islam. Kami bertekad memadukan hafalan Al-Qur'an 30 juz, penguasaan kitab kuning, serta keunggulan sains dan teknologi agar santri siap menghadapi tantangan zaman.`}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/profil/pengasuh-pengurus"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:text-[#173B32] hover:underline"
                  >
                    <span>Profil Lengkap Pengasuh & Dewan Asatidz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link
                    href="/profil/sejarah-visi-misi"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#71867E] hover:text-[#0F2A24]"
                  >
                    <span>Visi & Misi Lembaga</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE 5 UNIT PENDIDIKAN */}
      <section id="unit-pendidikan" className="py-20 bg-[#FCFAF6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8C28A] bg-[#0F2A24] px-3.5 py-1.5 rounded-full inline-block">
              Satu Pintu, Lima Jenjang Pendidikan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F2A24] tracking-tight">
              Unit Pendidikan Yayasan Darussalam Bacan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mulai dari kepesantrenan asrama, madrasah tsanawiyah, sekolah menengah pertama, madrasah aliyah, hingga pendidikan kesetaraan dan vokasi kerja di Halmahera Selatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {units.map((unit, idx) => (
              <div
                key={unit.slug}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Unit Header Badge */}
                <div className="p-6 bg-gradient-to-br from-[#0F2A24] to-[#173B32] text-[#F2EEE3] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#D8C28A] uppercase tracking-wider">
                      Unit 0{idx + 1}
                    </span>
                    <span className="text-[10px] bg-[#1E4D41] text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-[#35806E]">
                      {unit.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#F2EEE3] group-hover:text-[#D8C28A] transition">
                    {unit.name}
                  </h3>
                  {unit.npsn && (
                    <p className="text-[11px] text-[#8FA39B] mt-0.5">
                      NPSN: <span className="text-[#F2EEE3] font-mono">{unit.npsn}</span>
                      {unit.accreditation ? ` • Akreditasi: ${unit.accreditation}` : ''}
                    </p>
                  )}
                </div>

                {/* Unit Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {unit.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Pimpinan / Kepala:</span>
                      <strong className="text-[#0F2A24]">{unit.headmasterName || 'Asatidz'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Biaya Pendaftaran:</span>
                      <strong className="text-emerald-700 font-bold">
                        {formatRupiah(unit.registrationFee)}
                      </strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/unit/${unit.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3] text-xs font-bold transition"
                    >
                      <span>Lihat Profil Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/psb/daftar"
                      className="py-2.5 px-3 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] text-xs font-bold transition"
                      title="Daftar unit ini"
                    >
                      Daftar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PILAR KEUNGGULAN PESANTREN */}
      <section className="py-20 bg-[#0F2A24] text-[#F2EEE3] bg-islamic-pattern border-b border-[#173B32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8C28A] bg-[#173B32] px-3.5 py-1.5 rounded-full inline-block border border-[#D8C28A]/30">
              Keunggulan Kompetitif
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2EEE3] tracking-tight">
              Mengapa Memilih Darussalam Bacan?
            </h2>
            <p className="text-xs sm:text-sm text-[#8FA39B] leading-relaxed">
              Keseimbangan antara pembentukan karakter ruhani yang kokoh, sanad keilmuan Islam muttashil, dan kecakapan masa depan berstandar global.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#173B32] border border-[#266052] rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A24] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F2EEE3]">Tahfizh Al-Qur&apos;an 30 Juz</h4>
              <p className="text-xs text-[#8FA39B] leading-relaxed">
                Metode Talaqqi & Tikrar bersanad dengan halaqah intensif pagi dan petang, dibimbing langsung huffadz mutqin.
              </p>
            </div>

            <div className="bg-[#173B32] border border-[#266052] rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A24] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F2EEE3]">Kajian Turats Salaf</h4>
              <p className="text-xs text-[#8FA39B] leading-relaxed">
                Mengkaji kitab kuning fiqih, nahwu shorof, hadits, dan tasawuf bermazhab Syafi&apos;i dengan sanad keilmuan yang jelas.
              </p>
            </div>

            <div className="bg-[#173B32] border border-[#266052] rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A24] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F2EEE3]">Jalur Beasiswa Global</h4>
              <p className="text-xs text-[#8FA39B] leading-relaxed">
                Bimbingan intensif bahasa asing (Arab & Inggris) dengan bukti santri lolos studi lanjut ke perguruan tinggi di Jerman.
              </p>
            </div>

            <div className="bg-[#173B32] border border-[#266052] rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#0F2A24] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#F2EEE3]">Sains & Literasi Digital</h4>
              <p className="text-xs text-[#8FA39B] leading-relaxed">
                Laboratorium komputer mandiri, pelatihan robotika dasar, dan kurikulum vokasi siap kerja di Halmahera Selatan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRESTASI & SEBARAN ALUMNI */}
      {achievements.length > 0 && (
        <section className="py-16 bg-[#FAF8F2] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">
                  Bukti Nyata Mutu Pendidikan
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A24] tracking-tight mt-1">
                  Prestasi Santri & Sebaran Alumni
                </h2>
              </div>
              <Link
                href="/informasi/prestasi-alumni"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:underline"
              >
                <span>Lihat Semua Prestasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {item.category} • {item.year}
                      </span>
                      {item.unit && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.unit.shortName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#0F2A24]">{item.title}</h3>
                    {item.studentName && (
                      <p className="text-xs font-semibold text-emerald-800">
                        {item.studentName}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. BERITA & WARTA TERBARU */}
      <section className="py-20 bg-[#FCFAF6] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#173B32] uppercase tracking-wider">
                Warta Darussalam
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A24] tracking-tight mt-1">
                Kabar & Pengumuman Terbaru
              </h2>
            </div>
            <Link
              href="/informasi/berita"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:underline"
            >
              <span>Semua Berita & Pengumuman</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {recentPosts.map((post) => (
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
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F2A24]/80 text-[#D8C28A] backdrop-blur-sm border border-[#D8C28A]/40">
                      {post.type}
                    </span>
                    {post.unit && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#0F2A24] backdrop-blur-sm">
                        {post.unit.shortName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTanggal(post.publishedAt)}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {post.views} dibaca
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0F2A24] group-hover:text-[#173B32] transition line-clamp-2">
                      <Link href={`/informasi/berita/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.excerpt || post.content.slice(0, 120)}...
                    </p>
                  </div>

                  <Link
                    href={`/informasi/berita/${post.slug}`}
                    className="text-xs font-bold text-[#0F2A24] hover:text-[#173B32] hover:underline inline-flex items-center gap-1 pt-2"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION PENDAFTARAN PSB */}
      <section className="py-16 bg-gradient-to-r from-[#0F2A24] via-[#173B32] to-[#0F2A24] text-[#F2EEE3] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-5">
          <span className="text-xs font-bold text-[#D8C28A] uppercase tracking-widest bg-[#0F2A24] px-4 py-1.5 rounded-full border border-[#D8C28A]/40 inline-block">
            Penerimaan Santri Baru TA 2026/2027
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-[#F2EEE3] tracking-tight">
            Daftarkan Putra-Putri Anda Sekarang
          </h2>

          <p className="text-xs sm:text-sm text-[#8FA39B] max-w-2xl mx-auto leading-relaxed">
            Kuota asrama terbatas untuk menjaga kualitas pembinaan intensif tahfizh dan akhlak santri. Proses pendaftaran dilakukan 100% online dengan pengunggahan berkas digital yang mudah dan cepat.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/psb/daftar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-sm shadow-xl transition"
            >
              <Sparkles className="w-4 h-4 text-[#0F2A24]" />
              <span>Isi Formulir Pendaftaran</span>
            </Link>
            <Link
              href="/psb/informasi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#081714] text-[#F2EEE3] border border-[#266052] font-semibold text-xs hover:bg-[#0F2A24] transition"
            >
              <span>Pelajari Alur & Syarat Berkas</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
