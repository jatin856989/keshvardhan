import type { Metadata } from "next";
import { Suspense } from "react";
import { listMessages, requireAdmin } from "@/lib/admin-data";
import { markMessageAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-stone">Loading messages…</p>}>
      <Messages />
    </Suspense>
  );
}

async function Messages() {
  await requireAdmin();
  const rows = await listMessages();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-forest">Contact messages</h1>
      <ul className="space-y-3">
        {rows.map((m) => (
          <li key={m.id} className={`card p-5 ${m.status === "new" ? "border-terracotta" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-forest">{m.subject}</p>
                <p className="text-xs text-stone">{m.name} · <a href={`mailto:${m.email}`} className="hover:underline">{m.email}</a>{m.phone ? ` · ${m.phone}` : ""} · {m.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
              </div>
              <form action={markMessageAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="status" value={m.status === "new" ? "done" : "new"} />
                <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-forest hover:bg-cream">
                  {m.status === "new" ? "Mark done" : "Reopen"}
                </button>
              </form>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{m.message}</p>
          </li>
        ))}
        {rows.length === 0 ? <li className="card p-10 text-center text-stone">No messages yet.</li> : null}
      </ul>
    </div>
  );
}
