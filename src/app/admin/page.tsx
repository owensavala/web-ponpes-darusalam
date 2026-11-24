import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  FileText,
  Building,
  ArrowRight,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { formatTanggal, PSB_STATUS_CONFIG } from '@/lib/utils';

export const metadata = {
  title: 'Dashboard Manajemen - Admin Darussalam Bacan',
};

interface AdminDashboardProps {
  searchParams?: Promise<{ error?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardProps) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const isForbiddenError = resolvedParams.error === 'forbidden';

  const isSuperAdmin = session.role === 'SUPER_ADMIN';
  const isAdminUnit = session.role === 'ADMIN_UNIT';
  const unitFilter = isAdminUnit && session.unitId ? { unitId: session.unitId } : {};

  // Ambil metrik ringkasan
  const [
    totalRegistrations,
    pendingRegistrations,
    verifiedRegistrations,
    acceptedRegistrations,
    totalPosts,
    recentRegistrations,
    units,
  ] = await Promise.all([
    prisma.psbRegistration.count({ where: unitFilter }),
    prisma.psbRegistration.count({ where: { ...unitFilter, status: 'PENDING' } }),
    prisma.psbRegistration.count({ where: { ...unitFilter, status: 'VERIFIED' } }),
    prisma.psbRegistration.count({ where: { ...unitFilter, status: 'ACCEPTED' } }),
    prisma.post.count({ where: unitFilter }),
    prisma.psbRegistration.findMany({
      where: unitFilter,
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { unit: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { psbRegistrations: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Alert Akses Ditolak (RBAC Protection) */}
      {isForbiddenError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-sm animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <strong className="font-bold text-sm text-rose-900 block">Akses Ditolak (403 Forbidden)</strong>
            <p className="mt-0.5 text-rose-700">
              Anda tidak memiliki hak akses untuk membuka halaman tersebut. Fitur konfigurasi sistem, manajemen pengguna, dan periode PSB hanya diperuntukkan bagi <strong>Super Admin Yayasan</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner Welcome */}
      <div className="bg-gradient-to-r from-[#0F2A24] to-[#173B32] text-[#F2EEE3] rounded-3xl p-6 sm:p-8 border border-[#266052] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#D8C28A] uppercase tracking-wider bg-[#081714] px-3 py-1 rounded-full border border-[#D8C28A]/30">
            {session.role}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-2">
            Ahlan Wa Sahlan, {session.name}
          </h1>
          <p className="text-xs text-[#8FA39B] mt-0.5">
            {session.unitName ? `Panel Operator: ${session.unitName}` : 'Pusat Kontrol Terpadu Yayasan Darussalam Bacan'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/psb"
            className="px-4 py-2.5 rounded-xl bg-[#D8C28A] hover:bg-[#C5A55D] text-[#0F2A24] font-bold text-xs shadow-md transition"
          >
            Verifikasi PSB ↗
          </Link>
          <a
            href="/api/psb/export"
            download
            className="px-4 py-2.5 rounded-xl bg-[#173B32] hover:bg-[#1E4D41] text-[#F2EEE3] border border-[#266052] text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </a>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Pendaftar</span>
            <GraduationCap className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-[#0F2A24]">{totalRegistrations}</div>
          <p className="text-[11px] text-slate-500">Calon santri baru terdaftar</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-amber-700">{pendingRegistrations}</div>
          <p className="text-[11px] text-slate-500">Perlu pemeriksaan berkas</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider">Terverifikasi</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-blue-700">{verifiedRegistrations}</div>
          <p className="text-[11px] text-slate-500">Siap tes wawancara / sima&apos;an</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Santri Diterima</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{acceptedRegistrations}</div>
          <p className="text-[11px] text-slate-500">Lolos seleksi penerimaan</p>
        </div>
      </div>

      {/* Grid: Pendaftar Terbaru & Sebaran per Unit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pendaftar Terbaru */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#D8C28A]" />
              Pendaftar Santri Terbaru
            </h2>
            <Link
              href="/admin/psb"
              className="text-xs font-bold text-[#0F2A24] hover:underline"
            >
              Lihat Semua Pendaftar ↗
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRegistrations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada pendaftar santri.</p>
            ) : (
              recentRegistrations.map((reg) => {
                const statusInfo = PSB_STATUS_CONFIG[reg.status] || PSB_STATUS_CONFIG.PENDING;
                return (
                  <div
                    key={reg.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {reg.regNumber}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md font-medium">
                          {reg.unit.shortName}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F2A24] mt-0.5">
                        {reg.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {reg.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim'} &bull; Wali: {reg.fatherName} ({reg.guardianPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                        {statusInfo.label}
                      </span>
                      <Link
                        href={`/admin/psb/${reg.id}`}
                        className="px-2.5 py-1 bg-[#0F2A24] text-white text-[11px] font-bold rounded-lg hover:bg-[#173B32] transition"
                      >
                        Periksa
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Breakdown per Unit Pendidikan */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F2A24] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#D8C28A]" />
              Sebaran Pendaftar per Unit
            </h2>
          </div>

          <div className="space-y-3">
            {units.map((u) => (
              <div key={u.id} className="p-3 rounded-2xl bg-[#FCFAF6] border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0F2A24]">{u.shortName}</h4>
                  <span className="text-[10px] text-slate-500">{u.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#0F2A24]">
                    {u._count.psbRegistrations}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pendaftar</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Nav Button */}
          <div className="pt-2">
            <Link
              href="/admin/unit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <span>Kelola Profil & Kurikulum Unit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
