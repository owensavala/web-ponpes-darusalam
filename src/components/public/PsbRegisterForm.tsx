'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  User,
  Users,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';

interface UnitOption {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  level: string;
  registrationFee: number;
}

interface PsbRegisterFormProps {
  units: UnitOption[];
  periodId: string;
  periodName: string;
}

export default function PsbRegisterForm({
  units,
  periodId,
  periodName,
}: PsbRegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUnitSlug = searchParams.get('unit');

  // Cari default unit jika ada query param ?unit=...
  const defaultUnit = units.find((u) => u.slug === preselectedUnitSlug) || units[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    unitId: defaultUnit?.id || '',
    periodId: periodId,
    isBoarding: true,

    // Step 2: Calon Santri
    fullName: '',
    nik: '',
    nisn: '',
    gender: 'LAKI_LAKI',
    birthPlace: '',
    birthDate: '',
    previousSchool: '',
    address: '',

    // Step 3: Orang Tua
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    guardianJob: '',

    // Step 4: Berkas Upload
    photoUrl: '',
    kkUrl: '',
    aktaUrl: '',
    ijazahUrl: '',
  });

  // Sync unitId jika searchParams '?unit=...' terdeteksi atau berubah
  React.useEffect(() => {
    if (preselectedUnitSlug) {
      const match = units.find((u) => u.slug === preselectedUnitSlug);
      if (match && match.id !== formData.unitId) {
        setFormData((prev) => ({ ...prev, unitId: match.id }));
      }
    }
  }, [preselectedUnitSlug, units]);

  const selectedUnit = units.find((u) => u.id === formData.unitId) || units[0];

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.unitId) {
        setErrorMessage('Silakan pilih unit pendidikan yang dituju.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.fullName.trim() || formData.fullName.length < 3) {
        setErrorMessage('Nama lengkap calon santri wajib diisi (minimal 3 karakter).');
        return false;
      }
      if (!formData.nik.trim() || !/^\d{16}$/.test(formData.nik.trim())) {
        setErrorMessage('NIK wajib 16 digit angka sesuai Kartu Keluarga.');
        return false;
      }
      if (!formData.birthPlace.trim()) {
        setErrorMessage('Tempat lahir wajib diisi.');
        return false;
      }
      if (!formData.birthDate) {
        setErrorMessage('Tanggal lahir wajib diisi.');
        return false;
      }
      if (!formData.address.trim() || formData.address.length < 5) {
        setErrorMessage('Alamat domisili lengkap wajib diisi.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.fatherName.trim()) {
        setErrorMessage('Nama ayah kandung wajib diisi.');
        return false;
      }
      if (!formData.motherName.trim()) {
        setErrorMessage('Nama ibu kandung wajib diisi.');
        return false;
      }
      if (
        !formData.guardianPhone.trim() ||
        formData.guardianPhone.length < 9 ||
        !/^[0-9+]+$/.test(formData.guardianPhone)
      ) {
        setErrorMessage('Nomor WhatsApp orang tua/wali tidak valid (minimal 9 digit angka).');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/psb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mengirimkan formulir pendaftaran.');
      }

      // Berhasil, arahkan ke halaman cetak kartu
      router.push(`/psb/kartu/${data.regNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan saat mendaftar.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Progress Header */}
      <div className="bg-[#0F2A24] text-[#F2EEE3] p-6 sm:p-8 border-b border-[#173B32]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#D8C28A] uppercase tracking-wider">
              {periodName}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Formulir Pendaftaran Santri Baru
            </h2>
          </div>
          <div className="text-xs bg-[#173B32] text-[#D8C28A] px-3.5 py-1.5 rounded-full font-bold border border-[#266052] self-start sm:self-auto">
            Langkah {currentStep} dari 5
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { step: 1, title: 'Unit' },
            { step: 2, title: 'Santri' },
            { step: 3, title: 'Wali' },
            { step: 4, title: 'Berkas' },
            { step: 5, title: 'Kirim' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  currentStep === item.step
                    ? 'bg-[#D8C28A] text-[#0F2A24] ring-4 ring-[#D8C28A]/30'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#173B32] text-[#8FA39B]'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span className="text-[10px] font-semibold text-[#8FA39B] mt-1 hidden sm:block">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Perhatian:</strong>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: PILIH UNIT & JALUR ASRAMA */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D8C28A]" />
                Langkah 1: Pilih Unit Pendidikan & Tipe Kepesantrenan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pilih salah satu dari 5 unit pendidikan yang berada di bawah naungan Yayasan Darussalam Bacan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {units.map((u) => {
                const isSelected = formData.unitId === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => setFormData({ ...formData, unitId: u.id })}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#0F2A24] bg-emerald-50/50 shadow-md ring-2 ring-[#0F2A24]/10'
                        : 'border-slate-200 hover:border-[#173B32]/40 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="unitSelector"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 accent-[#0F2A24]"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {u.level}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F2A24] mt-1">{u.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Biaya pendaftaran: <strong>Rp {u.registrationFee.toLocaleString('id-ID')}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Opsi Mukim (Asrama) vs Non-Mukim */}
            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-[#0F2A24] block uppercase tracking-wide">
                Pilihan Tempat Tinggal Santri:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    formData.isBoarding
                      ? 'border-[#0F2A24] bg-white font-bold text-[#0F2A24]'
                      : 'border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="isBoarding"
                    checked={formData.isBoarding === true}
                    onChange={() => setFormData({ ...formData, isBoarding: true })}
                    className="accent-[#0F2A24]"
                  />
                  <div>
                    <span className="text-xs block">Mukim (Tinggal di Asrama)</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      Mengikuti seluruh program tahfizh & ta&apos;lim asrama 24 jam.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    !formData.isBoarding
                      ? 'border-[#0F2A24] bg-white font-bold text-[#0F2A24]'
                      : 'border-slate-200 text-slate-600 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="isBoarding"
                    checked={formData.isBoarding === false}
                    onChange={() => setFormData({ ...formData, isBoarding: false })}
                    className="accent-[#0F2A24]"
                  />
                  <div>
                    <span className="text-xs block">Non-Mukim (Laju / Pulang Pergi)</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      Khusus santri yang bertempat tinggal di sekitar Desa Kupal.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATA DIRI CALON SANTRI */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
                <User className="w-5 h-5 text-[#D8C28A]" />
                Langkah 2: Biodata Calon Santri
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi identitas diri calon santri sesuai dengan dokumen kependudukan resmi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <Input
                  label="Nama Lengkap Calon Santri"
                  name="fullName"
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  value={formData.fullName}
                  onChange={handleTextChange}
                  required
                />
              </div>

              <Input
                label="NIK (Nomor Induk Kependudukan)"
                name="nik"
                placeholder="16 digit sesuai Kartu Keluarga"
                maxLength={16}
                value={formData.nik}
                onChange={handleTextChange}
                required
              />

              <Input
                label="NISN (Jika Ada)"
                name="nisn"
                placeholder="10 digit nomor induk siswa nasional"
                value={formData.nisn}
                onChange={handleTextChange}
              />

              <Select
                label="Jenis Kelamin"
                name="gender"
                value={formData.gender}
                onChange={handleTextChange}
                required
                options={[
                  { value: 'LAKI_LAKI', label: 'Laki-Laki (Ikhwan)' },
                  { value: 'PEREMPUAN', label: 'Perempuan (Akhwat)' },
                ]}
              />

              <Input
                label="Tempat Lahir"
                name="birthPlace"
                placeholder="Contoh: Labuha / Kupal"
                value={formData.birthPlace}
                onChange={handleTextChange}
                required
              />

              <Input
                label="Tanggal Lahir"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleTextChange}
                required
              />

              <Input
                label="Asal Sekolah Sebelumnya"
                name="previousSchool"
                placeholder="Contoh: SD Negeri 1 Bacan / MI Kupal"
                value={formData.previousSchool}
                onChange={handleTextChange}
              />

              <div className="sm:col-span-2">
                <Textarea
                  label="Alamat Lengkap Domisili"
                  name="address"
                  placeholder="Jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan, Kabupaten"
                  value={formData.address}
                  onChange={handleTextChange}
                  required
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA ORANG TUA / WALI */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D8C28A]" />
                Langkah 3: Identitas Orang Tua / Wali Santri
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data orang tua/wali sangat penting untuk konfirmasi hasil seleksi dan administrasi asrama.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nama Ayah Kandung"
                name="fatherName"
                placeholder="Nama lengkap ayah"
                value={formData.fatherName}
                onChange={handleTextChange}
                required
              />

              <Input
                label="Nama Ibu Kandung"
                name="motherName"
                placeholder="Nama lengkap ibu"
                value={formData.motherName}
                onChange={handleTextChange}
                required
              />

              <Input
                label="Nomor WhatsApp Aktif Wali"
                name="guardianPhone"
                type="tel"
                placeholder="Contoh: 081234567890"
                value={formData.guardianPhone}
                onChange={handleTextChange}
                required
                helperText="Wajib nomor yang terhubung dengan WhatsApp untuk pengiriman info tes & kartu."
              />

              <Input
                label="Pekerjaan Orang Tua / Wali"
                name="guardianJob"
                placeholder="Contoh: Wiraswasta / PNS / Petani / Nelayan"
                value={formData.guardianJob}
                onChange={handleTextChange}
              />
            </div>
          </div>
        )}

        {/* STEP 4: UNGGAH BERKAS DIGITAL (REAL FILE PICKER + DRAG & DROP) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#D8C28A]" />
                Langkah 4: Unggah Berkas Digital (File Nyata)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Unggah dokumen pendukung asli secara jelas. Berkas dapat diunggah dalam format JPG, PNG, atau PDF (maks 5MB per berkas).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FileUpload
                label="Pas Foto Formal Santri"
                folder="psb"
                accept="image/jpeg,image/png,image/webp"
                value={formData.photoUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, photoUrl: url }))}
                helperText="Maks 5MB. Format gambar rapi berpeci/berjilbab."
              />

              <FileUpload
                label="Scan / Foto Kartu Keluarga (KK)"
                folder="psb"
                value={formData.kkUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, kkUrl: url }))}
                helperText="Pastikan NIK dan nama keluarga terbaca jelas."
              />

              <FileUpload
                label="Scan / Foto Akta Kelahiran"
                folder="psb"
                value={formData.aktaUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, aktaUrl: url }))}
                helperText="Dokumen resmi Disdukcapil (JPG/PNG/PDF)."
              />

              <FileUpload
                label="Scan Ijazah / SKL (Surat Keterangan Lulus)"
                folder="psb"
                value={formData.ijazahUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, ijazahUrl: url }))}
                helperText="Bila belum terbit, dapat menyusul saat daftar ulang."
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <strong>Catatan:</strong> Jika Anda belum memiliki scan Ijazah, Anda tetap dapat melanjutkan pendaftaran dan menyusulkan dokumen saat tes wawancara langsung.
            </div>
          </div>
        )}

        {/* STEP 5: TINJAU & KONFIRMASI */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F2A24] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#D8C28A]" />
                Langkah 5: Tinjau & Konfirmasi Pendaftaran
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Pastikan seluruh data yang Anda masukkan sudah benar sebelum mengirimkan formulir.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FCFAF6] border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block">Unit Dituju:</span>
                  <strong className="text-sm font-bold text-[#0F2A24]">{selectedUnit.name}</strong>
                  <span className="text-[11px] text-emerald-800 block mt-0.5">
                    {formData.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim (Laju)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Biaya Registrasi:</span>
                  <strong className="text-sm font-bold text-emerald-800">
                    Rp {selectedUnit.registrationFee.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-slate-500">Nama Calon Santri:</span>
                  <p className="font-bold text-[#0F2A24]">{formData.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-500">NIK:</span>
                  <p className="font-mono text-[#0F2A24]">{formData.nik}</p>
                </div>
                <div>
                  <span className="text-slate-500">TTL:</span>
                  <p className="text-[#0F2A24]">
                    {formData.birthPlace}, {formData.birthDate}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <p className="text-[#0F2A24]">
                    {formData.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Orang Tua / Wali:</span>
                  <p className="font-bold text-[#0F2A24]">
                    {formData.fatherName} & {formData.motherName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">No. WhatsApp Wali:</span>
                  <p className="font-mono text-[#0F2A24]">{formData.guardianPhone}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Dokumen terunggah:{' '}
                {[
                  formData.photoUrl && 'Pas Foto',
                  formData.kkUrl && 'KK',
                  formData.aktaUrl && 'Akta',
                  formData.ijazahUrl && 'Ijazah',
                ]
                  .filter(Boolean)
                  .join(', ') || 'Belum ada berkas terunggah'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                Dengan menekan tombol di bawah, saya menyatakan bahwa data yang diisi adalah benar dan sah.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={prevStep}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Kembali
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={nextStep}
              className="bg-[#0F2A24] hover:bg-[#173B32] text-[#F2EEE3]"
            >
              <span>Lanjut ke Langkah {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={isSubmitting}
              className="bg-[#D8C28A] text-[#0F2A24] hover:bg-[#C5A55D] font-black"
            >
              <span>Kirim & Terbitkan Kartu Pendaftaran ↗</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
