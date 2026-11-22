'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
  Calendar,
  Search,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitSummary {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  level: string;
}

interface NavbarProps {
  units: UnitSummary[];
  sitePhone?: string;
  siteEmail?: string;
}

export default function Navbar({
  units,
  sitePhone = '6282293883344',
  siteEmail = 'info@darussalambacan.sch.id',
}: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states for mobile accordion
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Desktop click-to-toggle fallback
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopDropdown(null);
  }, [pathname]);

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const navLinks = [
    { label: 'Beranda', href: '/' },
    {
      label: 'Profil',
      id: 'profil',
      children: [
        { label: 'Sejarah, Visi & Misi', href: '/profil/sejarah-visi-misi', desc: 'Akar pendirian dan arah masa depan' },
        { label: 'Pengasuh & Pengurus', href: '/profil/pengasuh-pengurus', desc: 'Dewan pimpinan dan asatidz' },
        { label: 'Sarana & Fasilitas', href: '/profil/fasilitas', desc: 'Kompleks asrama dan fasilitas belajar' },
      ],
    },
    {
      label: 'Unit Pendidikan',
      id: 'unit',
      children: units.map((u) => ({
        label: u.shortName,
        href: `/unit/${u.slug}`,
        desc: u.level,
      })),
    },
    {
      label: 'PSB Online',
      id: 'psb',
      badge: '2026/2027',
      children: [
        { label: 'Informasi & Alur PSB', href: '/psb/informasi', desc: 'Syarat, jadwal gelombang, dan rincian biaya' },
        { label: 'Daftar Santri Baru', href: '/psb/daftar', desc: 'Formulir online resmi santri baru' },
        { label: 'Cek Status Pendaftaran', href: '/psb/cek-status', desc: 'Cek kelulusan berkas & pengumuman' },
      ],
    },
    {
      label: 'Informasi',
      id: 'informasi',
      children: [
        { label: 'Warta & Berita', href: '/informasi/berita', desc: 'Kabar terkini seputar kegiatan pesantren' },
        { label: 'Pengumuman Resmi', href: '/informasi/pengumuman', desc: 'Edaran dan pengumuman yayasan' },
        { label: 'Prestasi & Alumni', href: '/informasi/prestasi-alumni', desc: 'Kiprah santri hingga kancah global' },
        { label: 'Unduhan Dokumen', href: '/informasi/unduhan', desc: 'Brosur PSB, kalender, dan panduan' },
      ],
    },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Kontak', href: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Bar Informasi Lembaga */}
      <div className="bg-[#081714] text-[#8FA39B] text-xs py-2 px-4 border-b border-[#173B32]/40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#F2EEE3]/90">
              <MapPin className="w-3.5 h-3.5 text-[#D8C28A]" />
              Desa Kupal, Kec. Bacan Selatan, Halmahera Selatan
            </span>
            <span className="text-[#8FA39B]/50">|</span>
            <span className="text-[#8FA39B]">NPYP: <strong className="text-[#D8C28A]">AZ5439</strong></span>
            <span className="text-[#8FA39B]/50 hidden lg:inline">|</span>
            <span className="text-[#8FA39B] hidden lg:inline">SK Menkumham: <strong className="text-[#D8C28A]">AHU 00147.50.10.2014</strong></span>
            <span className="text-[#8FA39B]/50">|</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PSB 2026/2027 Dibuka
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/${sitePhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#F2EEE3]/80 hover:text-[#D8C28A] transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#D8C28A]" />
              +{sitePhone}
            </a>
            <a
              href={`mailto:${siteEmail}`}
              className="flex items-center gap-1.5 text-[#F2EEE3]/80 hover:text-[#D8C28A] transition"
            >
              <Mail className="w-3.5 h-3.5 text-[#D8C28A]" />
              {siteEmail}
            </a>
            <Link
              href="/admin/login"
              className="text-[#D8C28A] hover:underline font-semibold ml-2 pl-3 border-l border-[#173B32]"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          'w-full transition-all duration-200 border-b',
          isScrolled
            ? 'bg-[#0F2A24]/95 backdrop-blur-md border-[#173B32] shadow-lg py-3'
            : 'bg-[#0F2A24] border-[#173B32]/70 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#173B32] to-[#081714] border-2 border-[#D8C28A] flex items-center justify-center text-[#D8C28A] shadow-md group-hover:scale-105 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-[#F2EEE3] tracking-tight group-hover:text-[#D8C28A] transition">
                  DARUSSALAM BACAN
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#8FA39B] tracking-wider uppercase">
                Yayasan & Pondok Pesantren Kupal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const hasChildren = !!item.children;
              const isActive = item.href ? pathname === item.href : false;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={cn(
                      'px-3.5 py-2 rounded-lg text-sm font-semibold transition',
                      isActive
                        ? 'text-[#D8C28A] bg-[#173B32]/60'
                        : 'text-[#F2EEE3]/90 hover:text-[#D8C28A] hover:bg-[#173B32]/40'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              // Dropdown Item with Zero-Gap Hover Bridge
              return (
                <div
                  key={item.label}
                  className="relative group dropdown-container"
                  onMouseEnter={() => setDesktopDropdown(item.id!)}
                  onMouseLeave={() => setDesktopDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDesktopDropdown(desktopDropdown === item.id ? null : item.id!)
                    }
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition',
                      desktopDropdown === item.id
                        ? 'text-[#D8C28A] bg-[#173B32]/70'
                        : 'text-[#F2EEE3]/90 hover:text-[#D8C28A] hover:bg-[#173B32]/40'
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-[#D8C28A] text-[#0F2A24] font-extrabold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-[#8FA39B] transition duration-200',
                        desktopDropdown === item.id && 'rotate-180 text-[#D8C28A]'
                      )}
                    />
                  </button>

                  {/* Hover Bridge + Dropdown Menu */}
                  <div
                    className={cn(
                      'absolute left-0 top-full dropdown-bridge w-64 transition-all duration-200 z-50',
                      desktopDropdown === item.id
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible pointer-events-none -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0'
                    )}
                  >
                    <div className="bg-[#173B32] border border-[#266052] rounded-2xl shadow-2xl p-2 backdrop-blur-md">
                      {item.children?.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-3.5 py-2.5 rounded-xl hover:bg-[#0F2A24] transition group/sub"
                        >
                          <div className="text-xs font-bold text-[#F2EEE3] group-hover/sub:text-[#D8C28A] transition">
                            {sub.label}
                          </div>
                          {sub.desc && (
                            <div className="text-[11px] text-[#8FA39B] mt-0.5 line-clamp-1">
                              {sub.desc}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Action Button (PSB CTA) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/psb/daftar"
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-sm shadow-md transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#0F2A24]" />
              <span>Daftar Santri Baru</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-[#F2EEE3] hover:text-[#D8C28A] rounded-xl hover:bg-[#173B32] transition"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-sm bg-[#0F2A24] border-l border-[#173B32] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#173B32] flex items-center justify-between bg-[#081714]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#173B32] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2EEE3]">Darussalam Bacan</h3>
                  <p className="text-[10px] text-[#8FA39B]">Menu Navigasi Mobile</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#8FA39B] hover:text-white rounded-lg hover:bg-[#173B32]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {navLinks.map((item) => {
                const hasChildren = !!item.children;
                const isAccordionOpen = openAccordion === item.id;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-sm font-semibold transition',
                        pathname === item.href
                          ? 'text-[#D8C28A] bg-[#173B32]'
                          : 'text-[#F2EEE3] hover:bg-[#173B32]/50'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className="rounded-xl overflow-hidden bg-[#173B32]/30 border border-[#173B32]/60">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(item.id!)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[#F2EEE3] hover:text-[#D8C28A]"
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="text-[10px] bg-[#D8C28A] text-[#0F2A24] font-bold px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-[#8FA39B] transition-transform duration-200',
                          isAccordionOpen && 'rotate-180 text-[#D8C28A]'
                        )}
                      />
                    </button>

                    {isAccordionOpen && (
                      <div className="px-3 pb-3 pt-1 space-y-1 bg-[#0F2A24]/60">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="block px-3 py-2 rounded-lg text-xs font-medium text-[#F2EEE3]/80 hover:text-[#D8C28A] hover:bg-[#173B32]"
                          >
                            <span className="font-semibold">{sub.label}</span>
                            {sub.desc && (
                              <p className="text-[10px] text-[#8FA39B] truncate">{sub.desc}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-[#173B32] bg-[#081714] space-y-2">
              <Link
                href="/psb/daftar"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D8C28A] text-[#0F2A24] font-bold text-sm shadow hover:bg-[#C5A55D] transition"
              >
                <Sparkles className="w-4 h-4" />
                Daftar Santri Baru (PSB)
              </Link>
              <Link
                href="/admin/login"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#173B32] text-[#F2EEE3] text-xs font-semibold hover:bg-[#1E4D41] transition"
              >
                Masuk Portal Operator
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
