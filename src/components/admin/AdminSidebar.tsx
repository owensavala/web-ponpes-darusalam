'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  GraduationCap,
  Users,
  FileText,
  Camera,
  Award,
  Download,
  Settings,
  LogOut,
  Calendar,
  Menu,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserSession } from '@/lib/auth';

type NavSingleItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  visible: boolean;
};

type NavGroupItem = {
  group: string;
  items: NavSingleItem[];
};

type NavEntry = NavSingleItem | NavGroupItem;

interface AdminSidebarProps {
  session: UserSession;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSuperAdmin = session.role === 'SUPER_ADMIN';
  const isPanitia = session.role === 'PANITIA_PSB';
  const isAdminUnit = session.role === 'ADMIN_UNIT';

  const roleUnitBadge = isSuperAdmin
    ? 'SUPER ADMIN • Yayasan'
    : isAdminUnit
    ? `ADMIN UNIT • ${session.unitName || 'Unit'}`
    : `PANITIA PSB • ${session.unitName || 'Penerimaan'}`;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems: NavEntry[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-4 h-4" />,
      visible: true,
    },
    {
      label: 'Profil Unit Pendidikan',
      href: '/admin/unit',
      icon: <Building className="w-4 h-4" />,
      visible: isSuperAdmin || isAdminUnit,
    },
    {
      group: 'Layanan PSB Online',
      items: [
        {
          label: 'Data Pendaftar Santri',
          href: '/admin/psb',
          icon: <GraduationCap className="w-4 h-4" />,
          visible: true,
        },
        {
          label: 'Periode & Gelombang',
          href: '/admin/psb/periode',
          icon: <Calendar className="w-4 h-4" />,
          visible: isSuperAdmin || isPanitia,
        },
      ],
    },
    {
      group: 'Manajemen Konten',
      items: [
        {
          label: 'Berita & Pengumuman',
          href: '/admin/posts',
          icon: <FileText className="w-4 h-4" />,
          visible: isSuperAdmin || isAdminUnit,
        },
        {
          label: 'Galeri Foto & Video',
          href: '/admin/galeri',
          icon: <Camera className="w-4 h-4" />,
          visible: isSuperAdmin || isAdminUnit,
        },
        {
          label: 'Fasilitas Kampus',
          href: '/admin/fasilitas',
          icon: <Building className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
        {
          label: 'Pengurus & Asatidz',
          href: '/admin/pengurus',
          icon: <Users className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
        {
          label: 'Prestasi & Alumni',
          href: '/admin/prestasi',
          icon: <Award className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
        {
          label: 'Dokumen Unduhan',
          href: '/admin/unduhan',
          icon: <Download className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
      ],
    },
    {
      group: 'Sistem & Konfigurasi',
      items: [
        {
          label: 'Manajemen Pengguna',
          href: '/admin/users',
          icon: <Users className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
        {
          label: 'Pengaturan Yayasan',
          href: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
          visible: isSuperAdmin,
        },
        {
          label: 'Buku Panduan Sistem',
          href: '/admin/panduan',
          icon: <BookOpen className="w-4 h-4 text-[#D8C28A]" />,
          visible: true,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Bar */}
      <div className="lg:hidden bg-[#0F2A24] text-white p-4 flex items-center justify-between border-b border-[#173B32]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#173B32] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D8C28A] block">{roleUnitBadge}</span>
            <span className="text-xs font-bold text-white block truncate">{session.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 hover:text-white"
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-[#173B32] text-[#F2EEE3]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#0F2A24] text-[#F2EEE3] border-r border-[#173B32] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-[#173B32] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173B32] border border-[#D8C28A] flex items-center justify-center text-[#D8C28A] shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight">DARUSSALAM BACAN</h2>
              <p className="text-[10px] text-[#D8C28A] uppercase font-semibold">
                Portal Manajemen Resmi
              </p>
            </div>
          </div>

          {/* User Info Card with Prominent Role & Unit Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-[#173B32]/70 border border-[#266052] space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F2A24] text-[#D8C28A] border border-[#D8C28A]/40 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{roleUnitBadge}</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white truncate">{session.name}</h4>
              <p className="text-[10px] text-[#8FA39B] truncate">{session.email}</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-3 py-2 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
            {navItems.map((group, idx) => {
              if ('items' in group) {
                const visibleSubItems = group.items.filter((i) => i.visible);
                if (visibleSubItems.length === 0) return null;

                return (
                  <div key={idx} className="space-y-1">
                    <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#8FA39B]">
                      {group.group}
                    </span>
                    <div className="space-y-0.5 pt-1">
                      {visibleSubItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition',
                              isActive
                                ? 'bg-[#D8C28A] text-[#0F2A24] font-bold shadow-sm'
                                : 'text-[#8FA39B] hover:text-[#F2EEE3] hover:bg-[#173B32]'
                            )}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (!group.visible) return null;

              const isActive = pathname === group.href;
              return (
                <Link
                  key={group.href}
                  href={group.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition',
                    isActive
                      ? 'bg-[#D8C28A] text-[#0F2A24] font-bold shadow-sm'
                      : 'text-[#8FA39B] hover:text-[#F2EEE3] hover:bg-[#173B32]'
                  )}
                >
                  {group.icon}
                  <span>{group.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#173B32] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#173B32] hover:bg-[#1E4D41] text-xs font-semibold text-[#8FA39B] hover:text-[#F2EEE3] transition"
          >
            <span>Lihat Web Publik ↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-xs font-bold text-rose-300 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
