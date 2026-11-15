"use client";

import { useEffect } from "react";
import { gaItem, trackEvent } from "@/lib/analytics";

/** Fires the GA4 purchase event once per order (guarded by sessionStorage). */
export function OrderConfirmedTracking({
  orderId,
  valuePaise,
  items,
  confirmed,
}: {
  orderId: string;
  valuePaise: number;
  items: Array<{ slug: string; name: string; pricePaise: number; quantity: number }>;
  confirmed: boolean;
}) {
  useEffect(() => {
    if (!confirmed) return;
    const key = `ks-purchase-${orderId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable: still track once per render
    }
    trackEvent("purchase", {
      transaction_id: orderId,
      currency: "INR",
      value: valuePaise / 100,
      items: items.map(gaItem),
    });
  }, [orderId, valuePaise, items, confirmed]);
  return null;
}
