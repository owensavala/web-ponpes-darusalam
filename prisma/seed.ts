import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Mulai Seeding Database Ponpes Darussalam Bacan ---');

  // Bersihkan data lama jika perlu
  await prisma.psbRegistration.deleteMany();
  await prisma.psbPeriod.deleteMany();
  await prisma.documentDownload.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.leadership.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.galleryAlbum.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.educationUnit.deleteMany();
  await prisma.siteSetting.deleteMany();

  // 1. Site Setting
  await prisma.siteSetting.create({
    data: {
      id: 'default',
      siteName: 'Pondok Pesantren Darussalam Bacan',
      foundationName: 'Yayasan Darussalam Bacan',
      npyp: 'AZ5439',
      skMenkumham: 'AHU 00147.50.10.2014',
      address: 'Jl. Pesantren, Desa Kupal, Kec. Bacan Selatan, Kab. Halmahera Selatan, Maluku Utara 97791',
      mainWhatsapp: '6282293883344',
      email: 'info@darussalambacan.sch.id',
      heroTagline: "Mencetak Generasi Qur'ani, Berilmu, Berakhlak Mulia, dan Berwawasan Global di Bumi Saruma",
      greetingTitle: 'Sambutan Pengasuh Pondok Pesantren Darussalam Bacan',
      greetingName: 'KH. Asep Sofyan, Lc., M.Pd.I',
      greetingText: `Bismillaahirrohmaanirrohiim.
Assalamu'alaikum Warahmatullahi Wabarakatuh.

Alhamdulillahirabbil 'alamin, segala puji dan syukur kita panjatkan ke hadirat Allah Subhanahu Wa Ta'ala atas limpahan berkah, hidayah, dan inayah-Nya. Shalawat serta salam semoga senantiasa tercurahkan kepada junjungan alam Nabi Besar Muhammad Shallallahu 'Alaihi Wasallam, keluarga, sahabat, dan para pengikutnya hingga akhir zaman.

Pondok Pesantren Darussalam Bacan di Desa Kupal, Halmahera Selatan, berdiri tegak berakar dari ikhtiar dakwah yang tulus untuk memajukan peradaban Islam di Bumi Saruma. Sejak awal mula pengabdian kami di jazirah Halmahera Selatan pada 22 April 2008, tekad kami hanya satu: menanamkan nilai-nilai Qur'ani yang kokoh di dada generasi muda penerus bangsa.

Kami mengusung visi besar: "Satu Desa Satu Hafizh Mandiri Ekonomi". Kami meyakini bahwa santri abad ke-21 tidak hanya harus mutqin dalam hafalan 30 juz Al-Qur'an dan mutafaqqih fiddin dalam kitab turats salaf, namun juga harus berdikari secara ekonomi, menguasai keterampilan vokasi nyata (konveksi jahit busana muslimah, budidaya maggot BSF & pertanian hortikultura, peternakan, kuliner, dan otomotif), serta piawai berkomunikasi dalam bahasa dunia: Arab, Inggris, dan Mandarin.

Melalui 5 unit pendidikan dan lembaga sosial yang berada di bawah naungan Yayasan Darussalam Bacan (NPYP: AZ5439, SK Menkumham: AHU 00147.50.10.2014)—Pondok Tahfizh, MTs Darussalam, SMP Tahfizh, MA Darussalam, PKBM, hingga LKSA/Panti Asuhan Darussalam—kami siap mengantarkan para santri menembus cakrawala dunia, sebagaimana santri binaan kami yang kini sukses meraih beasiswa studi lanjut dan program Ausbildung ke Jerman.

Pintu gerbang kami di Desa Kupal senantiasa terbuka lebar bagi seluruh kaum muslimin yang ingin mempercayakan pendidikan putra-putrinya. Semoga Allah SWT meridhai setiap langkah perjuangan kita bersama. Aamiin ya Rabbal 'Alamin.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`,
      historyText: `Pondok Pesantren Darussalam Bacan memiliki jejak sejarah pengabdian dakwah yang mengakar kuat di Kabupaten Halmahera Selatan, Maluku Utara:

1. **Awal Pengabdian (22 April 2008):**
Perjalanan dimulai ketika KH. Asep Sofyan, Lc., M.Pd.I pertama kali menginjakkan kaki dan berdakwah di Halmahera Selatan sebagai dai kecamatan dalam program Pembinaan Masyarakat Berbasis Nilai (PMBN), sekaligus mengajar di Pesantren Alkhairaat Labuha.

2. **Rumah Papan Sederhana (2012):**
Dengan ketulusan membina anak-anak kepulauan membaca dan mencintai kalam ilahi, rintisan pendidikan dimulai dari sebuah rumah papan sederhana di Desa Kupal, Kecamatan Bacan Selatan.

3. **Pendirian TPQ Darussalam (1 April 2013):**
Seiring antusiasme masyarakat yang semakin tinggi, pada tanggal 1 April 2013 secara resmi didirikan Taman Pengajian Al-Qur'an (TPQ) Darussalam Kupal sebagai wadah halaqah pembinaan tahsin dan tahfizh Al-Qur'an.

4. **Legalitas Formal Kemenkumham RI (2014):**
Yayasan Darussalam Bacan secara resmi memperoleh pengesahan badan hukum dari Kementerian Hukum dan HAM RI melalui SK Menkumham Nomor AHU 00147.50.10.2014.

5. **Izin Operasional Pondok Pesantren (Januari 2018):**
Merespons kepercayaan umat, lembaga berkembang secara resmi menjadi Pondok Pesantren Darussalam Bacan setelah mengantongi izin operasional resmi dari Kementerian Agama Republik Indonesia pada Januari 2018.

6. **Penerbitan SK Operasional SMP Tahfizh (24 September 2025):**
Menjawab kebutuhan pendidikan formal tingkat pertama berbasis Al-Qur'an terakreditasi, SMP Tahfizh Darusalam Bacan resmi beroperasi dengan SK Operasional tertanggal 24 September 2025 dengan NPSN 70058312.

Kini di bawah naungan Yayasan Darussalam Bacan (NPYP: AZ5439, SK Menkumham: AHU 00147.50.10.2014), kampus pesantren di Desa Kupal mengasuh ratusan santri mukim dari berbagai pelosok Maluku Utara (Bacan, Obi, Gane, Makian, Mandioli) dan Indonesia Timur dengan sistem terintegrasi antara kepesantrenan salaf modern dan pendidikan formal berwawasan global.`,
      visionText: "Terwujudnya Pondok Pesantren Terpadu Unggulan Berlandaskan Ahlussunnah Wal Jama'ah yang Melahirkan Generasi Penghafal Al-Qur'an, Berakhlak Mulia, Menguasai Sains Teknologi, dan Mandiri Secara Ekonomi (Satu Desa Satu Hafizh Mandiri Ekonomi).",
      missionText: `1. Menyelenggarakan pendidikan tahfizh Al-Qur'an 30 juz bersanad muttashil serta kajian kitab-kitab turats salaf.
2. Mewujudkan gerakan "Satu Desa Satu Hafizh Mandiri Ekonomi" dengan membekali santri keterampilan vokasi praktis (unit konveksi jahit busana, budidaya maggot BSF ramah lingkungan, pertanian hortikultura organik, dan otomotif dasar).
3. Membina kemampuan komunikasi trilingual internasional (Bahasa Arab, Bahasa Inggris, dan Bahasa Mandarin).
4. Mengembangkan proses belajar mengajar formal berkualitas tinggi pada jenjang MTs, SMP Tahfizh, MA, dan PKBM yang terakreditasi, serta pelayanan sosial LKSA/Panti Asuhan Darussalam.
5. Membina karakter kepemimpinan, kepedulian sosial lintas agama, wawasan kebangsaan, dan membuka jejaring studi lanjut ke universitas nasional serta luar negeri (Jerman, Australia, Timur Tengah).`,
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.815!2d127.485!3d-0.642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMzgnMzEuMiJTIDEyN8KwMjknMDYuMCJF!5e0!3m2!1sid!2sid!4v1600000000000',
      instagramUrl: 'https://www.instagram.com/yayasandarussalambacan/',
      facebookUrl: 'https://www.facebook.com/profile.php?id=100088397100351',
      youtubeUrl: 'https://youtube.com/@darussalambacan',
    },
  });

  // 2. Unit Pendidikan (5 Unit)
  const unitPondok = await prisma.educationUnit.create({
    data: {
      name: 'Pondok Pesantren & Program Tahfizh Darussalam',
      shortName: 'Pondok Tahfizh',
      slug: 'pondok-tahfizh',
      level: 'Nonformal / Asrama',
      headmasterName: 'KH. Asep Sofyan, Lc., M.Pd.I',
      tagline: "Kaderisasi Penghafal Al-Qur'an 30 Juz, Trilingual & Mandiri Ekonomi",
      description: "Program asrama santri putra dan putri dengan fokus utama tahfizh Al-Qur'an 30 juz mutqin ber-tajwid, kajian kitab kuning turats salaf, penguasaan 3 bahasa asing (Arab, Inggris, Mandarin), serta pembekalan vokasi praktis (pertanian organik, peternakan, kuliner, dan otomotif) demi mewujudkan visi 'Satu Desa Satu Hafizh Mandiri Ekonomi'.",
      vision: "Menjadi pusat pencetak huffadz Al-Qur'an mutqin, berakhlakul karimah, berwawasan global, dan mandiri secara ekonomi.",
      mission: "Membina disiplin ibadah 24 jam, mengokohkan hafalan Al-Qur'an bersanad, membiasakan komunikasi trilingual (Arab, Inggris, Mandarin), dan melatih kemandirian wirausaha agrikultur santri.",
      curriculum: `### Kurikulum Kepesantrenan & Vokasi Mandiri
- **Tahfizh Al-Qur'an:** Target 5-30 Juz mutqin dengan metode Talaqqi, Tikrar, dan Sima'an berkala.
- **Kajian Kitab Kuning Turats:** Safinatun Najah, Fathul Qorib, Matan Al-Ghayah wat Taqrib (Fiqih), Jurumiyyah & Imrithi (Nahwu/Shorof), Riyadhus Shalihin & Al-Arba'in (Hadits), Ta'limul Muta'allim & Bidayatul Hidayah (Adab/Tasawuf).
- **Program Trilingual Internasional:** Penerapan lingkungan bahasa aktif harian dalam 3 bahasa dunia: **Bahasa Arab, Bahasa Inggris, dan Bahasa Mandarin**.
- **Vokasi Mandiri Santri:** Pertanian hortikultura organik di lahan percontohan, peternakan terpadu, tata boga kuliner pesantren, serta pelatihan dasar berkendara & otomotif.
- **Khitobah & Kepemimpinan:** Latihan muhadharah dan pidato multi-bahasa untuk membentuk dai pemimpin umat.`,
      extracurriculars: JSON.stringify([
        'Klub Bahasa Asing (Arab, Inggris, Mandarin)',
        'Pertanian & Agrikultur Santri Organik',
        'Seni Hadrah & Rebana Al-Banjari',
        'Kaligrafi Islam (Khath Arab)',
        'Pelatihan Otomotif Dasar & Berkendara',
        'Pencak Silat Pagar Nusa',
        'Pramuka Santri',
        'Jurnalistik & Media Pesantren',
      ]),
      dailySchedule: `### Jadwal Rutinitas Santri Asrama
- **03.30 - 04.30 :** Qiyamul Lail (Tahajjud), Sholat Hajat, dan Istighfar
- **04.30 - 05.30 :** Sholat Subuh Berjamaah & Zikir Ratib Al-Haddad
- **05.30 - 06.45 :** Halaqah Tahfizh Pagi (Ziyadah / Setoran Hafalan Baru)
- **06.45 - 07.15 :** Makan Pagi, Kebersihan Kamar, Persiapan Sekolah Formal
- **07.15 - 13.30 :** Mengikuti Pendidikan Formal (MTs / SMP / MA)
- **13.30 - 14.30 :** Sholat Zhuhur Berjamaah, Makan Siang & Qailulah (Istirahat)
- **15.30 - 16.30 :** Sholat Ashar Berjamaah & Kajian Kitab Kuning
- **16.30 - 17.30 :** Olahraga Santri & Kebersihan Diri
- **18.00 - 19.30 :** Sholat Maghrib, Halaqah Muraja'ah Tahfizh Bersama
- **19.30 - 20.30 :** Sholat Isya Berjamaah & Makan Malam
- **20.30 - 21.30 :** Ta'lim Malam / Belajar Mandiri Terbimbing
- **22.00 - 03.30 :** Istirahat Malam`,
      whatsappNumber: '6282293883344',
      email: 'tahfizh@darussalambacan.sch.id',
      registrationFee: 150000,
      isPsbOpen: true,
      displayOrder: 1,
    },
  });

  const unitMts = await prisma.educationUnit.create({
    data: {
      name: 'MTs Darussalam Kupal',
      shortName: 'MTs Darussalam',
      slug: 'mts-darussalam',
      level: 'Madrasah Tsanawiyah (Kemenag)',
      npsn: '70001234',
      accreditation: 'B',
      headmasterName: 'Ahmad Dahlan, S.Pd.I',
      tagline: 'Pendidikan Menengah Islami Terakreditasi dengan Fondasi Keagamaan Kuat',
      description: 'Madrasah Tsanawiyah di bawah naungan Kementerian Agama yang mengintegrasikan Kurikulum Merdeka Nasional dengan muatan lokal kepesantrenan.',
      vision: 'Mewujudkan lulusan madrasah yang cerdas akademis, unggul dalam ilmu agama, dan berakhlak mulia.',
      mission: 'Menerapkan pembelajaran aktif berbasis sains Islami dan teknologi informasi serta pembiasaan ibadah praktis.',
      curriculum: `### Kurikulum Terpadu MTs
- **Kurikulum Nasional Kemenag:** Al-Qur'an Hadits, Aqidah Akhlak, Fikih, SKI, Bahasa Arab.
- **Mata Pelajaran Umum:** Matematika, IPA Terpadu, IPS, Bahasa Indonesia, Bahasa Inggris, Informatika.
- **Muatan Khusus:** Tahsin Al-Qur'an, Hifzhil Qur'an Juz 30, Praktek Ibadah Fardhu 'Ain & Kifayah.`,
      extracurriculars: JSON.stringify(['Pramuka', 'PMR', 'Marching Band', 'Klub Sains Madrasah (KSM)', 'Futsal', 'Voli']),
      whatsappNumber: '6281340112233',
      email: 'mts@darussalambacan.sch.id',
      registrationFee: 100000,
      isPsbOpen: true,
      displayOrder: 2,
    },
  });

  const unitSmp = await prisma.educationUnit.create({
    data: {
      name: 'SMP Tahfizh Darusalam Bacan',
      shortName: 'SMP Tahfizh',
      slug: 'smp-tahfizh',
      level: 'SMP (Kemendikdasmen)',
      npsn: '70058312',
      accreditation: 'C',
      headmasterName: 'Muhammad Fauzi, S.Pd.I, Gr.',
      tagline: 'Sekolah Menengah Pertama Berbasis Tahfizh Qur\'an & Karakter Profil Pelajar Pancasila',
      description: 'SMP Tahfizh Darusalam Bacan (NPSN: 70058312) beroperasi berdasarkan SK Operasional tertanggal 24 September 2025. Memadukan standar kurikulum nasional Kemendikdasmen dengan program intensif tahfizh Al-Qur\'an dan literasi digital.',
      vision: 'Melahirkan cendekiawan muda berjiwa Qur\'ani, mandiri, berkarakter luhur, dan adaptif terhadap kemajuan sains teknologi.',
      mission: `1. Melaksanakan Kurikulum Merdeka dengan penguatan Proyek Penguatan Profil Pelajar Pancasila (P5) berbasis nilai Islam.
2. Memfasilitasi target hafalan minimal 3-5 juz selama masa pendidikan 3 tahun.
3. Membimbing literasi digital, riset sederhana, dan keterampilan komunikasi ilmiah.`,
      curriculum: `### Kurikulum SMP Tahfizh
- **Kurikulum Merdeka Kemendikdasmen:** Bahasa Indonesia, Bahasa Inggris, Matematika, IPA, IPS, PPKn, Informatika, PJOK, Seni Budaya.
- **Program Unggulan:** Tahfizh Tematik, Tahsin Bersanad, English & Arabic Club, Robotic & Coding Dasar.`,
      extracurriculars: JSON.stringify(['Tahfizh Club', 'Robotika Dasar', 'English Debate Club', 'Pramuka Penggalang', 'Badminton', 'Seni Musik Islami']),
      whatsappNumber: '6285244556677',
      email: 'smp.tahfizh@darussalambacan.sch.id',
      registrationFee: 150000,
      isPsbOpen: true,
      displayOrder: 3,
    },
  });

  const unitMa = await prisma.educationUnit.create({
    data: {
      name: 'MA Darussalam Bacan',
      shortName: 'MA Darussalam',
      slug: 'ma-darussalam',
      level: 'Madrasah Aliyah (Kemenag)',
      npsn: '70033073',
      accreditation: 'B',
      headmasterName: 'Drs. H. M. Taher, M.Ag',
      tagline: 'Gerbang Emas Menuju Perguruan Tinggi Terkemuka Dalam dan Luar Negeri',
      description: 'Madrasah Aliyah berakreditasi (NPSN: 70033073) yang memadukan keilmuan agama mendalam dengan jurusan IPA, IPS, dan Keagamaan. Memiliki rekam jejak santri yang berhasil menembus beasiswa perguruan tinggi luar negeri hingga Jerman.',
      vision: 'Menjadi Madrasah Aliyah rujukan di Indonesia Timur dalam mencetak kader ulama intelektual berdaya saing internasional.',
      mission: 'Membimbing penguasaan materi UTBK-SNBT, tes masuk universitas Timur Tengah (Al-Azhar Mesir/Madinah), dan beasiswa luar negeri.',
      curriculum: `### Peminatan & Kurikulum MA
- **Peminatan MIPA:** Fisika, Kimia, Biologi, Matematika Lanjutan, Laboratorium Riset.
- **Peminatan IIS (Sosial):** Sosiologi, Ekonomi, Geografi, Sejarah.
- **Peminatan Keagamaan:** Ilmu Tafsir, Ilmu Hadits, Ushul Fiqh, Bahasa Arab Tingkat Tinggi, Balaghah.
- **Persiapan Studi Lanjut:** Bimbingan Intensif Bahasa Asing (TOEFL/IELTS & TOAFL), Bimbingan SNBT & Beasiswa.`,
      extracurriculars: JSON.stringify(['Karya Ilmiah Remaja (KIR)', 'Klub Debat Ilmiah', 'Palang Merah Remaja (PMR)', 'Futsal', 'Bimbingan Beasiswa']),
      whatsappNumber: '6281248009900',
      email: 'ma@darussalambacan.sch.id',
      registrationFee: 150000,
      isPsbOpen: true,
      displayOrder: 4,
    },
  });

  const unitPkbm = await prisma.educationUnit.create({
    data: {
      name: 'PKBM Darussalam Bacan',
      shortName: 'PKBM Darussalam',
      slug: 'pkbm-darussalam',
      level: 'Pendidikan Kesetaraan (Paket A, B, C)',
      npsn: 'P9999241',
      accreditation: 'B',
      headmasterName: 'Nurul Hidayah, S.Pd',
      tagline: 'Pendidikan Kesetaraan Berijazah Resmi Negara & Pelatihan Vokasi Keterampilan Kerja',
      description: 'Pusat Kegiatan Belajar Masyarakat (NPSN: P9999241) yang melayani program Paket A (setara SD), Paket B (setara SMP), dan Paket C (setara SMA) dilengkapi pelatihan vokasi kewirausahaan dan komputer bagi santri dan masyarakat luas.',
      vision: 'Mewujudkan akses pendidikan inklusif tanpa batas usia yang menghasilkan lulusan terampil dan mandiri.',
      mission: 'Menyelenggarakan ujian kesetaraan nasional dan kursus keterampilan siap kerja (komputer perkantoran, desain grafis, tata boga, pertukangan).',
      curriculum: `### Program Kesetaraan & Vokasi
- **Paket A:** Pendidikan setara Sekolah Dasar
- **Paket B:** Pendidikan setara Sekolah Menengah Pertama
- **Paket C:** Pendidikan setara Sekolah Menengah Atas (Jurusan IPS)
- **Pelatihan Vokasi:** Aplikasi Perkantoran, Service Komputer & Jaringan, Kewirausahaan Mandiri.`,
      extracurriculars: JSON.stringify(['Kursus Desain Grafis', 'Kewirausahaan Sablon & Percetakan', 'Klub Literasi Warga']),
      whatsappNumber: '6282199887766',
      email: 'pkbm@darussalambacan.sch.id',
      registrationFee: 50000,
      isPsbOpen: true,
      displayOrder: 5,
    },
  });

  // 3. User & Admin Roles
  const defaultPasswordHash = await bcrypt.hash('Darussalam2026!', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const superAdmin = await prisma.user.create({
    data: {
      name: 'Super Admin Yayasan',
      email: 'superadmin@darussalambacan.sch.id',
      password: defaultPasswordHash,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Operator SMP Tahfizh',
      email: 'admin.smptahfizh@darussalambacan.sch.id',
      password: defaultPasswordHash,
      role: 'ADMIN_UNIT',
      unitId: unitSmp.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Panitia PSB Pusat',
      email: 'panitia.psb@darussalambacan.sch.id',
      password: defaultPasswordHash,
      role: 'PANITIA_PSB',
    },
  });

  // Alias akun tambahan untuk kemudahan login
  await prisma.user.create({
    data: {
      name: 'Administrator Yayasan (Alias)',
      email: 'admin@darussalam.sch.id',
      password: defaultPasswordHash,
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Operator SMP Tahfizh (Alias)',
      email: 'smp@darussalam.sch.id',
      password: defaultPasswordHash,
      role: 'ADMIN_UNIT',
      unitId: unitSmp.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Panitia PSB Pusat (Alias)',
      email: 'psb@darussalam.sch.id',
      password: defaultPasswordHash,
      role: 'PANITIA_PSB',
    },
  });

  // 4. Gelombang PSB
  const periodPsb = await prisma.psbPeriod.create({
    data: {
      name: 'Gelombang I - Tahun Ajaran 2026/2027',
      academicYear: '2026/2027',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-07-31'),
      isActive: true,
      requirements: `### Persyaratan Pendaftaran Santri Baru TA 2026/2027:
1. Mengisi formulir pendaftaran online secara lengkap dan benar.
2. Mengunggah Pas Foto formal santri berpakaian rapi / berpeci / berjilbab latar merah/biru.
3. Mengunggah scan / foto Kartu Keluarga (KK) yang masih berlaku.
4. Mengunggah scan / foto Akta Kelahiran calon santri.
5. Mengunggah scan / foto Ijazah atau Surat Keterangan Lulus (SKL) dari sekolah asal.
6. Membayar biaya administrasi pendaftaran sesuai unit yang dipilih.
7. Mengikuti tes baca Al-Qur'an dan wawancara komitmen orang tua (jadwal dikonfirmasi via WhatsApp).`,
    },
  });

  // 5. Sample Registrations
  await prisma.psbRegistration.create({
    data: {
      regNumber: 'PSB-2026-SMP-0001',
      periodId: periodPsb.id,
      unitId: unitSmp.id,
      fullName: 'Muhammad Rizky Pratama',
      nisn: '0098765432',
      nik: '8204011203090001',
      gender: 'LAKI_LAKI',
      birthPlace: 'Labuha, Halmahera Selatan',
      birthDate: new Date('2013-05-14'),
      previousSchool: 'SD Negeri 1 Bacan',
      isBoarding: true,
      address: 'Desa Kupal RT 03 / RW 01, Bacan Selatan, Halmahera Selatan',
      fatherName: 'Ibrahim Pratama',
      motherName: 'Siti Aminah',
      guardianPhone: '081234567890',
      guardianJob: 'Wiraswasta',
      status: 'ACCEPTED',
      adminNotes: 'Lolos seleksi hafalan Juz 30 dan wawancara asrama. Siap daftar ulang.',
      verifiedAt: new Date(),
    },
  });

  await prisma.psbRegistration.create({
    data: {
      regNumber: 'PSB-2026-PST-0002',
      periodId: periodPsb.id,
      unitId: unitPondok.id,
      fullName: 'Fathimah Az-Zahra',
      nisn: '0087654321',
      nik: '8204024508110002',
      gender: 'PEREMPUAN',
      birthPlace: 'Ternate',
      birthDate: new Date('2012-08-20'),
      previousSchool: 'MI Darul Falah',
      isBoarding: true,
      address: 'Jl. Pemuda, Desa Tomori, Bacan, Halmahera Selatan',
      fatherName: 'Ust. Zulkifli Hasan',
      motherName: 'Maryam Karim',
      guardianPhone: '081398765432',
      guardianJob: 'PNS Kemenag',
      status: 'VERIFIED',
      adminNotes: 'Berkas valid dan lengkap. Dijadwalkan tes sima\'an hafalan hari Sabtu pukul 09.00 WIT.',
      verifiedAt: new Date(),
    },
  });

  await prisma.psbRegistration.create({
    data: {
      regNumber: 'PSB-2026-MTS-0003',
      periodId: periodPsb.id,
      unitId: unitMts.id,
      fullName: 'Ahmad Bilal Al-Farisi',
      nisn: '0101122334',
      nik: '8204011501130003',
      gender: 'LAKI_LAKI',
      birthPlace: 'Kupal',
      birthDate: new Date('2013-01-15'),
      previousSchool: 'SD Inpres Kupal',
      isBoarding: false,
      address: 'Desa Kupal RT 01, Bacan Selatan',
      fatherName: 'H. Rusli',
      motherName: 'Halimah',
      guardianPhone: '082211334455',
      guardianJob: 'Petani / Nelayan',
      status: 'REVISION',
      adminNotes: 'Foto Akta Kelahiran buram dan terpotong. Harap unggah ulang dokumen yang terbaca jelas.',
    },
  });

  await prisma.psbRegistration.create({
    data: {
      regNumber: 'PSB-2026-MA-0004',
      periodId: periodPsb.id,
      unitId: unitMa.id,
      fullName: 'Zubair Abdullah',
      nisn: '0076543219',
      nik: '8204012010100004',
      gender: 'LAKI_LAKI',
      birthPlace: 'Gandawali',
      birthDate: new Date('2010-10-20'),
      previousSchool: 'MTs Darussalam Kupal',
      isBoarding: true,
      address: 'Desa Gandawali, Kasiruta Barat, Halmahera Selatan',
      fatherName: 'Abdullah Saleh',
      motherName: 'Nurjanah',
      guardianPhone: '085299887711',
      guardianJob: 'Pedagang',
      status: 'PENDING',
      adminNotes: 'Menunggu pemeriksaan berkas oleh panitia.',
    },
  });

  // 6. Posts (Berita & Pengumuman Hasil Riset Instagram Resmi @yayasandarussalambacan)
  await prisma.post.create({
    data: {
      title: "Ujian Tahfizh Al-Qur'an Semester I TP 2026/2027 Resmi Digelar di Ponpes Darussalam Bacan",
      slug: 'ujian-tahfizh-alquran-semester-1-tp-2026-2027',
      excerpt: "Pelaksanaan evaluasi capaian hafalan Al-Qur'an santri ikhwan dan akhwat berlangsung tertib dan khidmat mulai 20 hingga 25 November 2026.",
      content: `DESA KUPAL — Pondok Pesantren Darussalam Bacan resmi menggelar Ujian Tahfizh Al-Qur'an Semester I Tahun Pelajaran 2026/2027 yang dijadwalkan berlangsung dari tanggal 20 sampai 25 November 2026. Ujian ini merupakan agenda rutin semesteran sebagai tolok ukur capaian hafalan para santri, mulai dari Juz 30, Juz 1-5, 10 Juz, hingga santri program 30 Juz mutqin.

Pelaksanaan ujian santri ikhwan dipusatkan di Aula Musholla Panggung Kayu semi-terbuka dengan suasana khusyuk di hadapan dewan asatidz penguji. Para santri menyetorkan hafalan dengan metode tasmi' bil ghaib (hafalan tanpa melihat mushaf) di atas meja kecil, disimak dengan teliti tajwid, fashahah, serta kelancaran makharijul hurufnya.

Sementara itu, santri akhwat melaksanakan ujian tahfizh bertempat di Musholla Komplek Putri didampingi para ustadzah hafizhah. Pengasuh Pondok Pesantren Darussalam Bacan, KH. Asep Sofyan, Lc., M.Pd.I, mendoakan agar seluruh santri senantiasa diberikan kelapangan dada, kemudahan, keistiqomahan dalam menjaga kalam Allah SWT, dan hafalannya membawa keberkahan bagi keluarga dan umat di Halmahera Selatan.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: true,
      views: 450,
      thumbnailUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
      unitId: unitPondok.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Aksi Kerukunan Umat Beragama: Santri Darussalam Bacan Bersihkan Halaman Gereja dan Masjid HAB Kemenag',
      slug: 'santri-darussalam-bacan-bersihkan-gereja-dan-masjid-hab-kemenag',
      excerpt: 'Mewujudkan semangat toleransi dan kerukunan beragama di Bumi Saruma, santri Ponpes Darussalam Bacan bergotong-royong membersihkan Gereja Bait Saida dan Masjid Al-Mujahidin.',
      content: `LABUHA — Semangat moderasi dan persaudaraan sejati terpancar dalam peringatan Hari Amal Bakti (HAB) Kementerian Agama di Kabupaten Halmahera Selatan. Ratusan santri putra dan santriwati Pondok Pesantren Darussalam Bacan terjun langsung dalam aksi bakti sosial kebersihan rumah ibadah lintas agama.

Santri-santriwati dengan penuh antusias membawa perlengkapan sapu lidi, pengki, dan alat kebersihan membersihkan pekarangan Gereja Bait Saida di Labuha, dilanjutkan gotong royong di Masjid Al-Mujahidin Mandaong. 

Aksi nyata ini mendapat apresiasi tinggi dari para tokoh agama dan masyarakat Halmahera Selatan. KH. Asep Sofyan, Lc., M.Pd.I menegaskan bahwa santri Darussalam dididik untuk menjadi rahmatan lil 'alamin—menjunjung tinggi toleransi, menghormati kerukunan sesama anak bangsa, serta merawat harmoni keberagaman di kepulauan Maluku Utara dengan semboyan Saruma yang damai.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: true,
      views: 580,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Santri MA Darussalam Bacan Juara 1 Sepak Bola & Bulu Tangkis Antar-Madrasah Se-Kabupaten Halsel',
      slug: 'santri-ma-darussalam-juara-1-sepak-bola-bulu-tangkis-hab-kemenag',
      excerpt: 'Kontingen santri Madrasah Aliyah Darussalam membuktikan ketangguhan fisik dan sportivitas dengan memborong trofi kejuaraan olahraga HAB Kemenag.',
      content: `KABUPATEN HALMAHERA SELATAN — Prestasi membanggakan kembali dipersembahkan oleh para santri Madrasah Aliyah (MA) Darussalam Bacan. Dalam ajang perlombaan olahraga antar-madrasah se-Kabupaten Halmahera Selatan yang digelar Kemenag Halsel, kontingen santri Darussalam berhasil meraih Juara 1 Cabang Sepak Bola Kaki dan Juara Lomba Bulu Tangkis.

Penyerahan piala dan hadiah bingkisan dilakukan secara meriah pada Malam Ramah Tamah dan Tasyakuran HAB Kemenag oleh pejabat Kementerian Agama Halmahera Selatan kepada perwakilan santri MA Darussalam.

"Alhamdulillah, ini adalah buah dari kedisiplinan, kekompakan, dan latihan rutin santri di sela-sela rutinitas mengaji dan sekolah formal. Darussalam jaya, santri sehat dan berprestasi, madrasah bermartabat!" ujar pembina olahraga pesantren.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: false,
      views: 320,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
      unitId: unitMa.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Milad Ke-8 & Safari Ulama Palestina: Peletakan Batu Pertama Pembangunan Masjid Komplek Putri Ponpes Darussalam',
      slug: 'milad-ke-8-peletakan-batu-pertama-masjid-putri-ulama-palestina',
      excerpt: 'Peringatan Milad ke-8 PP Darussalam Kupal dirangkaikan dengan Isra Mi\'raj 1447 H dan peletakan batu pertama Masjid Putri bersama ulama asal Gaza, Palestina.',
      content: `DESA KUPAL — Kamis, 8 Januari 2026 (bertepatan dengan 19 Rajab 1447 H), menjadi momen bersejarah bagi keluarga besar Yayasan Darussalam Bacan. Rangkaian peringatan Milad Ke-8 Pondok Pesantren Darussalam Bacan diselenggarakan dengan penuh khidmat di kampus pesantren Desa Kupal.

Acara akbar ini dihadiri oleh penceramah tamu kehormatan asal Gaza, Palestina, Syaikh Ahmad Yousef Al-Helih, bersama Pengasuh KH. Asep Sofyan, Lc., M.Pd.I, perwakilan Pemerintah Daerah Halmahera Selatan, aparat keamanan, dan ratusan jamaah kaum muslimin.

Dengan mengangkat tema "Bangun Masjid, Bangun Generasi Qur'ani", dilaksanakan prosesi peletakan batu pertama pembangunan Masjid Komplek Putri Pondok Pesantren Darussalam Bacan. Masjid ini dirancang khusus untuk memfasilitasi sholat berjamaah dan halaqah tahfizh para santriwati tanpa harus bercampur dengan jamaah luar, demi menjaga privasi dan ketenangan ibadah santriwati.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: true,
      views: 610,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Kemandirian Santri: Ponpes Darussalam Bacan Gelar Pelatihan Vokasi Konveksi Jahit dan Budidaya Maggot BSF',
      slug: 'kemandirian-santri-konveksi-jahit-dan-budidaya-maggot-bsf',
      excerpt: 'Santriwati dibekali keahlian memproduksi busana muslimah secara mandiri, sementara santri ikhwan mengolah sampah organik lewat budidaya maggot BSF.',
      content: `DESA KUPAL — Mempertegas komitmen pada pilar kemandirian ekonomi umat, Pondok Pesantren Darussalam Bacan sukses menyelenggarakan Pelatihan Kewirausahaan dan Vokasi Santri yang resmi ditutup pada Senin, 26 Oktober 2026.

Dalam program vokasi ini, para santriwati dilatih secara intensif di unit konveksi pesantren: mulai dari pengenalan bahan kain, pembuatan pola pakaian, pemotongan, hingga pengoperasian mesin jahit modern untuk memproduksi seragam dan gamis muslimah mandiri.

Di sisi lain, santri ikhwan mempraktikkan teknologi tepat guna berupa instalasi budidaya larva Black Soldier Fly (Maggot BSF). Maggot dimanfaatkan sebagai biokonversi sampah sisa makanan pesantren menjadi pakan alternatif tinggi protein untuk ternak ayam dan ikan, menciptakan ekosistem sirkular ekonomi yang ramah lingkungan di Desa Kupal.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: false,
      views: 390,
      thumbnailUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
      authorId: superAdmin.id,
      unitId: unitPondok.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Membanggakan! Santri Ponpes Darussalam Bacan Terpilih Studi Lanjut ke Jerman & Australia',
      slug: 'santri-darussalam-bacan-studi-lanjut-ke-jerman',
      excerpt: 'Prestasi gemilang ditorehkan alumni MA Darussalam Bacan yang berhasil lolos seleksi beasiswa studi teknik di universitas terkemuka di Jerman dan Australia.',
      content: `ALHAMDULILLAH, kabar membanggakan datang dari keluarga besar Pondok Pesantren Darussalam Bacan (Ponpes Darussalam Kupal), Halmahera Selatan. Santri terbaik alumni madrasah aliyah dan program kepesantrenan berhasil menembus seleksi ketat program beasiswa studi lanjut bidang sains teknologi ke Jerman serta agrikultur ke Australia.

Pengasuh Pondok Pesantren Darussalam Bacan, KH. Asep Sofyan, Lc., M.Pd.I, menyampaikan rasa syukur yang mendalam atas capaian santri binaannya. "Ini membuktikan bahwa santri dari pelosok Halmahera Selatan mampu berdiri sejajar dengan generasi global. Memiliki hafalan Qur'an dan pemahaman kitab kuning tidak menjadi halangan untuk menguasai teknologi modern tingkat dunia," tutur beliau.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: false,
      views: 342,
      authorId: superAdmin.id,
      unitId: unitMa.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'SMP Tahfizh Darusalam Bacan Terbitkan SK Operasional Resmi dan Siap Terima Santri Baru 2026',
      slug: 'smp-tahfizh-darusalam-bacan-sk-operasional-psb-2026',
      excerpt: 'Resmi beroperasi dengan NPSN 70058312 dan SK tertanggal 24 September 2025, SMP Tahfizh Darusalam Bacan membuka pintu pendaftaran angkatan baru.',
      content: `KABUPATEN HALMAHERA SELATAN — SMP Tahfizh Darusalam Bacan kini telah mengantongi izin operasional resmi per tanggal 24 September 2025 dengan Nomor Pokok Sekolah Nasional (NPSN) 70058312. Dengan legalitas penuh ini, sekolah siap menyelenggarakan pendidikan formal terpadu tingkat pertama.

Kepala SMP Tahfizh Darusalam Bacan, Ust. Muhammad Fauzi, S.Pd.I, menyatakan bahwa kehadiran sekolah ini menjawab aspirasi para orang tua di Halmahera Selatan yang menghendaki putra-putrinya memiliki ijazah SMP formal sekaligus menjadi penghafal Al-Qur'an. Pendaftaran Santri Baru (PSB) Tahun Ajaran 2026/2027 telah resmi dibuka secara online melalui portal resmi ini.`,
      type: 'BERITA',
      status: 'PUBLISHED',
      isPinned: true,
      views: 215,
      authorId: superAdmin.id,
      unitId: unitSmp.id,
    },
  });

  await prisma.post.create({
    data: {
      title: 'Pengumuman Resmi: Pembukaan Pendaftaran Santri Baru (PSB) Gelombang 1 TA 2026/2027',
      slug: 'pembukaan-psb-gelombang-1-ta-2026-2027',
      excerpt: 'Panitia PSB Yayasan Darussalam Bacan mengumumkan dibukanya penerimaan calon santri baru untuk seluruh 5 unit pendidikan.',
      content: `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Diberitahukan kepada seluruh kaum muslimin, para orang tua dan calon santri di seluruh penjuru Maluku Utara dan sekitarnya, bahwa Panitia Penerimaan Santri Baru (PSB) Yayasan Darussalam Bacan secara resmi membuka pendaftaran Gelombang I untuk Tahun Ajaran 2026/2027.

Pendaftaran dibuka untuk 5 unit pendidikan:
1. Pondok Pesantren & Program Asrama Tahfizh Al-Qur'an 30 Juz
2. MTs Darussalam Kupal (Madrasah Tsanawiyah Kemenag)
3. SMP Tahfizh Darusalam Bacan (NPSN: 70058312)
4. MA Darussalam Bacan (Madrasah Aliyah Kemenag - NPSN: 70033073)
5. PKBM Darussalam (Paket A, B, C & Pelatihan Vokasi - NPSN: P9999241)

Pendaftaran dapat dilakukan langsung secara online melalui menu PSB Online pada website resmi ini. Segera daftarkan putra-putri Anda karena kuota asrama terbatas.`,
      type: 'PENGUMUMAN',
      status: 'PUBLISHED',
      isPinned: true,
      views: 520,
      authorId: superAdmin.id,
    },
  });

  // 7. Kepemimpinan & Pengurus
  await prisma.leadership.createMany({
    data: [
      {
        name: 'KH. Asep Sofyan, Lc., M.Pd.I',
        position: 'Pengasuh Pondok Pesantren',
        category: 'PENGASUH',
        bio: "Alumnus Universitas Al-Azhar Kairo Mesir dan Magister Pendidikan Islam. Dai PMBN perintis dakwah di Halmahera Selatan sejak 22 April 2008. Mengasuh majelis ilmu, sanad Al-Qur'an, dan kajian kitab kuning di Darussalam Bacan.",
        displayOrder: 1,
      },
      {
        name: 'Yahya Haji',
        position: 'Ketua Yayasan Darussalam Bacan',
        category: 'YAYASAN',
        bio: 'Tokoh masyarakat dan penggerak pendidikan Islam di Kabupaten Halmahera Selatan. Memimpin tata kelola kelembagaan dan pengembangan sarana yayasan.',
        displayOrder: 2,
      },
      {
        name: 'Muhammad Fauzi, S.Pd.I, Gr.',
        position: 'Kepala SMP Tahfizh Darusalam Bacan',
        category: 'KEPALA_UNIT',
        bio: 'Praktisi pendidikan berpengalaman dalam manajemen sekolah berbasis tahfizh dan kurikulum merdeka.',
        displayOrder: 3,
      },
      {
        name: 'Ahmad Dahlan, S.Pd.I',
        position: 'Kepala MTs Darussalam Kupal',
        category: 'KEPALA_UNIT',
        bio: 'Berpengalaman lebih dari 10 tahun memimpin madrasah tsanawiyah di lingkungan Kementerian Agama Halmahera Selatan.',
        displayOrder: 4,
      },
      {
        name: 'Drs. H. M. Taher, M.Ag',
        position: 'Kepala MA Darussalam Bacan',
        category: 'KEPALA_UNIT',
        bio: 'Fokus pada peningkatan mutu akademik siswa aliyah dan pembinaan persiapan tembus perguruan tinggi negeri serta luar negeri.',
        displayOrder: 5,
      },
      {
        name: 'Ustadzah Siti Fatimah, S.Ag',
        position: 'Pengasuh Tahfizh Asrama Putri',
        category: 'PENGASUH',
        bio: 'Hafizhah 30 Juz bersanad muttashil yang mengasuh kedisiplinan dan halaqah tahfizh santriwati.',
        displayOrder: 6,
      },
    ],
  });

  // 8. Fasilitas Kampus Terpadu
  await prisma.facility.createMany({
    data: [
      {
        name: "Masjid Jami' Darussalam",
        category: 'IBADAH',
        description: "Pusat peribadahan santri, sholat lima waktu berjamaah, qiyamul lail, halaqah setoran tahfizh, dan pengajian akbar umum.",
        displayOrder: 1,
      },
      {
        name: 'Masjid Komplek Putri (Tahap Pembangunan)',
        category: 'IBADAH',
        description: 'Masjid khusus santriwati seluas 400 m² yang peletakan batu pertamanya diresmikan pada Milad ke-8 oleh Syaikh Ahmad Yousef Al-Helih (ulama Gaza Palestina) dan Pemkab Halsel.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
      {
        name: 'Musholla Panggung Kayu Semi-Terbuka',
        category: 'IBADAH',
        description: 'Aula panggung khas arsitektur Bacan berlantai kayu dan karpet hijau, tempat berlangsungnya tasmi\' hafalan Al-Qur\'an, ujian tahfizh semesteran, dan kajian ba\'da shubuh santri ikhwan.',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        displayOrder: 3,
      },
      {
        name: 'Gedung Asrama Putra (Al-Fatih)',
        category: 'ASRAMA',
        description: 'Asrama bertingkat santri putra dilengkapi lemari pribadi, ventilasi asri khas kepulauan, dan pengawasan musyrik asrama 24 jam.',
        displayOrder: 4,
      },
      {
        name: 'Gedung Asrama Putri (Khadijah)',
        category: 'ASRAMA',
        description: 'Kompleks asrama putri terpisah dengan pagar mandiri, lingkungan aman, ruang muraja\'ah, dan pengasuhan ustadzah mukim.',
        displayOrder: 5,
      },
      {
        name: 'Workshop Konveksi Santriwati',
        category: 'PENUNJANG',
        description: 'Sentra pelatihan vokasi jahit dan tata busana muslimah, dilengkapi mesin jahit modern untuk memproduksi seragam sekolah dan busana santri mandiri.',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
        displayOrder: 6,
      },
      {
        name: 'Instalasi Budidaya Maggot BSF Ramah Lingkungan',
        category: 'PENUNJANG',
        description: 'Fasilitas biokonversi pengolahan sampah organik pesantren menjadi larva Black Soldier Fly berprotein tinggi untuk kemandirian pakan ternak dan edukasi lingkungan.',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
        displayOrder: 7,
      },
      {
        name: 'Bumi Perkemahan Ponpes Darussalam Kupal',
        category: 'PENUNJANG',
        description: 'Lahan perkemahan luas berlatar perbukitan asri Desa Kupal yang menjadi lokasi kegiatan Perkemahan Akbar Hari Santri Nasional (HSN) dan kepanduan Pramuka santri.',
        imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
        displayOrder: 8,
      },
      {
        name: 'Gedung Kelas & Laboratorium Komputer',
        category: 'AKADEMIK',
        description: 'Ruang kelas representatif dengan pendingin udara, proyektor, serta laboratorium komputer untuk ANBK dan literasi digital.',
        displayOrder: 9,
      },
      {
        name: 'Perpustakaan Darul Kutub',
        category: 'AKADEMIK',
        description: 'Koleksi ribuan kitab klasik turats Islam, buku sains kontemporer, ensiklopedia, dan referensi pelajaran umum.',
        displayOrder: 10,
      },
      {
        name: 'Lahan Pertanian & Kebun Hortikultura Mandiri',
        category: 'PENUNJANG',
        description: 'Sentra pelatihan agrikultur dan hortikultura sayuran organik santri di Desa Kupal guna mewujudkan visi kemandirian ekonomi pesantren.',
        displayOrder: 11,
      },
      {
        name: 'Laboratorium Bahasa Trilingual & Digital',
        category: 'AKADEMIK',
        description: 'Laboratorium multimedia berteknologi audio-visual untuk pembinaan intensif Bahasa Arab, Bahasa Inggris, dan Bahasa Mandarin santri.',
        displayOrder: 12,
      },
    ],
  });

  // 9. Prestasi & Rekam Jejak Santri
  await prisma.achievement.createMany({
    data: [
      {
        title: "Khatam 30 Juz Al-Qur'an Bersanad",
        category: 'PRESTASI',
        studentName: 'Nafira Hamja',
        year: 2024,
        description: "Santriwati berprestasi asal Desa Belang-Belang, Halmahera Selatan, yang sukses menyelesaikan setoran hafalan Al-Qur'an 30 Juz secara mutqin dan bersanad.",
        unitId: unitPondok.id,
      },
      {
        title: 'Juara 1 Lomba Sepak Bola Antar-Madrasah Se-Kabupaten Halmahera Selatan',
        category: 'PRESTASI',
        studentName: 'Tim MA Darussalam Bacan',
        year: 2026,
        description: 'Meraih medali emas dan trofi bergengsi Juara 1 dalam turnamen sepak bola antar-madrasah Hari Amal Bakti (HAB) Kementerian Agama Halmahera Selatan.',
        unitId: unitMa.id,
      },
      {
        title: 'Juara Lomba Bulu Tangkis Antar-Madrasah Se-Kabupaten Halmahera Selatan',
        category: 'PRESTASI',
        studentName: 'Santri MA Darussalam Bacan',
        year: 2026,
        description: 'Meraih gelar juara pada turnamen bulu tangkis antar-madrasah memperingati Hari Amal Bakti Kementerian Agama.',
        unitId: unitMa.id,
      },
      {
        title: 'Juara Lomba Gerak Jalan Indah HUT Kemerdekaan RI ke-81 Kabupaten Halmahera Selatan',
        category: 'PRESTASI',
        studentName: 'Regu Putri SMP Tahfizh Darusalam Bacan',
        year: 2026,
        description: 'Menampilkan kedisiplinan langkah kompak dan busana muslimah syar\'i anggun dalam lomba gerak jalan tingkat Kabupaten Halmahera Selatan di Labuha.',
        unitId: unitSmp.id,
      },
      {
        title: 'Beasiswa Penuh Studi Lanjut ke Jerman Bidang Teknik Elektro',
        category: 'ALUMNI',
        studentName: 'Ahmad Farhan Mubarak (Alumni MA)',
        year: 2025,
        description: 'Lolos beasiswa penuh program persiapan studi lanjut di universitas terkemuka di Jerman (RWTH Aachen) setelah menyelesaikan hafalan 30 Juz.',
        unitId: unitMa.id,
      },
      {
        title: 'Studi Lanjut Internasional ke Australia Bidang Sains & Agrikultur Tropis',
        category: 'ALUMNI',
        studentName: 'M. Fikri As-Syatibi (Alumni MA)',
        year: 2025,
        description: 'Meraih beasiswa pemuda berprestasi Halmahera Selatan untuk melanjutkan studi sarjana di The University of Queensland, Australia.',
        unitId: unitMa.id,
      },
    ],
  });

  // 10. Dokumen Unduhan
  await prisma.documentDownload.createMany({
    data: [
      {
        title: 'Brosur Resmi PSB TA 2026/2027 Pondok Pesantren Darussalam',
        category: 'PSB',
        fileUrl: '/uploads/documents/brosur-psb-2026.pdf',
        fileSize: '2.4 MB',
        downloads: 142,
      },
      {
        title: 'Formulir Pendaftaran Offline Santri Baru (Manual Cetak)',
        category: 'PSB',
        fileUrl: '/uploads/documents/formulir-psb-offline.pdf',
        fileSize: '850 KB',
        downloads: 87,
      },
      {
        title: 'Jadwal & Tata Tertib Ujian Tahfizh Semester I TP 2026/2027',
        category: 'AKADEMIK',
        fileUrl: '/uploads/documents/jadwal-ujian-tahfizh.pdf',
        fileSize: '650 KB',
        downloads: 98,
        unitId: unitPondok.id,
      },
      {
        title: 'SK Izin Operasional SMP Tahfizh Darusalam Bacan (24 Sept 2025)',
        category: 'SURAT',
        fileUrl: '/uploads/documents/sk-operasional-smp-tahfizh.pdf',
        fileSize: '1.1 MB',
        downloads: 110,
        unitId: unitSmp.id,
      },
    ],
  });

  // 11. Galeri Album & Foto
  const albumTahfizh = await prisma.galleryAlbum.create({
    data: {
      title: "Dokumentasi Ujian Tahfizh Al-Qur'an Semester I TP 2026/2027",
      description: "Suasana tasmi' hafalan Al-Qur'an santri ikhwan di Aula Panggung Kayu dan santri akhwat di Musholla Putri.",
      unitId: unitPondok.id,
    },
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        albumId: albumTahfizh.id,
        mediaType: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
        caption: "Santri ikhwan tasmi' hafalan di hadapan Dewan Asatidz Aula Musholla Kayu",
      },
      {
        albumId: albumTahfizh.id,
        mediaType: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1584281722572-c515a8183be7?auto=format&fit=crop&w=1200&q=80',
        caption: "Suasana muraja'ah dan sima'an berkala santriwati Komplek Putri",
      },
    ],
  });

  const albumToleransi = await prisma.galleryAlbum.create({
    data: {
      title: 'Aksi Kerukunan Umat Beragama (Gereja Bait Saida & Masjid Al-Mujahidin)',
      description: 'Giat bakti sosial santri membersihkan halaman rumah ibadah lintas agama memperingati HAB Kemenag di Halmahera Selatan.',
    },
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        albumId: albumToleransi.id,
        mediaType: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gotong royong santri menjaga kebersihan dan harmoni di Bumi Saruma',
      },
    ],
  });

  const albumVokasi = await prisma.galleryAlbum.create({
    data: {
      title: 'Kemandirian Santri: Konveksi Jahit & Budidaya Maggot BSF',
      description: 'Pelatihan pembuatan busana muslimah santriwati dan budidaya biokonversi maggot BSF santri ikhwan.',
      unitId: unitPondok.id,
    },
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        albumId: albumVokasi.id,
        mediaType: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Karya busana muslimah santriwati dan sentra budidaya maggot BSF',
      },
    ],
  });

  console.log('--- Seeding Selesai dengan Sukses! ---');
  console.log('Akun Super Admin: admin@darussalam.sch.id / admin123');
  console.log('Akun Operator SMP: smp@darussalam.sch.id / smp123');
  console.log('Akun Panitia PSB: psb@darussalam.sch.id / psb123');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
