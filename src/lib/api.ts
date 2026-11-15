import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { DatabaseNotConfiguredError } from "./db";
import { clientIp, rateLimit } from "./rate-limit";

export function json(data: unknown, init?: number | ResponseInit) {
  const base: ResponseInit = typeof init === "number" ? { status: init } : (init ?? {});
  return NextResponse.json(data, {
    ...base,
    headers: { "Cache-Control": "no-store", ...(base.headers ?? {}) },
  });
}

export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function limited(req: Request, scope: string, limit: number, windowMs: number) {
  const r = rateLimit(`${scope}:${clientIp(req)}`, limit, windowMs);
  if (r.ok) return null;
  return json(
    { ok: false, message: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(r.retryAfterSeconds) } },
  );
}

export function handleError(err: unknown, fallback = "Something went wrong") {
  if (err instanceof DatabaseNotConfiguredError) {
    return json({ ok: false, message: "The store is not connected to a database yet." }, 503);
  }
  console.error(err);
  return json({ ok: false, message: fallback }, 500);
}

export async function readJson<T = unknown>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
