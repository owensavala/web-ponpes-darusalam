import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { formatTanggal } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(['SUPER_ADMIN', 'PANITIA_PSB', 'ADMIN_UNIT']);

    const { searchParams } = new URL(req.url);
    const unitIdParam = searchParams.get('unitId');
    const statusParam = searchParams.get('status');

    // Filter berdasarkan role: Admin unit hanya bisa unduh unit miliknya (paksa session.unitId)
    let targetUnitId = unitIdParam || undefined;
    if (session.role === 'ADMIN_UNIT') {
      targetUnitId = session.unitId || 'none';
    }

    const registrations = await prisma.psbRegistration.findMany({
      where: {
        ...(targetUnitId ? { unitId: targetUnitId } : {}),
        ...(statusParam ? { status: statusParam } : {}),
      },
      include: {
        unit: true,
        period: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format data untuk Excel
    const rows = registrations.map((r, idx) => ({
      'No': idx + 1,
      'No. Registrasi': r.regNumber,
      'Unit Pendidikan': r.unit.name,
      'Jenjang': r.unit.level,
      'Tipe Tinggal': r.isBoarding ? 'Mukim (Asrama)' : 'Non-Mukim (Laju)',
      'Nama Calon Santri': r.fullName,
      'NIK': `'${r.nik}`,
      'NISN': r.nisn ? `'${r.nisn}` : '-',
      'Jenis Kelamin': r.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan',
      'Tempat Lahir': r.birthPlace,
      'Tanggal Lahir': formatTanggal(r.birthDate),
      'Asal Sekolah': r.previousSchool || '-',
      'Alamat Domisili': r.address,
      'Nama Ayah': r.fatherName,
      'Nama Ibu': r.motherName,
      'No. WhatsApp Wali': `'${r.guardianPhone}`,
      'Pekerjaan Wali': r.guardianJob || '-',
      'Status Pendaftaran': r.status,
      'Catatan Panitia': r.adminNotes || '-',
      'Tanggal Mendaftar': formatTanggal(r.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Atur lebar kolom otomatis
    const colWidths = [
      { wch: 5 },  // No
      { wch: 22 }, // No Registrasi
      { wch: 30 }, // Unit
      { wch: 15 }, // Jenjang
      { wch: 16 }, // Tipe Tinggal
      { wch: 28 }, // Nama
      { wch: 20 }, // NIK
      { wch: 15 }, // NISN
      { wch: 14 }, // JK
      { wch: 18 }, // Tempat Lahir
      { wch: 16 }, // Tanggal Lahir
      { wch: 25 }, // Asal Sekolah
      { wch: 35 }, // Alamat
      { wch: 22 }, // Ayah
      { wch: 22 }, // Ibu
      { wch: 18 }, // WhatsApp
      { wch: 18 }, // Pekerjaan
      { wch: 16 }, // Status
      { wch: 30 }, // Catatan
      { wch: 18 }, // Tgl Daftar
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Santri Baru');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = `Data-Pendaftar-PSB-Darussalam-Bacan-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error saat export data PSB:', error);
    const msg = error instanceof Error ? error.message : 'Akses ditolak atau kesalahan server.';
    return NextResponse.json({ success: false, message: msg }, { status: 403 });
  }
}
