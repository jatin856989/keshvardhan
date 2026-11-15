import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { orderDetail, requireAdmin } from "@/lib/admin-data";
import { schema } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { orderAccessKey } from "@/lib/crypto";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { resendFulfilmentAction, updateOrderStatusAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Order" };

export default function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<p className="text-stone">Loading order…</p>}>
      <OrderView params={params} />
    </Suspense>
  );
}

async function OrderView({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const data = await orderDetail(id);
  if (!data) notFound();
  const { order, items, events } = data;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-sm text-stone hover:underline">← Orders</Link>
          <h1 className="font-display text-3xl text-forest">{order.orderNumber}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-forest">Items</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between py-2"><span>{i.name} ({i.sku}) × {i.quantity}</span><span>{formatINR(i.lineTotalPaise)}</span></li>
            ))}
            <li className="flex justify-between py-2 text-stone"><span>Shipping</span><span>{formatINR(order.shippingPaise)}</span></li>
            {order.codFeePaise ? <li className="flex justify-between py-2 text-stone"><span>COD fee</span><span>{formatINR(order.codFeePaise)}</span></li> : null}
            <li className="flex justify-between py-2 font-bold text-forest"><span>Total</span><span>{formatINR(order.totalPaise)}</span></li>
          </ul>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs uppercase text-stone">Payment</dt><dd>{order.paymentMethod} · {order.paymentStatus}{order.razorpayPaymentId ? <><br /><span className="font-mono text-xs">{order.razorpayPaymentId}</span></> : null}</dd></div>
            <div><dt className="text-xs uppercase text-stone">Placed</dt><dd>{order.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</dd></div>
            <div><dt className="text-xs uppercase text-stone">Customer</dt><dd>{order.customerName}<br />{order.email}<br />{order.phone}</dd></div>
            <div><dt className="text-xs uppercase text-stone">Address</dt><dd>{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}<br />{order.city}, {order.state} {order.pincode}</dd></div>
            {order.notes ? <div className="sm:col-span-2"><dt className="text-xs uppercase text-stone">Notes</dt><dd>{order.notes}</dd></div> : null}
            <div className="sm:col-span-2"><dt className="text-xs uppercase text-stone">Customer order page</dt><dd><a className="break-all text-terracotta hover:underline" href={`/order/${order.id}?k=${orderAccessKey(order.id)}`} target="_blank" rel="noreferrer">/order/{order.id}</a></dd></div>
          </dl>
        </section>

        <section className="space-y-6">
          <form action={updateOrderStatusAction} className="card space-y-3 p-6">
            <h2 className="font-display text-xl text-forest">Update</h2>
            <input type="hidden" name="id" value={order.id} />
            <label className="block text-sm font-semibold text-forest">Status
              <select name="status" defaultValue={order.status} className="field mt-1">
                {schema.orderStatusEnum.enumValues.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-forest">AWB<input name="awb" defaultValue={order.awb ?? ""} className="field mt-1" /></label>
            <label className="block text-sm font-semibold text-forest">Courier<input name="courier" defaultValue={order.courier ?? ""} className="field mt-1" /></label>
            <label className="block text-sm font-semibold text-forest">Tracking URL<input name="trackingUrl" defaultValue={order.trackingUrl ?? ""} className="field mt-1" /></label>
            <button type="submit" className="btn btn-primary w-full">Save</button>
          </form>
          <form action={resendFulfilmentAction} className="card p-6">
            <input type="hidden" name="id" value={order.id} />
            <h2 className="font-display text-xl text-forest">Fulfilment</h2>
            <p className="mt-1 text-xs text-stone">Email sent: {order.confirmationEmailSentAt ? order.confirmationEmailSentAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "no"}. Shipment: {order.shipmentId ?? "not created"}.</p>
            <button type="submit" className="btn btn-ghost mt-3 w-full" disabled={order.status === "pending"}>Run fulfilment again</button>
          </form>
        </section>
      </div>

      <section className="card p-6">
        <h2 className="font-display text-xl text-forest">Timeline</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex gap-4">
              <span className="w-44 shrink-0 text-xs text-stone">{e.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
              <span className="font-semibold text-forest">{e.type}</span>
              {e.data ? <code className="truncate text-xs text-stone">{JSON.stringify(e.data)}</code> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
