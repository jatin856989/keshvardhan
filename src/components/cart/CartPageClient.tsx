"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/hooks";
import { productBySlug } from "@/lib/products";
import { computeTotals, formatINR, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/money";

export function CartPageClient() {
  const { lines, setQuantity, remove } = useCart();
  const hydrated = useHydrated();
  const priced = lines.map((l) => ({ ...l, product: productBySlug[l.slug] })).filter((l) => l.product);
  const totals = computeTotals(priced.map((l) => ({ unitPricePaise: l.product.pricePaise, quantity: l.quantity })), "razorpay");

  if (!hydrated) {
    return <div className="mt-10 h-40 animate-pulse rounded-3xl bg-white" aria-hidden="true" />;
  }

  if (priced.length === 0) {
    return (
      <div className="card mt-10 px-6 py-16 text-center">
        <p className="font-display text-2xl text-forest">Nothing here yet</p>
        <p className="mt-2 text-stone">The Routine Bundle is the full month in one box.</p>
        <Link href="/products" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="space-y-4">
        {priced.map(({ product, quantity }) => (
          <li key={product.slug} className="card flex gap-5 p-4 sm:p-5">
            <Image src={product.image.src} alt={product.image.alt} width={120} height={120} className="size-24 rounded-2xl object-cover sm:size-28" />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/products/${product.slug}`} className="font-display text-xl text-forest hover:underline">{product.name}</Link>
                  <p className="text-sm text-stone">{product.size}</p>
                </div>
                <button type="button" onClick={() => remove(product.slug)} aria-label={`Remove ${product.name}`} className="text-stone hover:text-terracotta">
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="inline-flex items-center rounded-full border border-line bg-white">
                  <button type="button" className="grid size-10 place-items-center" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQuantity(product.slug, quantity - 1)}><Minus className="size-4" aria-hidden="true" /></button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button type="button" className="grid size-10 place-items-center" aria-label={`Increase quantity of ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}><Plus className="size-4" aria-hidden="true" /></button>
                </div>
                <p className="font-semibold text-forest">{formatINR(product.pricePaise * quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="card h-fit p-6 lg:sticky lg:top-24" aria-labelledby="summary-title">
        <h2 id="summary-title" className="font-display text-2xl text-forest">Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="font-semibold">{formatINR(totals.subtotalPaise)}</dd></div>
          <div className="flex justify-between"><dt className="text-stone">Shipping</dt><dd className="font-semibold">{totals.shippingPaise === 0 ? "Free" : formatINR(totals.shippingPaise)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt className="font-semibold text-forest">Total</dt><dd className="font-bold text-forest">{formatINR(totals.totalPaise)}</dd></div>
        </dl>
        {totals.subtotalPaise < FREE_SHIPPING_THRESHOLD_PAISE ? (
          <p className="mt-3 text-xs font-semibold text-terracotta">Add {formatINR(FREE_SHIPPING_THRESHOLD_PAISE - totals.subtotalPaise)} more for free shipping</p>
        ) : null}
        <p className="mt-2 text-xs text-stone">Cash on delivery adds ₹49 and can be chosen at checkout.</p>
        <Link href="/checkout" className="btn btn-accent mt-6 w-full">Proceed to checkout</Link>
        <Link href="/products" className="mt-3 block text-center text-sm font-semibold text-forest hover:underline">Continue shopping</Link>
      </aside>
    </div>
  );
}
