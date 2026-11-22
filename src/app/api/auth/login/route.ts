import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { unit: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah.' },
        { status: 401 }
      );
    }

    const token = await signSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      unitId: user.unitId,
      unitName: user.unit?.name || null,
      unitSlug: user.unit?.slug || null,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        unitName: user.unit?.name || null,
      },
    });

    // Pasang secure HTTP-only cookie
    response.cookies.set({
      name: 'darussalam_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}
