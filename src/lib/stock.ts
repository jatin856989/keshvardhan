import { cacheLife, cacheTag } from "next/cache";
import { isDatabaseConfigured } from "./db";
import { getStockMap } from "./orders";
import { getProduct, type ProductSlug } from "./products";

export const STOCK_TAG = "stock";

/**
 * Cached stock snapshot used by product pages so they prerender with real
 * availability in the HTML. Revalidated by tag whenever stock changes and at
 * most every few minutes otherwise. Falls back to "in stock" when no database
 * is configured so the storefront still renders.
 */
export async function getCachedStock(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(STOCK_TAG);
  if (!isDatabaseConfigured()) return {};
  try {
    return await getStockMap();
  } catch (err) {
    console.error("Stock lookup failed", err);
    return {};
  }
}

export function productInStock(stock: Record<string, number>, slug: ProductSlug): boolean {
  const p = getProduct(slug);
  if (!p) return false;
  if (Object.keys(stock).length === 0) return true; // no data: assume available
  const slugs = p.includes && p.includes.length > 0 ? p.includes : [p.slug];
  return slugs.every((s) => (stock[s] ?? 0) > 0);
}
