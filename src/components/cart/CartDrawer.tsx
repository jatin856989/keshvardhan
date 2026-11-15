"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { productBySlug } from "@/lib/products";
import { computeTotals, formatINR, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/money";

export function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove } = useCart();
  const priced = lines.map((l) => ({ ...l, product: productBySlug[l.slug] })).filter((l) => l.product);
  const totals = computeTotals(
    priced.map((l) => ({ unitPricePaise: l.product.pricePaise, quantity: l.quantity })),
    "razorpay",
  );
  const toFree = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - totals.subtotalPaise);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-50 bg-forest/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-cream shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 id="cart-title" className="font-display text-2xl text-forest">
                Your routine
              </h2>
              <button type="button" onClick={close} className="grid size-10 place-items-center rounded-full hover:bg-cream-200" aria-label="Close cart">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {priced.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-xl text-forest">Your cart is empty</p>
                  <p className="mt-2 text-sm text-stone">Start with the bundle; it is the full month in one box.</p>
                  <Link href="/products/routine-bundle" onClick={close} className="btn btn-primary mt-6">
                    See the Routine Bundle
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {priced.map(({ product, quantity }) => (
                    <li key={product.slug} className="flex gap-4 rounded-2xl bg-white p-3">
                      <Image
                        src={product.image.src}
                        alt=""
                        width={80}
                        height={80}
                        className="size-20 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/products/${product.slug}`} onClick={close} className="font-semibold text-forest hover:underline">
                            {product.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(product.slug)}
                            className="text-stone hover:text-terracotta"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-xs text-stone">{product.size}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center rounded-full border border-line">
                            <button type="button" className="grid size-8 place-items-center" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQuantity(product.slug, quantity - 1)}>
                              <Minus className="size-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
                            <button type="button" className="grid size-8 place-items-center" aria-label={`Increase quantity of ${product.name}`} onClick={() => setQuantity(product.slug, quantity + 1)}>
                              <Plus className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <span className="font-semibold">{formatINR(product.pricePaise * quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {priced.length > 0 ? (
              <div className="border-t border-line bg-white px-6 py-5">
                {toFree > 0 ? (
                  <p className="mb-3 text-xs font-semibold text-terracotta">
                    Add {formatINR(toFree)} more for free shipping
                  </p>
                ) : (
                  <p className="mb-3 text-xs font-semibold text-amla">You have free shipping</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone">Subtotal</span>
                  <span className="font-semibold">{formatINR(totals.subtotalPaise)}</span>
                </div>
                <p className="mt-1 text-xs text-stone">Shipping and any COD fee are calculated at checkout.</p>
                <Link href="/checkout" onClick={close} className="btn btn-accent mt-4 w-full">
                  Checkout
                </Link>
                <Link href="/cart" onClick={close} className="mt-3 block text-center text-sm font-semibold text-forest underline-offset-4 hover:underline">
                  View full cart
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
