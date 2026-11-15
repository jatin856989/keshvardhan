/**
 * Seeds product stock rows. Safe to re-run: existing rows keep their stock.
 * Usage: npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { productStock } from "../src/lib/db/schema";
import { products } from "../src/lib/products";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const db = drizzle(neon(url));
  for (const p of products) {
    await db
      .insert(productStock)
      .values({ slug: p.slug, stock: 2000, lowStockThreshold: 150 })
      .onConflictDoNothing();
  }
  const rows = await db.execute(sql`select slug, stock from product_stock order by slug`);
  console.log("product_stock:", rows.rows);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
