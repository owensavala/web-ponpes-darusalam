import React from 'react';
import Link from 'next/link';
import { BookOpen, Target, CheckCircle2, Award, Building, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Sejarah, Visi & Misi',
  description: 'Sejarah berdirinya Pondok Pesantren Darussalam Kupal, Bacan Selatan, serta visi dan misi Yayasan Darussalam Bacan.',
};

export default async function SejarahVisiMisiPage() {
  const settings = await prisma.siteSetting.findUnique({
    where: { id: 'default' },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumb */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Profil Lembaga</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Sejarah, Visi & Misi Lembaga
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Yayasan Darussalam Bacan (NPYP: {settings?.npyp || 'AZ5439'}) &bull; Pondok Pesantren Darussalam Kupal, Halmahera Selatan, Maluku Utara.
          </p>
        </div>

        {/* Legalitas Card */}
        <div className="bg-[#0F2A24] text-[#F2EEE3] rounded-3xl p-6 sm:p-8 border border-[#173B32] shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="border-b sm:border-b-0 sm:border-r border-[#173B32] pb-4 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-[#8FA39B] uppercase font-bold">Badan Hukum</span>
            <h4 className="text-base font-bold text-[#D8C28A] mt-1">{settings?.foundationName || 'Yayasan Darussalam Bacan'}</h4>
            <p className="text-xs text-[#8FA39B] mt-0.5">NPYP: <span className="font-mono text-white">{settings?.npyp || 'AZ5439'}</span></p>
            <p className="text-[11px] text-[#D8C28A]/90 mt-0.5">SK Menkumham: <span className="font-mono text-[#F2EEE3]">{settings?.skMenkumham || 'AHU 00147.50.10.2014'}</span></p>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r border-[#173B32] pb-4 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-[#8FA39B] uppercase font-bold">Lokasi Kampus</span>
            <h4 className="text-base font-bold text-white mt-1">Desa Kupal</h4>
            <p className="text-xs text-[#8FA39B] mt-0.5">Kec. Bacan Selatan, Halmahera Selatan</p>
          </div>
          <div>
            <span className="text-[11px] text-[#8FA39B] uppercase font-bold">Pengasuh Utama</span>
            <h4 className="text-base font-bold text-[#D8C28A] mt-1">{settings?.greetingName || 'KH. Asep Sofyan, Lc., M.Pd.I'}</h4>
            <p className="text-xs text-[#8FA39B] mt-0.5">Ketua Yayasan: Yahya Haji</p>
          </div>
        </div>

        {/* Sejarah Pendirian */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#0F2A24]">
            <Building className="w-5 h-5 text-[#D8C28A]" />
            <h2 className="text-xl sm:text-2xl font-black">Sejarah Singkat Pendirian</h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-100 pt-4">
            {settings?.historyText || `Pondok Pesantren Darussalam Bacan didirikan dengan semangat dakwah dan tarbiyah Islamiyah di Desa Kupal, Kecamatan Bacan Selatan, Kabupaten Halmahera Selatan. Berawal dari majelis taklim dan pengajian halaqah Al-Qur'an, Yayasan Darussalam Bacan secara resmi berbadan hukum dengan NPYP AZ5439. 

Seiring kebutuhan masyarakat kepulauan Halmahera Selatan akan pendidikan terpadu berkualitas, pesantren berkembang pesat mendirikan madrasah formal dan kepesantrenan berasrama. Kini, pesantren mengasuh ratusan santri mukim dari berbagai pelosok Maluku Utara dan Indonesia Timur, menyajikan kurikulum terpadu antara Kemenag, Kemendikdasmen, dan Kurikulum Pesantren Salaf-Ashri.`}
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-gradient-to-br from-[#0F2A24] to-[#173B32] text-[#F2EEE3] rounded-3xl p-8 border border-[#266052] shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#081714] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#D8C28A]">Visi Lembaga</h3>
              <p className="text-xs sm:text-sm text-[#F2EEE3]/90 leading-relaxed italic">
                &ldquo;{settings?.visionText || "Terwujudnya Lembaga Pendidikan Islam Terpadu yang Unggul, Berakhlakul Karimah, Berprestasi Global, dan Berjiwa Qur'ani Berlandaskan Ahlussunnah Wal Jama'ah."}&rdquo;
              </p>
            </div>
            <div className="pt-6 border-t border-[#266052] text-[11px] text-[#8FA39B]">
              Berakar pada nilai-nilai luhur Al-Qur&apos;an dan wawasan kemanusiaan universal.
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F2A24]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#0F2A24]">Misi Lembaga</h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
              {settings?.missionText || `1. Menyelenggarakan pendidikan tahfizh Al-Qur'an dan kajian kitab kuning secara terstruktur dan sanad muttashil.
2. Membentuk pribadi santri yang berakhlak mulia, disiplin, mandiri, dan berjiwa kepemimpinan.
3. Mengembangkan proses belajar mengajar berkualitas tinggi pada kurikulum formal Kemenag dan Kemendikdasmen.
4. Menanamkan wawasan kebangsaan, kepedulian sosial, dan kecakapan hidup (life skills) serta vokasi.
5. Membina kemampuan bahasa asing (Arab dan Inggris) aktif serta literasi sains dan teknologi informasi.`}
            </div>
          </div>
        </div>

        {/* CTA Bawah */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#0F2A24]">Ingin Mengenal Lebih Dekat Dewan Pengasuh Kami?</h4>
            <p className="text-xs text-slate-500">Lihat profil lengkap KH. Asep Sofyan dan asatidz pembina.</p>
          </div>
          <Link
            href="/profil/pengasuh-pengurus"
            className="px-5 py-2.5 rounded-xl bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3] text-xs font-bold transition shrink-0"
          >
            Profil Pengasuh & Dewan Guru ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
