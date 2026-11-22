import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import PostManager from '@/components/admin/PostManager';

export const metadata = {
  title: 'Manajemen Berita & Pengumuman - Admin Darussalam Bacan',
};

export default async function AdminPostsPage() {
  const session = await getSession();

  if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN_UNIT')) {
    redirect('/admin');
  }

  const unitFilter =
    session.role === 'ADMIN_UNIT' && session.unitId ? { unitId: session.unitId } : {};

  const [posts, units] = await Promise.all([
    prisma.post.findMany({
      where: unitFilter,
      orderBy: { createdAt: 'desc' },
      include: {
        unit: { select: { shortName: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.educationUnit.findMany({
      where: { isActive: true },
      select: { id: true, shortName: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return <PostManager initialPosts={posts} units={units} />;
}
