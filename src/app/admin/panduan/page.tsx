import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ShieldCheck,
  GraduationCap,
  FileText,
  Building,
  Users,
  Camera,
  Download,
  Settings,
  ArrowRight,
  CheckCircle2,
  Phone,
  FileSpreadsheet,
  UploadCloud,
} from 'lucide-react';

export const metadata = {
  title: 'Buku Panduan Penggunaan Sistem - Admin Darussalam Bacan',
};

export default function AdminPanduanPage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-linear-to-br from-[#0F2A24] via-[#173B32] to-[#0F2A24] text-white rounded-3xl p-6 sm:p-10 border border-[#266052] shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8C28A] text-[#0F2A24] text-xs font-black">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PANDUAN RESMI OPERATOR & PENGURUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Buku Panduan Pengoperasian Sistem Portal & PSB Online
          </h1>
          <p className="text-xs sm:text-sm text-[#F2EEE3]/80 leading-relaxed">
            Panduan langkah-demi-langkah bagi pengurus yayasan, kepala unit pendidikan, dan panitia PSB untuk mengelola data website secara mandiri tanpa memerlukan keahlian koding.
          </p>
        </div>
        <div className="absolute right-4 bottom-4 opacity-10 hidden sm:block">
          <HelpCircle className="w-48 h-48 text-[#D8C28A]" />
        </div>
      </div>

      {/* Daftar Modul Panduan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modul 1: PSB & Verifikasi Santri */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">1. Pengelolaan PSB & Verifikasi</h2>
              <span className="text-[11px] text-slate-500">Menu: Data Pendaftar & Periode Gelombang</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Melihat Calon Santri:</strong> Buka menu <em>Data Pendaftar Santri</em>. Anda dapat memfilter berdasarkan unit pendidikan dan status verifikasi.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Memeriksa Berkas:</strong> Klik tombol <em>Periksa</em> pada nama calon santri untuk melihat foto, KK, Akta, dan Ijazah yang diunggah.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Ubah Status & Catatan:</strong> Pilih status kelulusan (Berkas Terverifikasi, Diterima, dll.) dan ketik catatan (misal jadwal tes). Catatan ini otomatis terbaca oleh santri saat cek status mandiri.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Ekspor Excel:</strong> Klik tombol <em>Ekspor Excel</em> di pojok kanan atas untuk mengunduh rekapitulasi data pendaftar format resmi .xlsx.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/psb"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Buka Menu PSB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Modul 2: Unggah Berkas & Foto */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">2. Mengunggah Foto & Dokumen</h2>
              <span className="text-[11px] text-slate-500">Fitur File Picker & Drag-and-Drop</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Upload Langsung dari Perangkat:</strong> Di setiap form (Berita, Galeri, Fasilitas, Tokoh), klik area unggah file atau tarik file foto dari galeri HP/laptop Anda.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Format yang Didukung:</strong> File foto format JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Opsi Link URL Eksternal:</strong> Anda juga dapat memilih tab <em>Link URL</em> jika foto sudah tersimpan di Google Drive atau web hosting publik.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Uji Coba di Galeri Foto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Modul 3: Warta & Berita Resmi */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">3. Publikasi Warta & Pengumuman</h2>
              <span className="text-[11px] text-slate-500">Menu: Berita & Pengumuman</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Menulis Berita:</strong> Klik <em>Tulis Berita Baru</em>, isi judul, pilih unit terkait, unggah foto thumbnail, dan tulis artikel.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Menyematkan Pengumuman Penting:</strong> Centang opsi <em>Sematkan di Beranda (Pinned)</em> agar berita atau pengumuman selalu berada di baris teratas.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Draft vs Terbit:</strong> Pilih status <em>PUBLISHED</em> agar langsung tampil ke masyarakat, atau <em>DRAFT</em> jika masih ingin diedit nanti.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Kelola Berita & Warta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Modul 4: Fasilitas & Dewan Pengurus */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">4. Fasilitas & Asatidz</h2>
              <span className="text-[11px] text-slate-500">Menu: Fasilitas Kampus & Pengurus</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Fasilitas Baru:</strong> Masukkan nama sarana (misal: Lahan Pertanian, Lab Komputer, dll.), pilih kategori, upload foto, dan atur nomor urutan tampil.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Dewan Asatidz & Tokoh:</strong> Tambahkan pimpinan, kepala unit, dan ustadz/ustadzah pengasuh asrama lengkap dengan gelar, foto, dan biografi riwayat pendidikan.</span>
            </div>
          </div>

          <div className="pt-2 flex gap-4">
            <Link
              href="/admin/fasilitas"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Fasilitas</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/admin/pengurus"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Pengurus</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Modul 5: Profil Unit Pendidikan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">5. Profil 5 Unit Pendidikan</h2>
              <span className="text-[11px] text-slate-500">Menu: Profil Unit Pendidikan</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Pilih Unit:</strong> Super Admin dapat berpindah antar 5 unit lewat tab di atas. Operator Unit otomatis langsung diarahkan ke unitnya.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Legalitas & Kepala:</strong> Isi nomor NPSN resmi, nilai akreditasi, dan nama pimpinan unit.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Biaya & WhatsApp:</strong> Sesuaikan besaran biaya pendaftaran dan nomor WhatsApp operator agar tombol konsultasi publik langsung mengarah ke admin unit terkait.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/unit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Kelola Profil Unit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Modul 6: Pengaturan Yayasan & Kontak */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A24]">6. Identitas Yayasan & Sambutan</h2>
              <span className="text-[11px] text-slate-500">Menu: Pengaturan Yayasan</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed pt-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sambutan Pengasuh:</strong> Perbarui amanat KH. Asep Sofyan sewaktu-waktu tanpa koding. Teks ini langsung muncul di halaman beranda.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Alamat & Kontak:</strong> Perbarui nomor kontak utama, email, dan akun media sosial (Facebook, Instagram, YouTube).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sejarah & Visi Misi:</strong> Teks sejarah pendirian di Desa Kupal dan pilar visi pesantren dapat diatur di formulir ini.</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173B32] hover:text-[#0F2A24]"
            >
              <span>Buka Pengaturan Yayasan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Box Kontak Bantuan Teknis */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-amber-950">Membutuhkan Bantuan Pengoperasian?</h3>
          <p className="text-xs text-amber-900/80">
            Tim teknis dan pengembang selalu siap mendampingi bimbingan teknis bagi para operator unit di Desa Kupal.
          </p>
        </div>
        <a
          href="https://wa.me/6282293883344"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#0F2A24] text-[#D8C28A] text-xs font-bold hover:bg-[#173B32] transition flex items-center gap-2 shrink-0 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Hubungi Bantuan WA</span>
        </a>
      </div>
    </div>
  );
}
