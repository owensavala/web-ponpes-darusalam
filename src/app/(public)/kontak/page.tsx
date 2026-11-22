import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  MessageCircle,
  Building,
  Send,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatWaLink } from '@/lib/utils';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Kontak & Lokasi Kampus',
  description: 'Alamat lengkap, nomor WhatsApp 5 unit pendidikan, dan peta lokasi Pondok Pesantren Darussalam di Desa Kupal, Bacan Selatan.',
};

export default async function KontakPage() {
  const [settings, units] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 'default' } }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <div className="bg-[#FAF8F2] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2A24] text-[#D8C28A] text-xs font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pusat Layanan & Informasi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F2A24] tracking-tight">
            Hubungi Kami & Lokasi Kampus
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Silakan berkunjung langsung ke kampus pesantren di Desa Kupal atau hubungi operator unit pendidikan kami.
          </p>
        </div>

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-[#0F2A24]">Alamat Kampus</h3>
              <p className="text-slate-600 leading-relaxed">
                {settings?.address || 'Jl. Pesantren, Desa Kupal, Kec. Bacan Selatan, Kab. Halmahera Selatan, Maluku Utara 97791'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <Phone className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-[#0F2A24]">WhatsApp Resmi</h3>
              <p className="text-slate-600">Layanan Informasi Pusat Yayasan</p>
              <a
                href={`https://wa.me/${settings?.mainWhatsapp || '6282293883344'}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#0F2A24] hover:underline font-mono inline-block pt-1"
              >
                +{settings?.mainWhatsapp || '6282293883344'}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="font-bold text-sm text-[#0F2A24]">Surel / Email</h3>
              <p className="text-slate-600">Surat menyurat dan kemitraan</p>
              <a
                href={`mailto:${settings?.email || 'info@darussalambacan.sch.id'}`}
                className="font-bold text-[#0F2A24] hover:underline inline-block pt-1"
              >
                {settings?.email || 'info@darussalambacan.sch.id'}
              </a>
            </div>
          </div>
        </div>

        {/* Directory Kontak WhatsApp 5 Unit */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-[#0F2A24] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#D8C28A]" />
              Direktori Kontak WhatsApp Langsung per Unit Pendidikan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungi langsung operator unit pendidikan sesuai jenjang yang ingin Anda tanyakan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit) => {
              const waUrl = formatWaLink(
                unit.whatsappNumber,
                `Assalamu'alaikum, saya ingin bertanya tentang ${unit.name}...`
              );
              return (
                <div
                  key={unit.slug}
                  className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {unit.level}
                    </span>
                    <h3 className="text-xs font-bold text-[#0F2A24] mt-1.5">{unit.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      +{unit.whatsappNumber || '6282293883344'}
                    </p>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat Operator {unit.shortName}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peta Lokasi & Akses Transportasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Peta Embed */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0F2A24] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D8C28A]" />
              Peta Lokasi Desa Kupal, Bacan Selatan
            </h3>

            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Peta Pondok Pesantren Darussalam Bacan di Desa Kupal"
                src="https://maps.google.com/maps?q=Kupal,+Bacan+Selatan,+Halmahera+Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Titik koordinat Desa Kupal, Kec. Bacan Selatan, Kabupaten Halmahera Selatan, Maluku Utara.
            </p>
          </div>

          {/* Panduan Rute Transportasi */}
          <div className="lg:col-span-5 bg-[#0F2A24] text-[#F2EEE3] rounded-3xl p-6 sm:p-8 border border-[#173B32] shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#D8C28A]">
              <Compass className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Petunjuk Rute & Transportasi</h3>
            </div>

            <div className="space-y-3 text-xs text-[#8FA39B] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#173B32] border border-[#266052]">
                <strong className="text-white block mb-0.5">Dari Labuha (Pusat Kota):</strong>
                Jarak sekitar 10-15 menit berkendara ke arah selatan menyusuri jalan pesisir menuju Desa Kupal.
              </div>

              <div className="p-3 rounded-xl bg-[#173B32] border border-[#266052]">
                <strong className="text-white block mb-0.5">Dari Pelabuhan Babang:</strong>
                Dapat ditempuh sekitar 25-30 menit menggunakan transportasi darat / bentor / mobil sewa.
              </div>

              <div className="p-3 rounded-xl bg-[#173B32] border border-[#266052]">
                <strong className="text-white block mb-0.5">Dari Bandara Oesman Sadik Bacan:</strong>
                Sekitar 15 menit perjalanan menuju kampus pesantren di Desa Kupal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
