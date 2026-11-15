import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { fieldErrorsFrom, handleError, json, limited, readJson } from "@/lib/api";
import { orderAccessKey } from "@/lib/crypto";
import { fulfilOrder } from "@/lib/fulfilment";
import {
  attachRazorpayOrder,
  confirmCodOrder,
  createPendingOrder,
  OutOfStockError,
  priceLines,
} from "@/lib/orders";
import { createRazorpayOrder, paymentsMode, razorpayKeyId } from "@/lib/razorpay";
import { siteConfig } from "@/lib/site";
import { STOCK_TAG } from "@/lib/stock";
import { checkoutSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const blocked = limited(req, "checkout", 10, 60_000);
  if (blocked) return blocked;

  const body = await readJson(req);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) },
      400,
    );
  }
  const input = parsed.data;

  try {
    const lines = priceLines(input.items);
    const { order, totals } = await createPendingOrder(input, lines);
    const accessKey = orderAccessKey(order.id);

    if (input.paymentMethod === "cod") {
      await confirmCodOrder(order.id);
      revalidateTag(STOCK_TAG, "max");
      after(() => fulfilOrder(order.id));
      return json({ ok: true, mode: "cod", orderId: order.id, accessKey });
    }

    if (paymentsMode() === "mock") {
      return json({ ok: true, mode: "mock", orderId: order.id, accessKey });
    }

    const rz = await createRazorpayOrder({
      amountPaise: totals.totalPaise,
      receipt: order.orderNumber,
      notes: { orderId: order.id, email: input.customer.email },
    });
    await attachRazorpayOrder(order.id, rz.id);

    return json({
      ok: true,
      mode: "razorpay",
      orderId: order.id,
      accessKey,
      razorpay: {
        keyId: razorpayKeyId(),
        orderId: rz.id,
        amount: rz.amount,
        currency: rz.currency,
        name: siteConfig.name,
        description: `Order ${order.orderNumber}`,
        prefill: {
          name: input.customer.name,
          email: input.customer.email,
          contact: `+91${input.customer.phone}`,
        },
      },
    });
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return json({ ok: false, message: "One of the items just sold out. Please update your cart." }, 409);
    }
    return handleError(err, "We could not start the checkout. Please try again.");
  }
}
