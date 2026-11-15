"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSlug } from "./products";

export interface CartLine {
  slug: ProductSlug;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (slug: ProductSlug, quantity?: number) => void;
  setQuantity: (slug: ProductSlug, quantity: number) => void;
  remove: (slug: ProductSlug) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (slug, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.slug === slug);
          const lines = existing
            ? s.lines.map((l) =>
                l.slug === slug
                  ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) }
                  : l,
              )
            : [...s.lines, { slug, quantity: Math.min(MAX_QTY, quantity) }];
          return { lines, isOpen: true };
        }),
      setQuantity: (slug, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.slug !== slug)
              : s.lines.map((l) =>
                  l.slug === slug ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l,
                ),
        })),
      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "keshvardhan-cart",
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}
