"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkAdminPassword,
  createAdminSessionToken,
  isAdminRequest,
} from "@/lib/admin-auth";
import { getDb, schema } from "@/lib/db";
import { fulfilOrder } from "@/lib/fulfilment";
import { recordEvent } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";
import { STOCK_TAG } from "@/lib/stock";

const STATUSES = schema.orderStatusEnum.enumValues;

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const limiter = rateLimit("admin-login", 10, 15 * 60_000);
  if (!limiter.ok) return { error: "Too many attempts. Try again in a few minutes." };
  if (!checkAdminPassword(password)) {
    return { error: "Incorrect password." };
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, createAdminSessionToken(), adminCookieOptions);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

async function assertAdmin() {
  if (!(await isAdminRequest())) redirect("/admin/login");
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const awb = String(formData.get("awb") ?? "").trim();
  const courier = String(formData.get("courier") ?? "").trim();
  const trackingUrl = String(formData.get("trackingUrl") ?? "").trim();
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;
  const db = getDb();
  await db
    .update(schema.orders)
    .set({
      status: status as (typeof STATUSES)[number],
      awb: awb || null,
      courier: courier || null,
      trackingUrl: trackingUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, id));
  await recordEvent(id, "status_changed", { status, awb, courier, by: "admin" });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function resendFulfilmentAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  await fulfilOrder(id);
  revalidatePath(`/admin/orders/${id}`);
}

export async function adjustStockAction(formData: FormData) {
  await assertAdmin();
  const slug = String(formData.get("slug") ?? "");
  const stock = Number(formData.get("stock"));
  const threshold = Number(formData.get("threshold"));
  if (!slug || !Number.isInteger(stock) || stock < 0) return;
  const db = getDb();
  await db
    .update(schema.productStock)
    .set({
      stock,
      lowStockThreshold: Number.isInteger(threshold) && threshold >= 0 ? threshold : undefined,
      updatedAt: new Date(),
    })
    .where(eq(schema.productStock.slug, slug));
  revalidateTag(STOCK_TAG, "max");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin");
}

export async function markMessageAction(formData: FormData) {
  await assertAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new");
  if (!Number.isInteger(id)) return;
  await getDb().update(schema.contactMessages).set({ status }).where(eq(schema.contactMessages.id, id));
  revalidatePath("/admin/messages");
}
