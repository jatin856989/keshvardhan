import { limited } from "@/lib/api";
import { isDatabaseConfigured } from "@/lib/db";
import { buildGuidePdf, verifyEbookToken } from "@/lib/ebook";
import { getOrderWithItems } from "@/lib/orders";

/**
 * Serves the guide PDF to holders of a valid, unexpired signed token tied to a
 * confirmed order. The PDF is generated once per server instance and cached.
 */
export async function GET(req: Request) {
  const blocked = limited(req, "ebook", 30, 60_000);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? "";
  const orderId = verifyEbookToken(token);
  if (!orderId) {
    return new Response("This download link is invalid or has expired. Request a new one from your order page.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (isDatabaseConfigured()) {
    const data = await getOrderWithItems(orderId).catch(() => null);
    const ok = data && data.order.status !== "pending" && data.order.paymentStatus !== "failed";
    if (!ok) return new Response("Order not found or not confirmed.", { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const pdf = await buildGuidePdf();
  return new Response(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Keshsudha-30-Day-Hair-Guide.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
