import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { products } from "@/lib/products";
import { getCachedStock, productInStock } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Shop hair care: Daily Root Powder, Root Ritual Oil and the Routine Bundle",
  description:
    "Buy Keshvardhan's inside-out hair care: edible Daily Root Powder (150 g), herbal Root Ritual Oil (100 ml) or the month-long Routine Bundle. Free shipping above ₹999, cash on delivery available across India.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop Keshvardhan hair care",
    description: "Edible Daily Root Powder, Root Ritual Oil and the Routine Bundle. Ships across India.",
    url: "/products", images: [defaultOgImage]
  },
};

export default async function ProductsPage() {
  const stock = await getCachedStock();
  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumbs items={[{ name: "Shop", href: "/products" }]} />
      <Reveal className="mt-8 max-w-2xl">
        <p className="eyebrow">Shop</p>
        <h1 className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl lg:text-6xl">
          Two products, one routine.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone">
          The bundle is the full month in one box and the best value. Both products are also sold on their
          own if you want to start with one half of the routine.
        </p>
      </Reveal>
      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <StaggerItem key={p.slug}>
            <ProductCard product={p} inStock={productInStock(stock, p.slug)} priority={i === 0} headingLevel={2} />
          </StaggerItem>
        ))}
      </Stagger>
      <section className="mt-20 grid gap-6 rounded-[2rem] bg-white p-8 sm:grid-cols-3 sm:p-12" aria-labelledby="shop-promises">
        <h2 id="shop-promises" className="sr-only">
          Shopping promises
        </h2>
        {[
          ["Free shipping above ₹999", "Otherwise a flat ₹79 anywhere in India. Dispatch within one working day."],
          ["Cash on delivery", "Available on every order for a ₹49 fee. Pay the courier at the door."],
          ["7-day returns", "Sealed, unused products can be returned within 7 days. Damaged in transit is replaced free."],
        ].map(([title, body]) => (
          <div key={title}>
            <h3 className="font-display text-2xl text-forest">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone">{body}</p>
          </div>
        ))}
      </section>
    </Container>
  );
}
