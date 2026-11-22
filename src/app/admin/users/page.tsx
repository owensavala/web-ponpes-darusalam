import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { Users, Plus, Key, ShieldCheck, UserCheck, Edit2 } from 'lucide-react';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import DeleteConfirmButton from '@/components/admin/DeleteConfirmButton';

export const metadata = {
  title: 'Manajemen Pengguna & RBAC - Admin Darussalam Bacan',
};

interface AdminUsersProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersProps) {
  const session = await getSession();

  if (!session || session.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  const { edit } = await searchParams;

  const [users, units] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { unit: true },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      select: { id: true, shortName: true },
    }),
  ]);

  const itemToEdit = edit ? users.find((u) => u.id === edit) : null;

  async function saveUserAction(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    const name = formData.get('name') as string;
    const email = (formData.get('email') as string).toLowerCase().trim();
    const password = (formData.get('password') as string) || '';
    const role = formData.get('role') as string;
    const unitId = (formData.get('unitId') as string) || null;

    if (userId) {
      const updateData: {
        name: string;
        email: string;
        role: string;
        unitId: string | null;
        password?: string;
      } = {
        name,
        email,
        role,
        unitId,
      };

      if (password.trim().length > 0) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    } else {
      const passwordHash = await bcrypt.hash(password || 'Darussalam2026!', 10);
      await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role,
          unitId,
          isActive: true,
        },
      });
    }

    revalidatePath('/admin/users');
    redirect('/admin/users');
  }

  async function deleteUserAction(formData: FormData) {
    'use server';
    const currentSession = await getSession();
    const userId = formData.get('userId') as string;

    if (currentSession?.id === userId) {
      // Tidak boleh menghapus akun sendiri yang sedang login
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');
  }

  async function toggleUserAction(formData: FormData) {
    'use server';
    const userId = formData.get('userId') as string;
    const currentActive = formData.get('currentActive') === 'true';

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !currentActive },
    });

    revalidatePath('/admin/users');
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0F2A24] flex items-center gap-2">
          <Users className="w-6 h-6 text-[#D8C28A]" />
          Manajemen Pengguna & Hak Akses (RBAC)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur hak akses untuk Super Admin, Operator Unit Pendidikan, dan Panitia PSB.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah / Edit User */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-[#0F2A24] flex items-center gap-1.5">
              {itemToEdit ? (
                <>
                  <Edit2 className="w-4 h-4 text-[#D8C28A]" />
                  Edit Akun Pengguna
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D8C28A]" />
                  Tambah Akun Operator Baru
                </>
              )}
            </h2>
            {itemToEdit && (
              <Link
                href="/admin/users"
                className="text-xs text-slate-500 hover:text-slate-900 underline"
              >
                Batal
              </Link>
            )}
          </div>

          <form action={saveUserAction} className="space-y-4 text-xs">
            {itemToEdit && <input type="hidden" name="userId" value={itemToEdit.id} />}

            <Input
              label="Nama Lengkap Operator"
              name="name"
              defaultValue={itemToEdit?.name || ''}
              placeholder="Contoh: Ust. Ahmad Fauzi"
              required
            />

            <Input
              label="Alamat Email (Login)"
              name="email"
              type="email"
              defaultValue={itemToEdit?.email || ''}
              placeholder="operator@darussalam.sch.id"
              required
            />

            <Input
              label={itemToEdit ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi / Password'}
              name="password"
              type="password"
              placeholder={itemToEdit ? 'Biarkan kosong untuk mempertahankan kata sandi lama' : 'Minimal 6 karakter'}
              required={!itemToEdit}
            />

            <Select
              label="Peran / Role Pengguna"
              name="role"
              defaultValue={itemToEdit?.role || 'ADMIN_UNIT'}
              options={[
                { value: 'ADMIN_UNIT', label: 'Operator Unit Pendidikan (Scoped)' },
                { value: 'PANITIA_PSB', label: 'Panitia PSB Pusat' },
                { value: 'SUPER_ADMIN', label: 'Super Admin (Akses Penuh)' },
              ]}
            />

            <div>
              <label className="block text-xs font-bold text-[#0F2A24] mb-1.5 uppercase tracking-wide">
                Tugaskan ke Unit Pendidikan (Untuk Operator Unit)
              </label>
              <select
                name="unitId"
                defaultValue={itemToEdit?.unitId || ''}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="">Tidak Ada (Umum / Panitia)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full bg-[#0F2A24] hover:bg-[#173B32] text-white"
            >
              {itemToEdit ? 'Simpan Perubahan Akun' : 'Buat Akun Pengguna'}
            </Button>
          </form>
        </div>

        {/* List User */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#0F2A24] border-b border-slate-100 pb-3">
            Daftar Pengguna Aktif ({users.length})
          </h2>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-2xl bg-[#FCFAF6] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F2A24]">{u.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {u.role}
                    </span>
                    {!u.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                    Unit: {u.unit ? u.unit.shortName : 'Yayasan Pusat'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/users?edit=${u.id}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0F2A24] hover:border-[#D8C28A] transition shadow-xs"
                    title="Edit Pengguna Ini"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>

                  <form action={toggleUserAction}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input
                      type="hidden"
                      name="currentActive"
                      value={u.isActive ? 'true' : 'false'}
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </form>

                  {session?.id !== u.id && (
                    <form action={deleteUserAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <DeleteConfirmButton
                        confirmMessage={`Apakah Anda yakin ingin menghapus akun "${u.name}" (${u.email})?`}
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

