import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-token";
const isHttpsSite = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? false;
const secureCookie = process.env.AUTH_COOKIE_SECURE
  ? process.env.AUTH_COOKIE_SECURE === "true"
  : isHttpsSite;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: secureCookie,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "modline-vercel-demo-secret-change-before-production"
  );
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthUserForToken {
  id: string;
  email: string;
  role: "admin" | "user";
}

export async function createToken(user: AuthUserForToken): Promise<string> {
  return new SignJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

export function sanitizeUser<T extends { password?: string }>(user: T): Omit<T, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}
