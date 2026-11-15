import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let cached: NeonHttpDatabase<typeof schema> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Lazily creates the Drizzle client. Throws a clear error when DATABASE_URL is
 * missing so API routes can return a 503 instead of an opaque crash.
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new DatabaseNotConfiguredError();
  }
  const sql = neon(url);
  cached = drizzle(sql, { schema });
  return cached;
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Add it to .env.local to enable orders.");
    this.name = "DatabaseNotConfiguredError";
  }
}

export { schema };
