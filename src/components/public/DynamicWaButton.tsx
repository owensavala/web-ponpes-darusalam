'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { formatWaLink } from '@/lib/utils';

interface UnitInfo {
  slug: string;
  shortName: string;
  name: string;
  whatsappNumber?: string | null;
}

interface DynamicWaButtonProps {
  units: UnitInfo[];
  defaultWhatsapp?: string;
  siteName?: string;
}

export default function DynamicWaButton({
  units,
  defaultWhatsapp = '6282293883344',
  siteName = 'Pondok Pesantren Darussalam Bacan',
}: DynamicWaButtonProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Jangan tampilkan di halaman admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Tentukan nomor dan salam berdasarkan rute halaman
  let targetPhone = defaultWhatsapp;
  let targetLabel = 'Layanan Informasi Yayasan';
  let greetingText = `Assalamu'alaikum Warahmatullahi Wabarakatuh, saya ingin menanyakan informasi seputar Pondok Pesantren Darussalam Bacan.`;

  if (pathname.startsWith('/unit/')) {
    const slug = pathname.replace('/unit/', '').split('/')[0];
    const unitMatch = units.find((u) => u.slug === slug);
    if (unitMatch) {
      targetPhone = unitMatch.whatsappNumber || defaultWhatsapp;
      targetLabel = `Operator ${unitMatch.shortName}`;
      greetingText = `Assalamu'alaikum Warahmatullahi Wabarakatuh, saya ingin bertanya tentang program dan pendaftaran di ${unitMatch.name}.`;
    }
  } else if (pathname.startsWith('/psb')) {
    targetLabel = 'Panitia PSB 2026/2027';
    greetingText = `Assalamu'alaikum Panitia PSB Darussalam Bacan, saya ingin konsultasi mengenai pendaftaran santri baru tahun ajaran 2026/2027.`;
  }

  const waLink = formatWaLink(targetPhone, greetingText);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      {/* Tooltip / Mini card saat dibuka */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 transform transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-[#0F2A24]">{targetLabel}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Butuh bantuan atau ingin berkonsultasi langsung via WhatsApp? Klik tombol di bawah untuk terhubung langsung dengan petugas kami.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <MessageCircle className="w-4 h-4" />
            Buka Chat WhatsApp
          </a>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <div className="hidden sm:block bg-[#0F2A24] text-[#F2EEE3] text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-[#173B32]">
            Hubungi {targetLabel}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition duration-200 border-2 border-white"
          aria-label="Hubungi WhatsApp Pesantren"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D8C28A] border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#0F2A24]">
            1
          </span>
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
