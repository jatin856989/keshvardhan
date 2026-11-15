import { cookies } from "next/headers";
import { signToken, verifyToken } from "./crypto";

export const ADMIN_COOKIE = "ks_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8);
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  // constant-time compare on equal-length buffers
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function createAdminSessionToken(): string {
  return signToken("admin", SESSION_TTL_SECONDS);
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parsed = verifyToken(token);
  return parsed?.payload === "admin";
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
