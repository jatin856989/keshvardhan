"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const startedAt = useRef<number>(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current,
    };
    setStatus("loading");
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        throw new Error(data.message ?? "Could not send your message");
      }
      setStatus("done");
      setMessage(data.message ?? "Sent.");
      trackEvent("generate_lead", { method: "contact_form" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not send your message");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="mt-6 rounded-2xl bg-amla-100 p-6">
        <p className="flex items-center gap-2 font-semibold text-forest">
          <CheckCircle2 className="size-5 text-amla" aria-hidden="true" /> {message}
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-3 text-sm font-semibold text-terracotta underline-offset-4 hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: string) => fieldErrors[k];

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-forest">Name</label>
        <input id="c-name" name="name" required autoComplete="name" className="field" aria-invalid={Boolean(err("name"))} aria-describedby={err("name") ? "c-name-err" : undefined} />
        {err("name") ? <p id="c-name-err" className="mt-1 text-xs text-red-700">{err("name")}</p> : null}
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-forest">Email</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="field" aria-invalid={Boolean(err("email"))} aria-describedby={err("email") ? "c-email-err" : undefined} />
        {err("email") ? <p id="c-email-err" className="mt-1 text-xs text-red-700">{err("email")}</p> : null}
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold text-forest">Phone (optional)</label>
        <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" />
      </div>
      <div>
        <label htmlFor="c-subject" className="mb-1.5 block text-sm font-semibold text-forest">Subject</label>
        <input id="c-subject" name="subject" required className="field" placeholder="Order KV2611-…, ingredient question…" aria-invalid={Boolean(err("subject"))} aria-describedby={err("subject") ? "c-subject-err" : undefined} />
        {err("subject") ? <p id="c-subject-err" className="mt-1 text-xs text-red-700">{err("subject")}</p> : null}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold text-forest">Message</label>
        <textarea id="c-message" name="message" required rows={5} className="field" aria-invalid={Boolean(err("message"))} aria-describedby={err("message") ? "c-message-err" : undefined} />
        {err("message") ? <p id="c-message-err" className="mt-1 text-xs text-red-700">{err("message")}</p> : null}
      </div>
      {/* Honeypot: hidden from people, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" ? (
        <p role="alert" className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{message}</p>
      ) : null}
      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-stone">We use your details only to reply. See our privacy policy.</p>
        <button type="submit" className="btn btn-accent" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
