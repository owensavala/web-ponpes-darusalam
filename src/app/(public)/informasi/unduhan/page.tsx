import React from 'react';
import { FileText, Download, Sparkles, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Pusat Unduhan Dokumen',
  description: 'Download brosur resmi PSB 2026/2027, formulir pendaftaran offline, tata tertib santri, dan dokumen akademik lainnya.',
};

export default async function UnduhanPage() {
  const documents = await prisma.documentDownload.findMany({
    orderBy: { createdAt: 'desc' },
    include: { unit: true },
  });

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <Download className="w-3.5 h-3.5" />
            <span>Pusat Berkas Resmi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Unduhan Dokumen & Berkas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Akses dan unduh formulir resmi, brosur pendaftaran santri baru, kalender akademik, dan panduan tata tertib.
          </p>
        </div>

        {/* Document List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm divide-y divide-slate-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {doc.category}
                    </span>
                    {doc.unit && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {doc.unit.shortName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F2A24] mt-1">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ukuran: {doc.fileSize || 'PDF'} &bull; Diunduh: {doc.downloads} kali
                  </p>
                </div>
              </div>

              <a
                href={doc.fileUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3] text-xs font-bold transition shadow-sm self-start sm:self-auto shrink-0"
              >
                <Download className="w-4 h-4 text-[#D8C28A]" />
                <span>Unduh Berkas</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
