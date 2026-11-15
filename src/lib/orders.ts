import { and, eq, inArray, sql } from "drizzle-orm";
import { getDb, schema } from "./db";
import { computeTotals, type PaymentMethod } from "./money";
import { getProduct, type ProductSlug } from "./products";
import type { CheckoutInput } from "./validation";

const { orders, orderItems, orderEvents, productStock } = schema;

export class OutOfStockError extends Error {
  constructor(public slug: string) {
    super(`Out of stock: ${slug}`);
    this.name = "OutOfStockError";
  }
}

function generateOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 46_656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  const t = (Date.now() % 100_000).toString(36).toUpperCase();
  return `KS${yy}${mm}-${t}${rand}`;
}

export interface PricedLine {
  slug: ProductSlug;
  name: string;
  sku: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
}

/** Re-prices the cart from the catalogue (never trusts client prices). */
export function priceLines(items: CheckoutInput["items"]): PricedLine[] {
  const merged = new Map<ProductSlug, number>();
  for (const item of items) {
    const slug = item.slug as ProductSlug;
    merged.set(slug, Math.min(10, (merged.get(slug) ?? 0) + item.quantity));
  }
  return Array.from(merged.entries()).map(([slug, quantity]) => {
    const p = getProduct(slug);
    if (!p) throw new Error(`Unknown product ${slug}`);
    return {
      slug,
      name: p.name,
      sku: p.sku,
      unitPricePaise: p.pricePaise,
      quantity,
      lineTotalPaise: p.pricePaise * quantity,
    };
  });
}

/** Expands bundles into the physical SKUs they consume. */
export function stockRequirements(lines: PricedLine[]): Map<ProductSlug, number> {
  const req = new Map<ProductSlug, number>();
  for (const line of lines) {
    const p = getProduct(line.slug);
    if (!p) continue;
    const slugs = p.includes && p.includes.length > 0 ? p.includes : [p.slug];
    for (const s of slugs) req.set(s, (req.get(s) ?? 0) + line.quantity);
  }
  return req;
}

export async function getStockMap(): Promise<Record<string, number>> {
  const db = getDb();
  const rows = await db.select().from(productStock);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.slug] = r.stock;
  return map;
}

export async function isInStock(slug: ProductSlug): Promise<boolean> {
  const p = getProduct(slug);
  if (!p) return false;
  const stock = await getStockMap();
  const slugs = p.includes && p.includes.length > 0 ? p.includes : [p.slug];
  return slugs.every((s) => (stock[s] ?? 0) > 0);
}

export async function createPendingOrder(
  input: CheckoutInput,
  lines: PricedLine[],
) {
  const db = getDb();
  const totals = computeTotals(lines, input.paymentMethod as PaymentMethod);
  const required = stockRequirements(lines);

  const stock = await db
    .select()
    .from(productStock)
    .where(inArray(productStock.slug, Array.from(required.keys())));
  for (const [slug, qty] of required) {
    const row = stock.find((s) => s.slug === slug);
    if (!row || row.stock < qty) throw new OutOfStockError(slug);
  }

  const c = input.customer;
  const [order] = await db
    .insert(orders)
    .values({
      orderNumber: generateOrderNumber(),
      status: "pending",
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "cod_pending" : "pending",
      subtotalPaise: totals.subtotalPaise,
      shippingPaise: totals.shippingPaise,
      codFeePaise: totals.codFeePaise,
      totalPaise: totals.totalPaise,
      customerName: c.name,
      email: c.email,
      phone: c.phone,
      addressLine1: c.addressLine1,
      addressLine2: c.addressLine2 || null,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      notes: c.notes || null,
      marketingConsent: Boolean(c.marketingConsent),
    })
    .returning();

  await db.insert(orderItems).values(
    lines.map((l) => ({
      orderId: order.id,
      productSlug: l.slug,
      name: l.name,
      sku: l.sku,
      unitPricePaise: l.unitPricePaise,
      quantity: l.quantity,
      lineTotalPaise: l.lineTotalPaise,
    })),
  );
  await db.insert(orderEvents).values({
    orderId: order.id,
    type: "created",
    data: { paymentMethod: input.paymentMethod, total: totals.totalPaise },
  });
  return { order, totals };
}

export async function attachRazorpayOrder(orderId: string, razorpayOrderId: string) {
  const db = getDb();
  await db
    .update(orders)
    .set({ razorpayOrderId, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

export async function getOrderWithItems(orderId: string) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return { order, items };
}

export async function getOrderByRazorpayOrderId(razorpayOrderId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.razorpayOrderId, razorpayOrderId))
    .limit(1);
  return order ?? null;
}

async function decrementStock(orderId: string) {
  const db = getDb();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const required = stockRequirements(
    items.map((i) => ({
      slug: i.productSlug as ProductSlug,
      name: i.name,
      sku: i.sku,
      unitPricePaise: i.unitPricePaise,
      quantity: i.quantity,
      lineTotalPaise: i.lineTotalPaise,
    })),
  );
  for (const [slug, qty] of required) {
    await db
      .update(productStock)
      .set({ stock: sql`greatest(${productStock.stock} - ${qty}, 0)`, updatedAt: new Date() })
      .where(eq(productStock.slug, slug));
  }
}

/**
 * Marks an order as paid exactly once. Both the browser callback and the
 * webhook call this; the conditional update makes it idempotent.
 * Returns true when this call performed the transition.
 */
export async function markOrderPaid(params: {
  orderId: string;
  razorpayPaymentId: string;
  source: "callback" | "webhook" | "mock";
}): Promise<boolean> {
  const db = getDb();
  const updated = await db
    .update(orders)
    .set({
      status: "paid",
      paymentStatus: "paid",
      razorpayPaymentId: params.razorpayPaymentId,
      paidAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(orders.id, params.orderId), eq(orders.paymentStatus, "pending")))
    .returning({ id: orders.id });
  if (updated.length === 0) return false;
  await decrementStock(params.orderId);
  await db.insert(orderEvents).values({
    orderId: params.orderId,
    type: "paid",
    data: { source: params.source, paymentId: params.razorpayPaymentId },
  });
  return true;
}

export async function confirmCodOrder(orderId: string): Promise<boolean> {
  const db = getDb();
  const updated = await db
    .update(orders)
    .set({ status: "cod_confirmed", updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, "pending"), eq(orders.paymentMethod, "cod")))
    .returning({ id: orders.id });
  if (updated.length === 0) return false;
  await decrementStock(orderId);
  await db.insert(orderEvents).values({ orderId, type: "cod_confirmed" });
  return true;
}

export async function markPaymentFailed(orderId: string, reason: string) {
  const db = getDb();
  await db
    .update(orders)
    .set({ paymentStatus: "failed", updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.paymentStatus, "pending")));
  await db.insert(orderEvents).values({ orderId, type: "payment_failed", data: { reason } });
}

export async function recordEvent(orderId: string, type: string, data?: unknown) {
  const db = getDb();
  await db.insert(orderEvents).values({ orderId, type, data: data ?? null });
}
