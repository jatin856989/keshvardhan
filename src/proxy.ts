import { NextResponse, type NextRequest } from "next/server";
import { isProductSlug } from "@/lib/products";

const ADMIN_COOKIE = "ks_admin";

/**
 * 1. Unknown product slugs: the catalogue is fixed in code, so rewrite to a
 *    route that does not exist. Next then serves the branded not-found page
 *    with a genuine 404 status instead of a 200 shell that streams "not found".
 * 2. Admin area: optimistic guard that redirects to the login page when the
 *    session cookie is missing or has a bad signature. Pages still verify the
 *    session server-side.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const productMatch = pathname.match(/^\/products\/([^/]+)\/?$/);
  if (productMatch && !isProductSlug(decodeURIComponent(productMatch[1]))) {
    const url = request.nextUrl.clone();
    url.pathname = `/404-product${pathname}`;
    return NextResponse.rewrite(url, { status: 404 });
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verify(token))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

async function verify(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length < 3) return false;
  const sig = parts.pop()!;
  const exp = Number(parts.pop());
  const payload = parts.join(".");
  if (payload !== "admin" || !Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const secret = process.env.EBOOK_SIGNING_SECRET && process.env.EBOOK_SIGNING_SECRET.length >= 8
    ? process.env.EBOOK_SIGNING_SECRET
    : "dev-only-insecure-secret";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${payload}.${exp}`));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export const config = {
  matcher: ["/admin/:path*", "/products/:slug"],
};
