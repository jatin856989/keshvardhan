import type { Metadata } from "next";
import Link from "next/link";
import { defaultOgImage } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { products } from "@/lib/products";
import { getCachedStock, productInStock } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Shop Hair Powder, Hair Oil and Routine Bundle",
  description:
    "Shop Keshvardhan's edible Daily Root Powder, herbal Root Ritual Oil or the month-long Routine Bundle. Free shipping above ₹999 and COD across India.",
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
      <section className="prose-ks mt-20" aria-labelledby="choose-title">
        <h2 id="choose-title">Which one should you start with?</h2>
        <p>
          <strong>Start with the Routine Bundle</strong> if you want the full inside-out approach. It pairs a 30-serving
          jar of Daily Root Powder with a 100 ml bottle of Root Ritual Oil, costs less than buying them separately, ships
          free and includes the 30-day guide. A month is the fairest window to notice changes in shedding and scalp comfort.
        </p>
        <p>
          <strong>Choose Daily Root Powder alone</strong> if you prefer to begin with food. It is a teaspoon a day in water,
          milk, curd or a smoothie, made from amla, bhringraj, curry leaf, moringa, hibiscus, fenugreek, black sesame and
          pumpkin seed, with no added sugar or synthetic vitamins.
        </p>
        <p>
          <strong>Choose Root Ritual Oil alone</strong> if you already have a nutrition routine and want a scalp oil. It is
          cold-pressed coconut and sesame, slow-infused with the same botanicals, finished with castor and rosemary, and
          washes out with one shampoo. Not sure? Read the <Link href="/ingredients">full ingredient list</Link>, the{" "}
          <Link href="/faq">FAQ</Link> or the <Link href="/guide">30-day guide</Link>.
        </p>
      </section>
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
