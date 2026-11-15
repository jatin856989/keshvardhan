import { desc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isAdminRequest } from "./admin-auth";
import { getDb, schema } from "./db";

/**
 * Admin pages are always request-time: `connection()` opts out of any
 * prerender/prefetch pass before the session check reads the clock.
 */
export async function requireAdmin() {
  await connection();
  if (!(await isAdminRequest())) redirect("/admin/login");
}

export async function dashboardStats() {
  const db = getDb();
  const [byStatus, revenue, lowStock, recent, messages, waitlistCount] = await Promise.all([
    db
      .select({ status: schema.orders.status, count: sql<number>`count(*)::int` })
      .from(schema.orders)
      .groupBy(schema.orders.status),
    db
      .select({
        total: sql<number>`coalesce(sum(${schema.orders.totalPaise}), 0)::int`,
        orders: sql<number>`count(*)::int`,
      })
      .from(schema.orders)
      .where(sql`${schema.orders.status} not in ('pending', 'cancelled', 'refunded')`),
    db.select().from(schema.productStock).orderBy(schema.productStock.slug),
    db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(8),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.contactMessages).where(eq(schema.contactMessages.status, "new")),
    db.select({ count: sql<number>`count(*)::int` }).from(schema.waitlist),
  ]);
  return {
    byStatus,
    revenuePaise: revenue[0]?.total ?? 0,
    paidOrders: revenue[0]?.orders ?? 0,
    stock: lowStock,
    recent,
    newMessages: messages[0]?.count ?? 0,
    waitlist: waitlistCount[0]?.count ?? 0,
  };
}

export async function listOrders(status?: string) {
  const db = getDb();
  const q = db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(200);
  if (status && schema.orderStatusEnum.enumValues.includes(status as never)) {
    return q.where(eq(schema.orders.status, status as (typeof schema.orderStatusEnum.enumValues)[number]));
  }
  return q;
}

export async function orderDetail(id: string) {
  const db = getDb();
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
  if (!order) return null;
  const [items, events] = await Promise.all([
    db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, id)),
    db.select().from(schema.orderEvents).where(eq(schema.orderEvents.orderId, id)).orderBy(desc(schema.orderEvents.createdAt)),
  ]);
  return { order, items, events };
}

export async function listMessages() {
  return getDb().select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt)).limit(200);
}

export async function listWaitlist() {
  return getDb().select().from(schema.waitlist).orderBy(desc(schema.waitlist.createdAt)).limit(500);
}
