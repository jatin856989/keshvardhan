import { createHash } from "node:crypto";
import { after } from "next/server";
import { fieldErrorsFrom, handleError, json, limited, readJson } from "@/lib/api";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { contactAcknowledgementEmail, contactNotificationEmail, sendEmail } from "@/lib/email";
import { clientIp } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";
import { contactSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const blocked = limited(req, "contact", 5, 10 * 60_000);
  if (blocked) return blocked;

  const raw = await readJson<{ website?: unknown }>(req);
  // Honeypot first: a filled hidden field gets a quiet "success" and nothing else.
  if (raw && typeof raw.website === "string" && raw.website.length > 0) {
    return json({ ok: true, message: "Thanks, we will get back to you within one working day." });
  }
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, message: "Please check the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) }, 400);
  }
  const input = parsed.data;

  // Spam traps: honeypot field and a form filled in under 3 seconds. Respond
  // as if accepted so bots learn nothing.
  const tooFast = typeof input.startedAt === "number" && Date.now() - input.startedAt < 3000;
  if (input.website || tooFast) {
    return json({ ok: true, message: "Thanks, we will get back to you within one working day." });
  }

  try {
    if (isDatabaseConfigured()) {
      const ipHash = createHash("sha256").update(clientIp(req)).digest("hex").slice(0, 24);
      await getDb().insert(schema.contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        ipHash,
      });
    }
    after(async () => {
      try {
        const notify = contactNotificationEmail(input);
        await sendEmail({ to: siteConfig.email, replyTo: input.email, ...notify });
        const ack = contactAcknowledgementEmail(input.name, input.subject);
        await sendEmail({ to: input.email, ...ack });
      } catch (err) {
        console.error("Contact email failed", err);
      }
    });
    return json({ ok: true, message: "Thanks, we will get back to you within one working day." });
  } catch (err) {
    return handleError(err, "We could not send your message. Please email us directly.");
  }
}
