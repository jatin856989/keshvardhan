import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { handleError, json, limited, readJson } from "@/lib/api";
import { orderAccessKey } from "@/lib/crypto";
import { fulfilOrder } from "@/lib/fulfilment";
import { getOrderWithItems, markOrderPaid } from "@/lib/orders";
import { paymentsMode } from "@/lib/razorpay";
import { STOCK_TAG } from "@/lib/stock";

/**
 * Development-only stand-in for Razorpay. Refuses to run in production or
 * whenever real keys are configured, so it can never bypass a live gateway.
 */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production" || paymentsMode() !== "mock") {
    return json({ ok: false, message: "Not available" }, 404);
  }
  const blocked = limited(req, "mock-pay", 20, 60_000);
  if (blocked) return blocked;
  const body = await readJson<{ orderId?: string }>(req);
  const orderId = body?.orderId;
  if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) return json({ ok: false, message: "Invalid order" }, 400);
  try {
    const data = await getOrderWithItems(orderId);
    if (!data) return json({ ok: false, message: "Order not found" }, 404);
    await markOrderPaid({ orderId, razorpayPaymentId: `mock_${Date.now()}`, source: "mock" });
    revalidateTag(STOCK_TAG, "max");
    after(() => fulfilOrder(orderId));
    return json({ ok: true, accessKey: orderAccessKey(orderId) });
  } catch (err) {
    return handleError(err);
  }
}
