'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Building,
  Loader2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatTanggal, PSB_STATUS_CONFIG } from '@/lib/utils';

interface RegistrationResult {
  regNumber: string;
  fullName: string;
  unitName: string;
  unitLevel: string;
  isBoarding: boolean;
  status: string;
  adminNotes?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
}

export default function PsbCekStatusPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 4) {
      setErrorMessage('Masukkan nomor pendaftaran, NIK, atau NISN minimal 4 karakter.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const res = await fetch(`/api/psb/status?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Data pendaftaran tidak ditemukan.');
      }

      setResult(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const statusInfo = result ? PSB_STATUS_CONFIG[result.status] || PSB_STATUS_CONFIG.PENDING : null;

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>Layanan Mandiri Santri Baru</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F2A24] tracking-tight">
            Cek Status Pendaftaran & Kelulusan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Ketikkan <strong>Nomor Registrasi</strong> (misal: <code>PSB-2026-SMP-0001</code>), <strong>NIK</strong>, atau <strong>NISN</strong> calon santri.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label="Nomor Pendaftaran / NIK / NISN"
              placeholder="Contoh: PSB-2026-SMP-0001 atau 8204..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3]"
              icon={<Search className="w-4 h-4 text-[#D8C28A]" />}
            >
              Cari Data Pendaftaran
            </Button>
          </form>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Pencarian Tidak Ditemukan:</strong>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Search Result */}
          {result && statusInfo && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Nomor Pendaftaran:</span>
                  <span className="text-base font-black font-mono text-[#0F2A24]">
                    {result.regNumber}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.badgeClass}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              {/* Status Explanation Box */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-2 text-xs">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {statusInfo.desc}
                </p>
                {result.adminNotes && (
                  <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong className="block text-amber-950 mb-0.5">Catatan Dari Panitia PSB:</strong>
                    {result.adminNotes}
                  </div>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-2 text-xs border-y border-slate-100 py-3">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nama Calon Santri:</span>
                  <strong className="text-[#0F2A24]">{result.fullName}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Unit Pendidikan:</span>
                  <span className="text-slate-700 font-medium">{result.unitName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pilihan Tempat Tinggal:</span>
                  <span className="text-emerald-800 font-bold">
                    {result.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Waktu Mendaftar:</span>
                  <span className="text-slate-700">{formatTanggal(result.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/psb/kartu/${result.regNumber}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3] text-xs font-bold transition shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#D8C28A]" />
                  <span>Buka / Cetak Kartu Pendaftaran ↗</span>
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Bantuan Panitia</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
