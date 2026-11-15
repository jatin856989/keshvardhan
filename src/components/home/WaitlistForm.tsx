"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function WaitlistForm({ source = "home", compact = false }: { source?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const website = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message ?? "Something went wrong");
      setStatus("done");
      setMessage(data.message ?? "You're on the list.");
      trackEvent("generate_lead", { method: "waitlist", source });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${compact ? "text-amla" : "text-forest"}`} role="status">
        <Check className="size-4" aria-hidden="true" /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`mt-3 flex gap-2 ${compact ? "max-w-sm" : "mx-auto max-w-md"}`} noValidate>
      <label htmlFor={`waitlist-email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`waitlist-email-${source}`}
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`field ${compact ? "!bg-cream/10 !text-cream !border-cream/25 placeholder:!text-cream/50" : ""}`}
      />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" className={`btn ${compact ? "btn-light" : "btn-accent"} shrink-0`} disabled={status === "loading"}>
        {status === "loading" ? "…" : compact ? <ArrowRight className="size-4" aria-label="Join" /> : "Join the list"}
      </button>
      {status === "error" ? (
        <p className="sr-only" role="alert">
          {message}
        </p>
      ) : null}
      {status === "error" ? (
        <span className="absolute mt-14 text-xs text-red-200" aria-hidden="true">
          {message}
        </span>
      ) : null}
    </form>
  );
}
