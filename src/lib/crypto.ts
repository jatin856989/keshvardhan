import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.EBOOK_SIGNING_SECRET;
  if (!s || s.length < 8) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("EBOOK_SIGNING_SECRET must be set in production");
    }
    return "dev-only-insecure-secret";
  }
  return s;
}

export function hmacHex(message: string, key: string = secret()): string {
  return createHmac("sha256", key).update(message).digest("hex");
}

export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/** Signed, expiring token: payload.exp.signature (URL safe). */
export function signToken(payload: string, ttlSeconds: number): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${payload}.${exp}`;
  return `${body}.${hmacHex(body)}`;
}

export function verifyToken(token: string): { payload: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length < 3) return null;
  const sig = parts.pop() as string;
  const expStr = parts.pop() as string;
  const payload = parts.join(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return null;
  const expected = hmacHex(`${payload}.${exp}`);
  if (!safeEqualHex(sig, expected)) return null;
  if (exp < Math.floor(Date.now() / 1000)) return null;
  return { payload, exp };
}

/** Non-expiring access key for an order page (derived, so nothing to store). */
export function orderAccessKey(orderId: string): string {
  return hmacHex(`order-access:${orderId}`).slice(0, 32);
}

export function verifyOrderAccessKey(orderId: string, key: string | undefined | null): boolean {
  if (!key) return false;
  return safeEqualHex(key, orderAccessKey(orderId));
}
