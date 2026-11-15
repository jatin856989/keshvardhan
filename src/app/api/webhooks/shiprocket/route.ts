import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { recordEvent } from "@/lib/orders";

/**
 * Shiprocket tracking webhook. Configure the same token in the Shiprocket
 * dashboard (Settings > API > Webhooks) as SHIPROCKET_WEBHOOK_TOKEN and it is
 * sent in the x-api-key header.
 */
const STATUS_MAP: Record<string, (typeof schema.orderStatusEnum.enumValues)[number]> = {
  "PICKED UP": "shipped",
  SHIPPED: "shipped",
  "IN TRANSIT": "shipped",
  "OUT FOR DELIVERY": "shipped",
  DELIVERED: "delivered",
  "RTO INITIATED": "rto",
  "RTO DELIVERED": "rto",
  CANCELED: "cancelled",
  CANCELLED: "cancelled",
};

export async function POST(req: Request) {
  const expected = process.env.SHIPROCKET_WEBHOOK_TOKEN;
  if (!expected || req.headers.get("x-api-key") !== expected) {
    return new Response("unauthorized", { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | { awb?: string; current_status?: string; order_id?: string; etd?: string; courier_name?: string }
    | null;
  if (!body?.awb) return Response.json({ ok: true, ignored: true });

  try {
    const db = getDb();
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.awb, String(body.awb))).limit(1);
    if (!order) return Response.json({ ok: true, ignored: true });
    const next = STATUS_MAP[(body.current_status ?? "").toUpperCase()];
    if (next && order.status !== next && !["cancelled", "refunded"].includes(order.status)) {
      await db.update(schema.orders).set({ status: next, updatedAt: new Date() }).where(eq(schema.orders.id, order.id));
    }
    await recordEvent(order.id, "tracking_update", body);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Shiprocket webhook error", err);
    return new Response("error", { status: 500 });
  }
}
