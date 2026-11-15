import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { handleError, json, limited, readJson } from "@/lib/api";
import { orderAccessKey } from "@/lib/crypto";
import { fulfilOrder } from "@/lib/fulfilment";
import { getOrderWithItems, markOrderPaid, recordEvent } from "@/lib/orders";
import { verifyCheckoutSignature } from "@/lib/razorpay";
import { STOCK_TAG } from "@/lib/stock";
import { verifyPaymentSchema } from "@/lib/validation";

/**
 * Browser callback after Razorpay Checkout succeeds. Verifies the HMAC
 * signature with the key secret before trusting the payment. The webhook
 * performs the same transition independently; markOrderPaid is idempotent.
 */
export async function POST(req: Request) {
  const blocked = limited(req, "verify", 20, 60_000);
  if (blocked) return blocked;
  const parsed = verifyPaymentSchema.safeParse(await readJson(req));
  if (!parsed.success) return json({ ok: false, message: "Invalid payment payload" }, 400);
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  try {
    const data = await getOrderWithItems(orderId);
    if (!data) return json({ ok: false, message: "Order not found" }, 404);
    if (data.order.razorpayOrderId !== razorpay_order_id) {
      await recordEvent(orderId, "verify_mismatch", { razorpay_order_id });
      return json({ ok: false, message: "Payment does not match this order" }, 400);
    }
    const valid = verifyCheckoutSignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!valid) {
      await recordEvent(orderId, "verify_invalid_signature", { razorpay_payment_id });
      return json({ ok: false, message: "Payment signature could not be verified" }, 400);
    }
    await markOrderPaid({ orderId, razorpayPaymentId: razorpay_payment_id, source: "callback" });
    revalidateTag(STOCK_TAG, "max");
    after(() => fulfilOrder(orderId));
    return json({ ok: true, accessKey: orderAccessKey(orderId) });
  } catch (err) {
    return handleError(err, "We could not verify the payment.");
  }
}
