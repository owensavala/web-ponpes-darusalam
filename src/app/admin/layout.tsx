import React from 'react';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopHeader from '@/components/admin/AdminTopHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Jika belum login, render anak langsung (supaya halaman /admin/login dapat tampil utuh tanpa sidebar)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col lg:flex-row text-[#0F2A24]">
      <AdminSidebar session={session} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminTopHeader session={session} />
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
