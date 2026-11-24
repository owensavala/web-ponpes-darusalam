import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'darussalam_bacan_super_secret_jwt_key_2026_halmahera_selatan';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  unitId?: string | null;
}

const SUPER_ADMIN_ONLY_PREFIXES = [
  '/admin/users',
  '/admin/settings',
  '/admin/psb/periode',
  '/admin/fasilitas',
  '/admin/pengurus',
  '/admin/prestasi',
  '/admin/unduhan',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get('darussalam_session')?.value;

  let session: TokenPayload | null = null;
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, SECRET_KEY);
      session = payload as unknown as TokenPayload;
    } catch {
      session = null;
    }
  }

  // 1. Gerbang Halaman Login (/admin/login)
  if (pathname === '/admin/login') {
    // Jika sudah login dengan session valid, redirect ke dashboard /admin
    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // 2. Proteksi Rute Admin (/admin & /admin/*)
  if (pathname.startsWith('/admin')) {
    // Jika belum login, redirect ke /admin/login
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Proteksi Khusus Super Admin
    const isSuperAdminOnly = SUPER_ADMIN_ONLY_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (isSuperAdminOnly && session.role !== 'SUPER_ADMIN') {
      // Tolak akses jika bukan SUPER_ADMIN, redirect ke /admin dengan flag error
      const adminHome = new URL('/admin', req.url);
      adminHome.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(adminHome);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
