'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, UserCheck } from 'lucide-react';

interface GreetingExcerptProps {
  greetingText: string;
}

export default function GreetingExcerpt({ greetingText }: GreetingExcerptProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Pisahkan berdasarkan paragraf kosong ganda atau baris baru
  const paragraphs = greetingText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const isLong = paragraphs.length > 2;
  const displayedParagraphs = isExpanded || !isLong ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Container Paragraf dengan Animasi Halus */}
      <div className="relative text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
        {displayedParagraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {para}
          </p>
        ))}

        {/* Gradient Fade Overlay jika belum expanded */}
        {!isExpanded && isLong && (
          <div className="absolute -bottom-1 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Tombol Kontrol Expand & Link Profil */}
      <div className="pt-1 flex flex-wrap items-center gap-3">
        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF8F2] hover:bg-[#F2EEE3] text-[#0F2A24] border border-[#266052]/30 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 text-[#0F2A24]" />
                <span>Sembunyikan Sambutan</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-[#D8C28A]" />
                <span>Baca Sambutan Selengkapnya ({paragraphs.length - 2} paragraf lagi)</span>
              </>
            )}
          </button>
        )}

        <Link
          href="/profil/pengasuh-pengurus"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2A24] hover:text-[#173B32] hover:underline px-2 py-1.5"
        >
          <UserCheck className="w-3.5 h-3.5 text-[#173B32]" />
          <span>Profil Pengasuh & Dewan Asatidz</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
