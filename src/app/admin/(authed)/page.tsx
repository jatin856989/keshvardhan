import Link from "next/link";
import { Suspense } from "react";
import { dashboardStats, requireAdmin } from "@/lib/admin-data";
import { formatINR } from "@/lib/money";
import { getProduct } from "@/lib/products";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<p className="text-stone">Loading dashboard…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const s = await dashboardStats();
  const pending = s.byStatus.find((b) => b.status === "pending")?.count ?? 0;
  const toPack = s.byStatus.filter((b) => b.status === "paid" || b.status === "cod_confirmed").reduce((n, b) => n + b.count, 0);
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-forest">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue (confirmed)" value={formatINR(s.revenuePaise)} />
        <Stat label="Confirmed orders" value={String(s.paidOrders)} />
        <Stat label="Awaiting packing" value={String(toPack)} href="/admin/orders?status=paid" />
        <Stat label="Unpaid / abandoned" value={String(pending)} href="/admin/orders?status=pending" />
        <Stat label="New messages" value={String(s.newMessages)} href="/admin/messages" />
        <Stat label="Waitlist" value={String(s.waitlist)} href="/admin/waitlist" />
      </div>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-forest">Stock</h2>
          <Link href="/admin/inventory" className="text-sm font-semibold text-terracotta hover:underline">Adjust</Link>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {s.stock.map((row) => {
            const low = row.stock <= row.lowStockThreshold;
            return (
              <li key={row.slug} className={`rounded-2xl border p-4 ${low ? "border-terracotta bg-terracotta-100" : "border-line"}`}>
                <p className="text-sm font-semibold text-forest">{getProduct(row.slug)?.name ?? row.slug}</p>
                <p className="font-display mt-1 text-3xl text-forest">{row.stock}</p>
                <p className="text-xs text-stone">{low ? "Low stock: reorder" : `Reorder at ${row.lowStockThreshold}`}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-2xl text-forest">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-terracotta hover:underline">All orders</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-left text-xs uppercase tracking-wider text-stone">
            <tr><th className="px-6 py-3">Order</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Total</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Placed</th></tr>
          </thead>
          <tbody>
            {s.recent.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="px-6 py-3"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-forest hover:underline">{o.orderNumber}</Link></td>
                <td className="px-6 py-3">{o.customerName}<br /><span className="text-xs text-stone">{o.city}</span></td>
                <td className="px-6 py-3">{formatINR(o.totalPaise)}</td>
                <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-6 py-3 text-stone">{o.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              </tr>
            ))}
            {s.recent.length === 0 ? <tr><td colSpan={5} className="px-6 py-8 text-center text-stone">No orders yet.</td></tr> : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-stone">{label}</p>
      <p className="font-display mt-2 text-3xl text-forest">{value}</p>
    </>
  );
  return href ? (
    <Link href={href} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-lift">{inner}</Link>
  ) : (
    <div className="card p-5">{inner}</div>
  );
}
