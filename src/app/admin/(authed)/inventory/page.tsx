import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-data";
import { getDb, schema } from "@/lib/db";
import { getProduct } from "@/lib/products";
import { adjustStockAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <Suspense fallback={<p className="text-stone">Loading inventory…</p>}>
      <Inventory />
    </Suspense>
  );
}

async function Inventory() {
  await requireAdmin();
  const rows = await getDb().select().from(schema.productStock).orderBy(schema.productStock.slug);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-forest">Inventory</h1>
      <p className="text-sm text-stone">Stock is counted in physical units. The bundle consumes one powder and one oil; its own row is unused.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map((r) => (
          <form key={r.slug} action={adjustStockAction} className="card space-y-3 p-6">
            <input type="hidden" name="slug" value={r.slug} />
            <h2 className="font-display text-xl text-forest">{getProduct(r.slug)?.name ?? r.slug}</h2>
            <label className="block text-sm font-semibold text-forest">Units in stock<input name="stock" type="number" min={0} defaultValue={r.stock} className="field mt-1" /></label>
            <label className="block text-sm font-semibold text-forest">Low-stock alert at<input name="threshold" type="number" min={0} defaultValue={r.lowStockThreshold} className="field mt-1" /></label>
            <p className="text-xs text-stone">Updated {r.updatedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
            <button type="submit" className="btn btn-primary w-full">Save</button>
          </form>
        ))}
      </div>
    </div>
  );
}
