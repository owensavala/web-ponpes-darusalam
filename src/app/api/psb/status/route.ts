import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 4) {
      return NextResponse.json(
        { success: false, message: 'Masukkan nomor pendaftaran, NIK, atau NISN minimal 4 karakter.' },
        { status: 400 }
      );
    }

    const registration = await prisma.psbRegistration.findFirst({
      where: {
        OR: [
          { regNumber: { equals: query } },
          { nisn: { equals: query } },
          { nik: { equals: query } },
        ],
      },
      include: {
        unit: true,
        period: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Data pendaftaran tidak ditemukan. Periksa kembali nomor yang Anda masukkan.' },
        { status: 404 }
      );
    }

    // Hanya kirim field yang aman untuk publik
    return NextResponse.json({
      success: true,
      data: {
        regNumber: registration.regNumber,
        fullName: registration.fullName,
        unitName: registration.unit.name,
        unitLevel: registration.unit.level,
        isBoarding: registration.isBoarding,
        status: registration.status,
        adminNotes: registration.adminNotes,
        verifiedAt: registration.verifiedAt,
        createdAt: registration.createdAt,
      },
    });
  } catch (error) {
    console.error('Error saat cek status PSB:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
