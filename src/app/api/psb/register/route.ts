import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { psbRegistrationSchema } from '@/lib/validators/psb';
import { generateRegNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = psbRegistrationSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || 'Validasi formulir gagal.';
      return NextResponse.json(
        { success: false, message: firstError, errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Ambil Unit Pendidikan
    const unit = await prisma.educationUnit.findUnique({
      where: { id: data.unitId },
    });

    if (!unit) {
      return NextResponse.json(
        { success: false, message: 'Unit pendidikan tidak valid.' },
        { status: 400 }
      );
    }

    // Ambil Periode PSB Aktif
    let periodId = data.periodId;
    if (!periodId) {
      const activePeriod = await prisma.psbPeriod.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      if (!activePeriod) {
        return NextResponse.json(
          { success: false, message: 'Pendaftaran PSB saat ini belum dibuka.' },
          { status: 400 }
        );
      }
      periodId = activePeriod.id;
    }

    // Hitung total pendaftar untuk sequence
    const totalCount = await prisma.psbRegistration.count();
    const nextSeq = totalCount + 1;

    // Buat Nomor Registrasi Unik
    let code = 'PST';
    if (unit.slug.includes('smp')) code = 'SMP';
    else if (unit.slug.includes('mts')) code = 'MTS';
    else if (unit.slug.includes('ma')) code = 'MA';
    else if (unit.slug.includes('pkbm')) code = 'PKB';
    else if (unit.slug.includes('tahfizh')) code = 'TFZ';

    const regNumber = generateRegNumber(code, nextSeq);

    // Simpan ke database
    const registration = await prisma.psbRegistration.create({
      data: {
        regNumber,
        periodId,
        unitId: data.unitId,
        fullName: data.fullName,
        nik: data.nik,
        nisn: data.nisn || null,
        gender: data.gender,
        birthPlace: data.birthPlace,
        birthDate: new Date(data.birthDate),
        previousSchool: data.previousSchool || null,
        isBoarding: data.isBoarding,
        address: data.address,
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianPhone: data.guardianPhone,
        guardianJob: data.guardianJob || null,
        photoUrl: data.photoUrl || null,
        kkUrl: data.kkUrl || null,
        aktaUrl: data.aktaUrl || null,
        ijazahUrl: data.ijazahUrl || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil disimpan.',
      regNumber: registration.regNumber,
      id: registration.id,
    });
  } catch (error) {
    console.error('Error saat pendaftaran PSB:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memproses pendaftaran.' },
      { status: 500 }
    );
  }
}
