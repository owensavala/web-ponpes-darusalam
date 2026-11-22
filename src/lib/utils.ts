import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanggal(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatTanggalWaktu(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d) + ' WIT';
}

export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function sanitizeWaNumber(phone: string | null | undefined): string {
  if (!phone) return '6282293883344';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatWaLink(phone: string | null | undefined, message: string): string {
  const number = sanitizeWaNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function generateRegNumber(unitCode: string, sequence: number = 1): string {
  const year = new Date().getFullYear();
  const paddedSeq = String(sequence).padStart(4, '0');
  const code = unitCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'PST';
  return `PSB-${year}-${code}-${paddedSeq}`;
}

export const PSB_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; desc: string }
> = {
  PENDING: {
    label: 'Menunggu Verifikasi',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    desc: 'Berkas dan data pendaftaran Anda telah diterima dan sedang dalam antrean verifikasi panitia.',
  },
  VERIFIED: {
    label: 'Berkas Terverifikasi',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    desc: 'Berkas administrasi telah disetujui. Silakan tunggu jadwal tes seleksi / wawancara.',
  },
  REVISION: {
    label: 'Perlu Perbaikan Berkas',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    desc: 'Ada berkas yang belum jelas atau kurang lengkap. Harap segera perbaiki sesuai catatan panitia.',
  },
  ACCEPTED: {
    label: 'Selamat, DITERIMA!',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    desc: 'Alhamdulillah! Calon santri dinyatakan DITERIMA. Silakan cetak kartu dan lakukan daftar ulang.',
  },
  REJECTED: {
    label: 'Belum Diterima',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    desc: 'Mohon maaf, calon santri belum memenuhi kualifikasi seleksi tahun ini.',
  },
};
