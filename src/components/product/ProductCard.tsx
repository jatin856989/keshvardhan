import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import type { Product } from "@/lib/products";
import { AddToCart } from "./AddToCart";

export function ProductCard({
  product,
  inStock,
  priority = false,
  headingLevel = 3,
}: {
  product: Product;
  inStock: boolean;
  priority?: boolean;
  /** Keep the document outline logical: h2 when the card sits directly under the page h1. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream-50" aria-label={`${product.name}, view details`}>
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-forest px-3 py-1 text-xs font-bold text-cream">
            {product.badge}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone">{product.size}</p>
        <Heading className="mt-2 font-display text-2xl text-forest">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{product.tagline}</p>
        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-xl font-bold text-forest">{formatINR(product.pricePaise)}</span>
          {product.compareAtPaise ? (
            <span className="text-sm text-stone line-through">{formatINR(product.compareAtPaise)}</span>
          ) : null}
        </div>
        <div className="mt-4">
          <AddToCart product={product} inStock={inStock} compact />
        </div>
      </div>
    </article>
  );
}
