import { fieldErrorsFrom, handleError, json, limited, readJson } from "@/lib/api";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { waitlistSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const blocked = limited(req, "waitlist", 8, 10 * 60_000);
  if (blocked) return blocked;
  const parsed = waitlistSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return json({ ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email", fieldErrors: fieldErrorsFrom(parsed.error) }, 400);
  }
  if (parsed.data.website) return json({ ok: true, message: "You're on the list." });
  try {
    if (isDatabaseConfigured()) {
      await getDb()
        .insert(schema.waitlist)
        .values({ email: parsed.data.email, name: parsed.data.name || null, source: parsed.data.source ?? null })
        .onConflictDoNothing();
    }
    return json({ ok: true, message: "You're on the list. We'll email you launch updates and offers." });
  } catch (err) {
    return handleError(err);
  }
}
