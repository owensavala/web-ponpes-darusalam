import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'darussalam_bacan_super_secret_jwt_key_2026_halmahera_selatan';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN_UNIT' | 'PANITIA_PSB' | string;
  unitId?: string | null;
  unitName?: string | null;
  unitSlug?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('darussalam_session')?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireAuth(allowedRoles?: string[]): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}
