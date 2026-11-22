import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN_UNIT']);
    const body = await req.json();

    const { title, excerpt, content, thumbnailUrl, type, status, isPinned, unitId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Judul dan konten wajib diisi.' },
        { status: 400 }
      );
    }

    // Role check: Admin unit hanya bisa assign ke unitnya
    let assignedUnitId = unitId || null;
    if (session.role === 'ADMIN_UNIT') {
      assignedUnitId = session.unitId || null;
    }

    let slug = slugify(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        thumbnailUrl: thumbnailUrl || null,
        type: type || 'BERITA',
        status: status || 'PUBLISHED',
        isPinned: !!isPinned,
        unitId: assignedUnitId,
        authorId: session.id,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    console.error('Error create post:', error);
    const msg = error instanceof Error ? error.message : 'Kesalahan server.';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN_UNIT']);
    const body = await req.json();

    const { id, title, excerpt, content, thumbnailUrl, type, status, isPinned, unitId } = body;

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Post tidak ditemukan.' }, { status: 404 });
    }

    // Scoped check
    if (session.role === 'ADMIN_UNIT' && session.unitId && existing.unitId !== session.unitId) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    let assignedUnitId = unitId;
    if (session.role === 'ADMIN_UNIT') {
      assignedUnitId = session.unitId;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        thumbnailUrl: thumbnailUrl || null,
        type: type || 'BERITA',
        status: status || 'PUBLISHED',
        isPinned: !!isPinned,
        unitId: assignedUnitId || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: unknown) {
    console.error('Error update post:', error);
    const msg = error instanceof Error ? error.message : 'Kesalahan server.';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth(['SUPER_ADMIN', 'ADMIN_UNIT']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID post wajib disertakan.' }, { status: 400 });
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Post tidak ditemukan.' }, { status: 404 });
    }

    if (session.role === 'ADMIN_UNIT' && session.unitId && existing.unitId !== session.unitId) {
      return NextResponse.json({ success: false, message: 'Akses ditolak.' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus.' });
  } catch (error: unknown) {
    console.error('Error delete post:', error);
    const msg = error instanceof Error ? error.message : 'Kesalahan server.';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
