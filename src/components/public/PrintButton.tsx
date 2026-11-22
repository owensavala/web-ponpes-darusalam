'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3] text-xs font-bold transition shadow-sm"
    >
      <Printer className="w-4 h-4 text-[#D8C28A]" />
      <span>Cetak / Simpan PDF</span>
    </button>
  );
}
