"use client";

import { useState } from "react";

export function ResendGuideButton({ orderId, accessKey }: { orderId: string; accessKey: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function resend() {
    setState("loading");
    try {
      const res = await fetch(`/api/orders/${orderId}/resend-guide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k: accessKey }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not resend");
      setState("done");
      setMsg(data.message ?? "Sent. Check your inbox.");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Could not resend");
    }
  }
  return (
    <p className="mt-3 text-xs text-stone">
      Did not get the email?{" "}
      <button type="button" onClick={resend} disabled={state === "loading" || state === "done"} className="font-semibold text-terracotta underline-offset-4 hover:underline disabled:opacity-60">
        {state === "loading" ? "Sending…" : "Resend my guide"}
      </button>
      {msg ? <span role="status" className="ml-2">{msg}</span> : null}
    </p>
  );
}
