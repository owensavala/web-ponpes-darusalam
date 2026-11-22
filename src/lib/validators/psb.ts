import { z } from 'zod';

export const psbRegistrationSchema = z.object({
  unitId: z.string().min(1, 'Unit pendidikan wajib dipilih.'),
  periodId: z.string().optional(),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter.'),
  nik: z.string().regex(/^\d{16}$/, 'NIK harus 16 digit angka.'),
  nisn: z.string().optional(),
  gender: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
  birthPlace: z.string().min(2, 'Tempat lahir wajib diisi.'),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi.'),
  previousSchool: z.string().optional(),
  isBoarding: z.boolean().default(true),
  address: z.string().min(5, 'Alamat domisili lengkap wajib diisi.'),

  fatherName: z.string().min(2, 'Nama ayah kandung wajib diisi.'),
  motherName: z.string().min(2, 'Nama ibu kandung wajib diisi.'),
  guardianPhone: z
    .string()
    .min(9, 'Nomor WhatsApp minimal 9 digit.')
    .regex(/^[0-9+]+$/, 'Format nomor WhatsApp tidak valid.'),
  guardianJob: z.string().optional(),

  // URLs dari FileUpload
  photoUrl: z.string().optional(),
  kkUrl: z.string().optional(),
  aktaUrl: z.string().optional(),
  ijazahUrl: z.string().optional(),
});

export type PsbRegistrationInput = z.infer<typeof psbRegistrationSchema>;
