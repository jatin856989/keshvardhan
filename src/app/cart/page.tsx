import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your Keshvardhan routine before checkout.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumbs items={[{ name: "Cart", href: "/cart" }]} />
      <h1 className="font-display mt-6 text-4xl text-forest sm:text-5xl">Your cart</h1>
      <CartPageClient />
    </Container>
  );
}
