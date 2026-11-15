"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { navLinks } from "@/lib/site";
import { cartCount, useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/hooks";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const count = cartCount(lines);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-cream/85 shadow-soft backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Primary" className="hidden md:block">
          {/* usePathname is URL data; keeping it inside Suspense lets every route prerender. */}
          <Suspense fallback={<NavList activePath={null} />}>
            <ActiveNavList />
          </Suspense>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/products/routine-bundle" className="btn btn-primary hidden !px-5 !py-2.5 text-sm lg:inline-flex">
            Start the routine
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-11 place-items-center rounded-full text-forest transition hover:bg-cream-200"
            aria-label={`Open cart${hydrated && count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[0.68rem] font-bold text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-forest transition hover:bg-cream-200 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-cream px-4 pb-6 pt-3 md:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-3.5 font-display text-xl text-forest"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link href="/products/routine-bundle" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
                  Start the routine
                </Link>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function ActiveNavList() {
  const pathname = usePathname();
  return <NavList activePath={pathname} />;
}

function NavList({ activePath }: { activePath: string | null }) {
  return (
    <ul className="flex items-center gap-7">
      {navLinks.map((l) => {
        const active = activePath !== null && (activePath === l.href || activePath.startsWith(`${l.href}/`));
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`relative text-sm font-semibold tracking-wide transition hover:text-terracotta ${
                active ? "text-terracotta" : "text-forest"
              }`}
            >
              {l.label}
              {active ? (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-terracotta"
                />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
