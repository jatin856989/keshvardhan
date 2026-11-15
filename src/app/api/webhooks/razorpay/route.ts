import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { fulfilOrder } from "@/lib/fulfilment";
import { getOrderByRazorpayOrderId, markOrderPaid, markPaymentFailed, recordEvent } from "@/lib/orders";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { STOCK_TAG } from "@/lib/stock";

interface RazorpayWebhook {
  event: string;
  payload?: {
    payment?: { entity?: { id: string; order_id?: string; status?: string; error_description?: string } };
    order?: { entity?: { id: string } };
    refund?: { entity?: { id: string; payment_id: string } };
  };
}

/**
 * Razorpay webhook receiver. Verifies X-Razorpay-Signature over the raw body,
 * records the event id for idempotency, then applies the state change. Always
 * answers 200 for verified events so Razorpay does not keep retrying.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!verifyWebhookSignature(raw, signature)) {
    return new Response("invalid signature", { status: 400 });
  }

  let event: RazorpayWebhook;
  try {
    event = JSON.parse(raw) as RazorpayWebhook;
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const eventId =
    req.headers.get("x-razorpay-event-id") ??
    `${event.event}:${event.payload?.payment?.entity?.id ?? event.payload?.order?.entity?.id ?? Date.now()}`;

  try {
    const db = getDb();
    const inserted = await db
      .insert(schema.webhookEvents)
      .values({ id: eventId, provider: "razorpay", eventType: event.event, payload: event })
      .onConflictDoNothing()
      .returning({ id: schema.webhookEvents.id });
    if (inserted.length === 0) return Response.json({ ok: true, duplicate: true });

    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id ?? event.payload?.order?.entity?.id;

    if ((event.event === "payment.captured" || event.event === "order.paid") && razorpayOrderId && payment) {
      const order = await getOrderByRazorpayOrderId(razorpayOrderId);
      if (order) {
        const transitioned = await markOrderPaid({ orderId: order.id, razorpayPaymentId: payment.id, source: "webhook" });
        if (transitioned) revalidateTag(STOCK_TAG, "max");
        after(() => fulfilOrder(order.id));
      }
    } else if (event.event === "payment.failed" && razorpayOrderId) {
      const order = await getOrderByRazorpayOrderId(razorpayOrderId);
      if (order) await markPaymentFailed(order.id, payment?.error_description ?? "payment.failed");
    } else if (event.event === "refund.processed" && event.payload?.refund?.entity) {
      const refund = event.payload.refund.entity;
      const [order] = await db
        .select({ id: schema.orders.id })
        .from(schema.orders)
        .where(eq(schema.orders.razorpayPaymentId, refund.payment_id))
        .limit(1);
      if (order) {
        await db
          .update(schema.orders)
          .set({ paymentStatus: "refunded", status: "refunded", updatedAt: new Date() })
          .where(eq(schema.orders.id, order.id));
        await recordEvent(order.id, "refund_processed", { refundId: refund.id });
      }
    }

    await db
      .update(schema.webhookEvents)
      .set({ processed: true })
      .where(eq(schema.webhookEvents.id, eventId));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Razorpay webhook error", err);
    // 500 makes Razorpay retry, which is what we want for transient DB errors.
    return new Response("error", { status: 500 });
  }
}
