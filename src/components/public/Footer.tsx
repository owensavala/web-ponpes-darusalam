import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Heart,
} from 'lucide-react';

interface UnitSummary {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  level: string;
}

interface FooterProps {
  units: UnitSummary[];
  sitePhone?: string;
  siteEmail?: string;
  address?: string;
  npyp?: string;
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer({
  units,
  sitePhone = '6282293883344',
  siteEmail = 'info@darussalambacan.sch.id',
  address = 'Jl. Pesantren, Desa Kupal, Kec. Bacan Selatan, Kab. Halmahera Selatan, Maluku Utara 97791',
  npyp = 'AZ5439',
}: FooterProps) {
  return (
    <footer className="bg-[#081714] text-[#F2EEE3] border-t border-[#173B32]">
      {/* Decorative Ayat / Hadits Section */}
      <div className="bg-[#0F2A24] border-b border-[#173B32] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-arabic text-xl sm:text-2xl text-[#D8C28A] leading-relaxed mb-3">
            يَرْفَعِ اللّٰهُ الَّذِيْنَ اٰمَنُوْا مِنْكُمْۙ وَالَّذِيْنَ اُوْتُوا الْعِلْمَ دَرَجٰتٍ
          </p>
          <p className="text-xs sm:text-sm text-[#8FA39B] italic">
            &ldquo;Allah akan meninggikan orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu pengetahuan beberapa derajat.&rdquo; (QS. Al-Mujadilah: 11)
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Profil Yayasan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#173B32] border-2 border-[#D8C28A] flex items-center justify-center text-[#D8C28A] shadow-lg">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-[#F2EEE3] tracking-tight">
                  PONDOK PESANTREN DARUSSALAM BACAN
                </h4>
                <p className="text-xs font-semibold text-[#D8C28A]">
                  YAYASAN DARUSSALAM BACAN &bull; NPYP: {npyp} &bull; AHU 00147.50.10.2014
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#8FA39B] leading-relaxed pr-4">
              Lembaga pendidikan Islam terpadu di Bumi Saruma, Halmahera Selatan. Berkomitmen mencetak generasi penghafal Al-Qur&apos;an 30 juz, menguasai kitab turats salaf, dan unggul dalam sains teknologi untuk menyongsong masa depan dunia.
            </p>

            <div className="space-y-2 text-xs text-[#F2EEE3]/90 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D8C28A] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D8C28A] shrink-0" />
                <a href={`https://wa.me/${sitePhone}`} target="_blank" rel="noreferrer" className="hover:text-[#D8C28A] transition">
                  +{sitePhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D8C28A] shrink-0" />
                <a href={`mailto:${siteEmail}`} className="hover:text-[#D8C28A] transition">
                  {siteEmail}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://www.facebook.com/profile.php?id=100088397100351"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#173B32] border border-[#266052] flex items-center justify-center text-[#F2EEE3] hover:text-[#D8C28A] hover:border-[#D8C28A] transition"
                title="Facebook Pengajian Online Halmahera Selatan"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/yayasandarussalambacan/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#173B32] border border-[#266052] flex items-center justify-center text-[#F2EEE3] hover:text-[#D8C28A] hover:border-[#D8C28A] transition"
                title="Instagram Yayasan Darussalam Bacan"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com/@darussalambacan"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#173B32] border border-[#266052] flex items-center justify-center text-[#F2EEE3] hover:text-[#D8C28A] hover:border-[#D8C28A] transition"
                title="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Col 3: 5 Unit Pendidikan */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D8C28A] mb-4 pb-1 border-b border-[#173B32]">
              Unit Pendidikan
            </h5>
            <ul className="space-y-2 text-xs">
              {units.map((unit) => (
                <li key={unit.slug}>
                  <Link
                    href={`/unit/${unit.slug}`}
                    className="text-[#8FA39B] hover:text-[#F2EEE3] hover:underline flex items-center gap-1.5 transition py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8C28A]" />
                    {unit.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Layanan PSB & Santri */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D8C28A] mb-4 pb-1 border-b border-[#173B32]">
              PSB & Informasi
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/psb/informasi" className="text-[#8FA39B] hover:text-[#F2EEE3] transition block py-1">
                  Alur & Biaya PSB
                </Link>
              </li>
              <li>
                <Link href="/psb/daftar" className="text-[#8FA39B] hover:text-[#D8C28A] font-medium transition block py-1">
                  Formulir Pendaftaran Online
                </Link>
              </li>
              <li>
                <Link href="/psb/cek-status" className="text-[#8FA39B] hover:text-[#F2EEE3] transition block py-1">
                  Cek Status Kelulusan
                </Link>
              </li>
              <li>
                <Link href="/informasi/berita" className="text-[#8FA39B] hover:text-[#F2EEE3] transition block py-1">
                  Kabar & Berita Pesantren
                </Link>
              </li>
              <li>
                <Link href="/informasi/prestasi-alumni" className="text-[#8FA39B] hover:text-[#F2EEE3] transition block py-1">
                  Prestasi Santri & Alumni
                </Link>
              </li>
              <li>
                <Link href="/informasi/unduhan" className="text-[#8FA39B] hover:text-[#F2EEE3] transition block py-1">
                  Pusat Unduhan Dokumen
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Tautan Cepat & Peta */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#D8C28A] mb-4 pb-1 border-b border-[#173B32]">
              Akses Cepat
            </h5>
            <div className="space-y-2.5 text-xs">
              <Link
                href="/psb/daftar"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#D8C28A] text-[#0F2A24] font-bold shadow hover:bg-[#C5A55D] transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Daftar Santri Baru
              </Link>
              <Link
                href="/admin/login"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#173B32] text-[#F2EEE3] border border-[#266052] font-medium hover:bg-[#1E4D41] transition"
              >
                Login Operator / Admin
              </Link>
              <div className="pt-2">
                <Link
                  href="/kontak"
                  className="text-[#8FA39B] hover:text-[#D8C28A] flex items-center gap-1 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D8C28A]" />
                  Petunjuk Peta Lokasi Desa Kupal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#050E0C] border-t border-[#173B32]/40 py-5 px-4 text-center text-xs text-[#8FA39B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} Yayasan Darussalam Bacan. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            Portal Resmi Pondok Pesantren Darussalam Kupal, Bacan Selatan, Halmahera Selatan
          </p>
        </div>
      </div>
    </footer>
  );
}
