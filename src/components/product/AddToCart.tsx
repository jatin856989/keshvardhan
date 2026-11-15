"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { gaItem, trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/products";

export function AddToCart({
  product,
  inStock,
  compact = false,
}: {
  product: Pick<Product, "slug" | "name" | "pricePaise">;
  inStock: boolean;
  compact?: boolean;
}) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    add(product.slug, qty);
    setAdded(true);
    trackEvent("add_to_cart", {
      currency: "INR",
      value: (product.pricePaise * qty) / 100,
      items: [gaItem({ ...product, quantity: qty })],
    });
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (!inStock) {
    return (
      <button type="button" className="btn btn-ghost w-full" disabled>
        Sold out, back soon
      </button>
    );
  }

  if (compact) {
    return (
      <button type="button" onClick={onAdd} className="btn btn-primary w-full">
        {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
        {added ? "Added" : "Add to cart"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="inline-flex h-12 items-center self-start rounded-full border border-line bg-white">
        <button type="button" className="grid size-12 place-items-center" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="w-8 text-center font-semibold" aria-live="polite" aria-label={`Quantity ${qty}`}>
          {qty}
        </span>
        <button type="button" className="grid size-12 place-items-center" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
      <button type="button" onClick={onAdd} className="btn btn-accent h-12 flex-1 text-base">
        {added ? <Check className="size-5" aria-hidden="true" /> : <ShoppingBag className="size-5" aria-hidden="true" />}
        {added ? "Added to your routine" : "Add to cart"}
      </button>
    </div>
  );
}
