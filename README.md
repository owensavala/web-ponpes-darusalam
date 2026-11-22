# Portal Resmi & PSB Online Pondok Pesantren Darussalam Bacan

Sistem informasi terpadu dan Penerimaan Santri Baru (PSB) Online multi-unit untuk **Pondok Pesantren Darussalam Bacan** di bawah naungan **Yayasan Darussalam Bacan** (NPYP: `AZ5439`, SK Menkumham: `AHU 00147.50.10.2014`), Desa Kupal, Kecamatan Bacan Selatan, Kabupaten Halmahera Selatan, Maluku Utara.

---

## 🌟 Fitur Utama

1. **Portal Publik Responsif & Modern**:
   * Desain bertema **Forest Cream** (`#0F2A24`, `#173B32`, `#F2EEE3`, `#D8C28A`).
   * Mini-site mandiri untuk 5 unit pendidikan:
     * **Pondok Pesantren & Program Tahfizh Darussalam** (Nonformal / Asrama)
     * **MTs Darussalam Kupal** (Madrasah Tsanawiyah Kemenag - NPSN: `70001234`, Akreditasi B)
     * **SMP Tahfizh Darusalam Bacan** (Kemendikdasmen - NPSN: `70058312`, Akreditasi C, SK 24 September 2025)
     * **MA Darussalam Bacan** (Madrasah Aliyah Kemenag - NPSN: `70033073`, Akreditasi B)
     * **PKBM Darussalam Bacan** (Pendidikan Kesetaraan Paket A, B, C & Pelatihan Vokasi - NPSN: `P9999241`)
   * Warta berita, pengumuman penting tersemat (*pinned*), galeri foto kegiatan santri, direktori sarana prasarana kampus, dan jejak prestasi alumni (Jerman, Australia, PTN).
   * Tombol WhatsApp dinamis terhubung langsung ke admin unit masing-masing.

2. **Sistem PSB Online Multi-Step**:
   * Formulir pendaftaran multi-langkah (Pilihan Unit, Biodata Santri, Data Wali, Unggah Berkas: Foto, KK, Akta, Ijazah).
   * Generator Nomor Registrasi unik (misal: `PSB-2026-SMP-0001`).
   * Cetak Kartu Bukti Pendaftaran digital (*print-ready*).
   * Cek status pendaftaran mandiri secara real-time via Nomor Registrasi atau NIK.

3. **Dashboard Admin & CMS Mandiri (Tanpa Koding)**:
   * **Role-Based Access Control (RBAC)**:
     * `SUPER_ADMIN`: Akses penuh yayasan pusat, pengaturan global, manajemen pengguna, dan seluruh unit.
     * `ADMIN_UNIT`: Terisolasi hanya mengelola profil, warta, galeri, prestasi, dan pendaftar unit pendidikannya.
     * `PANITIA_PSB`: Verifikasi berkas, ubah status kelulusan, input catatan perbaikan berkas, dan ekspor data Excel (`.xlsx`).
   * **Full CRUD (Tambah, Edit, Hapus, Preview)** di semua modul publik: Berita, Galeri, Fasilitas, Pengurus, Prestasi, Unduhan, Periode PSB, dan Akun Pengguna.
   * **Unggah Berkas Nyata**: Komponen uploader *drag-and-drop* / *file picker* dengan pratinjau gambar otomatis dan route handler penyaji file aman.
   * **Buku Panduan Sistem In-App (`/admin/panduan`)**: Dokumentasi langkah demi langkah untuk operator yayasan.
   * **Tombol Keluar Permanen**: Header bar *sticky* dengan konfirmasi logout aman.

---

## 🛠️ Teknologi yang Digunakan

* **Framework**: Next.js 16 (App Router, Turbopack, React 19)
* **Styling**: Tailwind CSS v4 & Lucide Icons
* **Database & ORM**: Prisma ORM (SQLite bawaan / Siap ganti ke PostgreSQL)
* **Autentikasi**: JWT Session (jose) & BCrypt password hashing
* **Ekspor Data**: SheetJS (xlsx)

---

## 🚀 Panduan Instalasi Lokal

### 1. Kloning Repository & Instal Dependensi
```bash
git clone https://github.com/owensavala/web-ponpes-darusalam.git
cd web-ponpes-darusalam
npm install
```

### 2. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 3. Inisialisasi Database & Seeding
```bash
npx prisma db push
npx prisma db seed
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Akses di peramban: `http://localhost:3000`

---

## 🔑 Akun Demo Pengujian

* **Super Admin Yayasan (Akses Penuh)**:
  * Email: `admin@darussalam.sch.id` (atau `superadmin@darussalambacan.sch.id`)
  * Kata Sandi: `Darussalam2026!`
* **Operator SMP Tahfizh (Scoped Admin Unit)**:
  * Email: `smp@darussalam.sch.id` (atau `admin.smptahfizh@darussalambacan.sch.id`)
  * Kata Sandi: `Darussalam2026!`
* **Panitia PSB (Verifikasi & Ekspor Excel)**:
  * Email: `psb@darussalam.sch.id` (atau `panitia.psb@darussalambacan.sch.id`)
  * Kata Sandi: `Darussalam2026!`

---

## 🚢 Panduan Deployment

### Opsi A: Deployment ke Vercel
1. Impor repository ini ke dashboard **Vercel** (`New Project`).
2. Pasang environment variable:
   * `DATABASE_URL`: URL PostgreSQL (dari Neon, Supabase, Vercel Postgres, atau Railway).
   * `JWT_SECRET`: Kunci acak rahasia untuk sesi admin.
   * `NEXT_PUBLIC_APP_URL`: URL domain production Anda.
3. Jalankan migrasi dan seed database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

### Opsi B: Deployment ke Railway / Render / VPS (Docker)
Gunakan file `Dockerfile` yang telah disertakan:
```bash
docker build -t ponpes-darussalam .
docker run -p 3000:3000 -e DATABASE_URL="file:./dev.db" ponpes-darussalam
```

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 Yayasan Darussalam Bacan. Seluruh hak cipta dilindungi undang-undang.
