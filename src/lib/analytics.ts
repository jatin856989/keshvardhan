"use client";

import { sendGAEvent } from "@next/third-parties/google";

type Params = Record<string, string | number | boolean | undefined | Array<Record<string, unknown>>>;

/** Fire a GA4 event when GA is configured; no-op otherwise. Never send PII. */
export function trackEvent(name: string, params: Params = {}): void {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
  try {
    sendGAEvent("event", name, params);
  } catch {
    // analytics must never break the UI
  }
}

export function gaItem(p: { slug: string; name: string; pricePaise: number; quantity: number }) {
  return {
    item_id: p.slug,
    item_name: p.name,
    price: p.pricePaise / 100,
    quantity: p.quantity,
    currency: "INR",
  };
}
