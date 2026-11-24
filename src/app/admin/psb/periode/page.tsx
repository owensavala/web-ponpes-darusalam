import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Calendar, Plus, CheckCircle2, Clock, Edit2 } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { formatTanggal } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';

export const metadata = {
  title: 'Kelola Periode PSB - Admin Darussalam Bacan',
};

interface AdminPsbPeriodeProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminPsbPeriodePage({ searchParams }: AdminPsbPeriodeProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin?error=forbidden');
  }

  const { edit } = await searchParams;

  const periods = await prisma.psbPeriod.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  const itemToEdit = edit ? periods.find((p) => p.id === edit) : null;

  async function savePeriodAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') {
      throw new Error('Akses ditolak: Hanya Super Admin yang diizinkan mengelola periode.');
    }
    const periodId = formData.get('periodId') as string;
    const name = formData.get('name') as string;
    const academicYear = formData.get('academicYear') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const requirements = formData.get('requirements') as string;

    if (periodId) {
      await prisma.psbPeriod.update({
        where: { id: periodId },
        data: {
          name,
          academicYear,
          startDate,
          endDate,
          requirements,
        },
      });
    } else {
      await prisma.psbPeriod.create({
        data: {
          name,
          academicYear,
          startDate,
          endDate,
          isActive: true,
          requirements,
        },
      });
    }

    revalidatePath('/admin/psb/periode');
    revalidatePath('/psb/informasi');
    revalidatePath('/');
    redirect('/admin/psb/periode');
  }

  async function deletePeriodAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') {
      throw new Error('Akses ditolak: Hanya Super Admin yang diizinkan menghapus periode.');
    }
    const periodId = formData.get('periodId') as string;

    // Cek apakah ada pendaftar terikat
    const count = await prisma.psbRegistration.count({
      where: { periodId },
    });

    if (count > 0) {
      // Jangan hapus jika ada pendaftar
      return;
    }

    await prisma.psbPeriod.delete({
      where: { id: periodId },
    });

    revalidatePath('/admin/psb/periode');
    revalidatePath('/psb/informasi');
  }

  async function toggleActiveAction(formData: FormData) {
    'use server';
    const curSession = await getSession();
    if (!curSession || curSession.role !== 'SUPER_ADMIN') {
      throw new Error('Akses ditolak: Hanya Super Admin yang diizinkan mengubah status periode.');
    }
    const periodId = formData.get('periodId') as string;
    const currentActive = formData.get('currentActive') === 'true';

    await prisma.psbPeriod.update({
      where: { id: periodId },
      data: { isActive: !currentActive },
    });

    revalidatePath('/admin/psb/periode');
    revalidatePath('/psb/informasi');
  }

  // Format YYYY-MM-DD untuk input date
  const formatDateForInput = (d?: Date | null) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#D8C28A]" />
          Kelola Gelombang & Periode PSB
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur jadwal pembukaan pendaftaran santri baru, tahun ajaran, dan syarat administrasi.
        </p>
      </div>

      {/* Grid: Form Tambah/Edit & List Periode */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah / Edit */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F2A24] flex items-center gap-1.5">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-[#D8C28A]" />
                  Edit Gelombang PSB
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  Buka Gelombang Baru
                </>
              )}
            </h2>
            {itemToEdit && (
              <Link
                href="/admin/psb/periode"
                className="text-xs text-slate-500 hover:text-slate-900 underline"
              >
                Batal
              </Link>
            )}
          </div>

          <form action={savePeriodAction} className="space-y-4 text-xs">
            {itemToEdit && <input type="hidden" name="periodId" value={itemToEdit.id} />}

            <Input
              label="Nama Gelombang"
              name="name"
              defaultValue={itemToEdit?.name || ''}
              placeholder="Contoh: Gelombang 2 - TA 2026/2027"
              required
            />
            <Input
              label="Tahun Ajaran"
              name="academicYear"
              defaultValue={itemToEdit?.academicYear || '2026/2027'}
              placeholder="Contoh: 2026/2027"
              required
            />
            <Input
              label="Tanggal Mulai"
              name="startDate"
              type="date"
              defaultValue={formatDateForInput(itemToEdit?.startDate)}
              required
            />
            <Input
              label="Tanggal Penutupan"
              name="endDate"
              type="date"
              defaultValue={formatDateForInput(itemToEdit?.endDate)}
              required
            />
            <Textarea
              label="Persyaratan Pendaftaran"
              name="requirements"
              rows={4}
              defaultValue={itemToEdit?.requirements || ''}
              placeholder="Tuliskan syarat dokumen..."
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full bg-[#0F2A24] hover:bg-[#173B32] text-white"
            >
              {itemToEdit ? 'Simpan Perubahan Gelombang' : 'Terbitkan Gelombang'}
            </Button>
          </form>
        </div>

        {/* List Periode */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0F2A24] border-b border-slate-100 pb-3">
            Daftar Periode Pendaftaran ({periods.length})
          </h2>

          <div className="space-y-4">
            {periods.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F2A24]">{p.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.isActive ? 'Sedang Aktif' : 'Non-Aktif'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Jadwal: {formatTanggal(p.startDate)} s/d {formatTanggal(p.endDate)}
                  </p>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    Total: {p._count.registrations} Santri Terdaftar
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/psb/periode?edit=${p.id}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0F2A24] hover:border-[#D8C28A] transition shadow-xs"
                    title="Edit Gelombang Ini"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>

                  <form action={toggleActiveAction}>
                    <input type="hidden" name="periodId" value={p.id} />
                    <input type="hidden" name="currentActive" value={p.isActive ? 'true' : 'false'} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </form>

                  {p._count.registrations === 0 && (
                    <form action={deletePeriodAction}>
                      <input type="hidden" name="periodId" value={p.id} />
                      <DeleteConfirmButton
                        confirmMessage={`Hapus gelombang "${p.name}"?`}
                      />
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

