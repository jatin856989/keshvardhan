import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listOrders, requireAdmin } from "@/lib/admin-data";
import { schema } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <Suspense fallback={<p className="text-stone">Loading orders…</p>}>
      <OrdersTable searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersTable({ searchParams }: Pick<PageProps<"/admin/orders">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const orders = await listOrders(status);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-forest">Orders</h1>
        <nav aria-label="Filter by status" className="flex flex-wrap gap-1 text-xs font-semibold">
          <Link href="/admin/orders" className={`rounded-full px-3 py-1.5 ${!status ? "bg-forest text-cream" : "bg-white text-forest"}`}>All</Link>
          {schema.orderStatusEnum.enumValues.map((s) => (
            <Link key={s} href={`/admin/orders?status=${s}`} className={`rounded-full px-3 py-1.5 ${status === s ? "bg-forest text-cream" : "bg-white text-forest"}`}>{s.replace("_", " ")}</Link>
          ))}
        </nav>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-left text-xs uppercase tracking-wider text-stone">
            <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">AWB</th><th className="px-5 py-3">Placed</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-forest hover:underline">{o.orderNumber}</Link></td>
                <td className="px-5 py-3">{o.customerName}<br /><span className="text-xs text-stone">{o.phone} · {o.city}, {o.pincode}</span></td>
                <td className="px-5 py-3 text-xs">{o.paymentMethod} · {o.paymentStatus}</td>
                <td className="px-5 py-3">{formatINR(o.totalPaise)}</td>
                <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-5 py-3 text-xs">{o.awb ?? "—"}</td>
                <td className="px-5 py-3 text-xs text-stone">{o.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              </tr>
            ))}
            {orders.length === 0 ? <tr><td colSpan={7} className="px-5 py-10 text-center text-stone">No orders match.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
