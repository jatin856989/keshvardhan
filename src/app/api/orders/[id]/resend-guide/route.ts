import { handleError, json, limited, readJson } from "@/lib/api";
import { orderAccessKey, verifyOrderAccessKey } from "@/lib/crypto";
import { ebookUrlForOrder } from "@/lib/ebook";
import { orderConfirmationEmail, sendEmail } from "@/lib/email";
import { getOrderWithItems, recordEvent } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site";

export async function POST(req: Request, ctx: RouteContext<"/api/orders/[id]/resend-guide">) {
  const blocked = limited(req, "resend-guide", 10, 60 * 60_000);
  if (blocked) return blocked;
  const { id } = await ctx.params;
  const body = await readJson<{ k?: string }>(req);
  if (!verifyOrderAccessKey(id, body?.k)) return json({ ok: false, message: "Not allowed" }, 403);
  const perOrder = rateLimit(`resend-order:${id}`, 3, 60 * 60_000);
  if (!perOrder.ok) return json({ ok: false, message: "Already sent recently. Check your spam folder." }, 429);
  try {
    const data = await getOrderWithItems(id);
    if (!data) return json({ ok: false, message: "Order not found" }, 404);
    const { order, items } = data;
    if (order.status === "pending" || order.paymentStatus === "failed") {
      return json({ ok: false, message: "This order is not confirmed yet." }, 400);
    }
    const mail = orderConfirmationEmail({
      order,
      items,
      orderUrl: absoluteUrl(`/order/${order.id}?k=${orderAccessKey(order.id)}`),
      ebookUrl: ebookUrlForOrder(order.id),
    });
    const result = await sendEmail({ to: order.email, ...mail });
    await recordEvent(order.id, "guide_resent", { delivered: result.delivered });
    return json({ ok: true, message: result.delivered ? `Sent to ${order.email}.` : "Email service is not configured; use the download button above." });
  } catch (err) {
    return handleError(err);
  }
}
