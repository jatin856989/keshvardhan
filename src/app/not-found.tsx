import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Find the routine, the guide or our ingredient list from here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-balance text-5xl text-forest sm:text-6xl">
        This page has fallen out, like a strand on wash day.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-stone">
        The link may be old or mistyped. Everything worth finding is one click away.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">Go to the homepage</Link>
        <Link href="/products" className="btn btn-ghost">Shop the routine</Link>
        <Link href="/guide" className="btn btn-ghost">Read about the guide</Link>
      </div>
      <nav aria-label="Helpful links" className="mt-12 text-sm text-stone">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <li><Link href="/ingredients" className="hover:text-forest hover:underline">Ingredients</Link></li>
          <li><Link href="/faq" className="hover:text-forest hover:underline">FAQ</Link></li>
          <li><Link href="/shipping-returns" className="hover:text-forest hover:underline">Shipping &amp; returns</Link></li>
          <li><Link href="/contact" className="hover:text-forest hover:underline">Contact us</Link></li>
        </ul>
      </nav>
    </Container>
  );
}
