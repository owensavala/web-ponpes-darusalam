import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  FileText,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { formatTanggal, PSB_STATUS_CONFIG } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface AdminPsbProps {
  searchParams: Promise<{ q?: string; unit?: string; status?: string }>;
}

export const metadata = {
  title: 'Manajemen PSB - Admin Darussalam Bacan',
};

export default async function AdminPsbPage({ searchParams }: AdminPsbProps) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const { q, unit, status } = await searchParams;

  // Role filter: Admin unit hanya bisa melihat unit miliknya
  const isSuperAdmin = session.role === 'SUPER_ADMIN';
  const isPanitia = session.role === 'PANITIA_PSB';
  const isAdminUnit = session.role === 'ADMIN_UNIT';

  let unitFilter = unit ? { unitId: unit } : {};
  if (isAdminUnit) {
    unitFilter = { unitId: session.unitId || 'none' };
  }

  const [registrations, units] = await Promise.all([
    prisma.psbRegistration.findMany({
      where: {
        ...unitFilter,
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { fullName: { contains: q } },
                { regNumber: { contains: q } },
                { nik: { contains: q } },
                { nisn: { contains: q } },
                { guardianPhone: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: { unit: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const exportUrl = isAdminUnit
    ? `/api/psb/export?unitId=${session.unitId || ''}${status ? `&status=${status}` : ''}`
    : `/api/psb/export?${unit ? `unitId=${unit}&` : ''}${status ? `status=${status}` : ''}`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#D8C28A]" />
            Master Data Pendaftar PSB Santri Baru
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {registrations.length} calon santri terdaftar sesuai kriteria filter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={exportUrl}
            download
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor ke Excel (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form method="GET" className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Cari nama santri, no. registrasi, NIK, NISN..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2A24]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {!isAdminUnit && (
            <select
              name="unit"
              defaultValue={unit || ''}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2A24] bg-white"
            >
              <option value="">Semua Unit Pendidikan</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.shortName}
                </option>
              ))}
            </select>
          )}

          <select
            name="status"
            defaultValue={status || ''}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F2A24] bg-white"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Menunggu Verifikasi</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="REVISION">Perlu Perbaikan</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0F2A24] text-white text-xs font-bold rounded-xl hover:bg-[#173B32] transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCFAF6] border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Registrasi</th>
                <th className="py-3.5 px-4">Calon Santri</th>
                <th className="py-3.5 px-4">Unit & Tipe</th>
                <th className="py-3.5 px-4">Orang Tua / Wali</th>
                <th className="py-3.5 px-4">Status Berkas</th>
                <th className="py-3.5 px-4">Tgl Daftar</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data pendaftar yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const statusInfo = PSB_STATUS_CONFIG[reg.status] || PSB_STATUS_CONFIG.PENDING;
                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#0F2A24]">
                          {reg.regNumber}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          NIK: {reg.nik}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {reg.photoUrl ? (
                              <Image
                                src={reg.photoUrl}
                                alt={reg.fullName}
                                fill
                                className="object-cover"
                                sizes="32px"
                                unoptimized={reg.photoUrl.startsWith('/uploads')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {reg.fullName.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div>
                            <strong className="text-[#0F2A24] block">{reg.fullName}</strong>
                            <span className="text-[10px] text-slate-500">
                              {reg.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'} &bull; {reg.birthPlace}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0F2A24] block">{reg.unit.shortName}</span>
                        <span className="text-[10px] text-emerald-800">
                          {reg.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 block">{reg.fatherName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {reg.guardianPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {formatTanggal(reg.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/psb/${reg.id}`}
                            className="px-2.5 py-1 bg-[#0F2A24] hover:bg-[#173B32] text-white text-[11px] font-bold rounded-lg transition"
                          >
                            Periksa
                          </Link>
                          <Link
                            href={`/psb/kartu/${reg.regNumber}`}
                            target="_blank"
                            className="p-1 text-slate-500 hover:text-[#0F2A24] rounded-lg hover:bg-slate-100 transition"
                            title="Buka Kartu"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
