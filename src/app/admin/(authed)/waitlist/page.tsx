import type { Metadata } from "next";
import { Suspense } from "react";
import { listWaitlist, requireAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Waitlist" };

export default function WaitlistPage() {
  return (
    <Suspense fallback={<p className="text-stone">Loading waitlist…</p>}>
      <Waitlist />
    </Suspense>
  );
}

async function Waitlist() {
  await requireAdmin();
  const rows = await listWaitlist();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-forest">Waitlist ({rows.length})</h1>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(["email,name,source,created_at", ...rows.map((r) => `${r.email},${r.name ?? ""},${r.source ?? ""},${r.createdAt.toISOString()}`)].join("\n"))}`} download="keshvardhan-waitlist.csv" className="btn btn-ghost !px-4 !py-2 text-sm">
          Export CSV
        </a>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-left text-xs uppercase tracking-wider text-stone"><tr><th className="px-5 py-3">Email</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">Joined</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line"><td className="px-5 py-2">{r.email}</td><td className="px-5 py-2">{r.name ?? "—"}</td><td className="px-5 py-2">{r.source ?? "—"}</td><td className="px-5 py-2 text-stone">{r.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
            ))}
            {rows.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-stone">Nobody yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
