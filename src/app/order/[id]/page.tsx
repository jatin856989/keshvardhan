import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BookOpen, CheckCircle2, Package, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OrderConfirmedTracking } from "@/components/checkout/OrderConfirmedTracking";
import { ResendGuideButton } from "@/components/checkout/ResendGuideButton";
import { verifyOrderAccessKey } from "@/lib/crypto";
import { ebookUrlForOrder } from "@/lib/ebook";
import { formatINR } from "@/lib/money";
import { getOrderWithItems } from "@/lib/orders";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = {
  title: "Your order",
  description: "Order confirmation and your 30-day guide.",
  robots: { index: false, follow: false },
};

export default function OrderPage({ params, searchParams }: PageProps<"/order/[id]">) {
  return (
    <Container className="py-10 lg:py-16">
      <Suspense fallback={<OrderSkeleton />}>
        <OrderDetails params={params} searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

function OrderSkeleton() {
  return <div className="mx-auto h-72 max-w-3xl animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Loading your order" />;
}

async function OrderDetails({ params, searchParams }: Pick<PageProps<"/order/[id]">, "params" | "searchParams">) {
  // Always request-time: the eBook link below is signed with an expiry timestamp.
  await connection();
  const { id } = await params;
  const sp = await searchParams;
  const key = typeof sp.k === "string" ? sp.k : undefined;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuid.test(id) || !verifyOrderAccessKey(id, key) || !isDatabaseConfigured()) {
    return <NotFoundNotice />;
  }
  const data = await getOrderWithItems(id);
  if (!data) return <NotFoundNotice />;
  const { order, items } = data;
  const confirmed = order.status !== "pending" && order.paymentStatus !== "failed";
  const ebookUrl = confirmed ? ebookUrlForOrder(order.id) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <OrderConfirmedTracking
        orderId={order.id}
        valuePaise={order.totalPaise}
        items={items.map((i) => ({ slug: i.productSlug, name: i.name, pricePaise: i.unitPricePaise, quantity: i.quantity }))}
        confirmed={confirmed}
      />
      <div className="card overflow-hidden">
        <div className={`px-8 py-10 text-cream ${confirmed ? "bg-forest" : "bg-stone"}`}>
          <CheckCircle2 className="size-10 text-amla" aria-hidden="true" />
          <p className="eyebrow mt-4 !text-cream/70">Order {order.orderNumber}</p>
          <h1 className="font-display mt-2 text-4xl">
            {confirmed ? `Thank you, ${order.customerName.split(" ")[0]}. Your routine is on its way.` : "We are waiting for your payment"}
          </h1>
          <p className="mt-3 max-w-xl text-cream/85">
            {confirmed
              ? order.paymentMethod === "cod"
                ? `We have your cash-on-delivery order. Keep ${formatINR(order.totalPaise)} ready for the courier.`
                : "Payment received. A confirmation with your guide has been sent to your email."
              : "This order was created but the payment did not complete. You can try again from the cart or contact us."}
          </p>
        </div>

        {confirmed && ebookUrl ? (
          <div className="border-b border-line bg-terracotta-100 px-8 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <BookOpen className="mt-1 size-6 text-terracotta" aria-hidden="true" />
                <div>
                  <p className="font-display text-xl text-forest">Your 30-Day Guide is ready</p>
                  <p className="text-sm text-stone">Start reading now. The download link in your email is valid for 7 days.</p>
                </div>
              </div>
              <a href={ebookUrl} className="btn btn-accent shrink-0" download>
                Download the guide (PDF)
              </a>
            </div>
            <ResendGuideButton orderId={order.id} accessKey={key!} />
          </div>
        ) : null}

        <div className="grid gap-8 px-8 py-8 md:grid-cols-2">
          <section aria-labelledby="items-title">
            <h2 id="items-title" className="font-display text-2xl text-forest">Items</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>{i.name} × {i.quantity}</span>
                  <span className="font-semibold">{formatINR(i.lineTotalPaise)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-line pt-3 text-stone"><span>Shipping</span><span>{order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)}</span></li>
              {order.codFeePaise ? <li className="flex justify-between text-stone"><span>COD fee</span><span>{formatINR(order.codFeePaise)}</span></li> : null}
              <li className="flex justify-between text-base font-bold text-forest"><span>Total</span><span>{formatINR(order.totalPaise)}</span></li>
            </ul>
          </section>
          <section aria-labelledby="delivery-title">
            <h2 id="delivery-title" className="font-display text-2xl text-forest">Delivery</h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-ink">
              {order.customerName}<br />
              {order.addressLine1}{order.addressLine2 ? <>, {order.addressLine2}</> : null}<br />
              {order.city}, {order.state} {order.pincode}<br />
              {order.phone}
            </address>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-forest"><Package className="size-4 text-amla" aria-hidden="true" /> Dispatch within one working day</p>
              <p className="flex items-center gap-2 text-forest"><Truck className="size-4 text-amla" aria-hidden="true" /> Delivery in 2 to 5 days{order.courier ? ` via ${order.courier}` : ""}</p>
              {order.trackingUrl ? (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-terracotta underline-offset-4 hover:underline">Track shipment{order.awb ? ` (AWB ${order.awb})` : ""}</a>
              ) : (
                <p className="text-stone">Tracking details will be emailed once the parcel is picked up.</p>
              )}
            </div>
          </section>
        </div>
        <div className="border-t border-line bg-cream-50 px-8 py-5 text-sm text-stone">
          Questions about this order? <Link href="/contact" className="font-semibold text-terracotta underline-offset-4 hover:underline">Contact us</Link> and quote {order.orderNumber}.
        </div>
      </div>
    </div>
  );
}

function NotFoundNotice() {
  return (
    <div className="card mx-auto max-w-xl px-8 py-14 text-center">
      <h1 className="font-display text-3xl text-forest">We could not find that order</h1>
      <p className="mt-3 text-stone">Open the link from your confirmation email, or contact us with your order number and phone number.</p>
      <Link href="/contact" className="btn btn-primary mt-6">Contact support</Link>
    </div>
  );
}
