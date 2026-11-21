import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

// Update when page content changes materially; keeps the sitemap deterministic.
const CONTENT_UPDATED = "2026-11-15";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/scalp-test", priority: 0.7, changeFrequency: "monthly" },
    { path: "/ingredients", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guide", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/shipping-returns", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];
  return [
    ...staticRoutes.map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: CONTENT_UPDATED,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: p.gallery.map((g) => absoluteUrl(g.src)),
    })),
  ];
}
