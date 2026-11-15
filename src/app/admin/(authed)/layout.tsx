import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/waitlist", label: "Waitlist" },
];

/** Shell for signed-in staff pages. The login page lives outside this group. */
export default function AdminShellLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-3 shadow-soft">
        <div className="flex items-center gap-3">
          <LogoMark className="size-7" />
          <span className="font-display text-xl text-forest">Keshvardhan Admin</span>
        </div>
        <nav aria-label="Admin">
          <ul className="flex flex-wrap gap-1 text-sm font-semibold">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-full px-3 py-1.5 text-forest hover:bg-cream">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <form action={logoutAction}>
                <button type="submit" className="rounded-full px-3 py-1.5 text-terracotta hover:bg-cream">
                  Log out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </>
  );
}
