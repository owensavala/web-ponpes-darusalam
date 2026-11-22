'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, BookOpen, ExternalLink, HelpCircle, User } from 'lucide-react';
import { UserSession } from '@/lib/auth';

interface AdminTopHeaderProps {
  session: UserSession;
}

export default function AdminTopHeader({ session }: AdminTopHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari Portal Manajemen?')) return;
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Role and Scope Context */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0F2A24] text-[#D8C28A] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <User className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F2A24]">{session.name}</span>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#0F2A24] text-[#D8C28A]">
              {session.role}
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {session.unitName ? session.unitName : 'Yayasan Darussalam Bacan (Pusat)'}
          </span>
        </div>
      </div>

      {/* Right: Quick Actions (Panduan, Web Publik, Logout) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Panduan Sistem Button */}
        <Link
          href="/admin/panduan"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden md:inline">Buku Panduan</span>
          <span className="md:hidden">Panduan</span>
        </Link>

        {/* Lihat Web Publik */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <span>Web Publik</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </Link>

        {/* ALWAYS-VISIBLE LOGOUT BUTTON */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm hover:shadow"
          title="Keluar dari Akun"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
