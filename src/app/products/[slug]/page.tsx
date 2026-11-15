import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductViewer } from "@/components/three/Lazy3D";
import { formatINR } from "@/lib/money";
import { getProduct, products } from "@/lib/products";
import { faqJsonLd, productJsonLd } from "@/lib/seo";
import { getCachedStock, productInStock } from "@/lib/stock";
import { siteConfig } from "@/lib/site";

// Unknown slugs are turned into a real 404 by src/proxy.ts before rendering.
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  const title = `${product.name} | ${formatINR(product.pricePaise)}`;
  return {
    title,
    description: product.metaDescription ?? product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.tagline,
      url: `/products/${product.slug}`,
    },
    twitter: { card: "summary_large_image", title: `${product.name} | ${siteConfig.name}`, description: product.tagline },
  };
}

/**
 * The page itself stays synchronous; the slug-dependent tree is awaited inside
 * Suspense so client navigations get an instant shell while the static params
 * still prerender to full HTML at build time.
 */
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <Container className="py-8 lg:py-12" aria-busy="true" aria-label="Loading product">
      <div className="h-4 w-48 animate-pulse rounded bg-cream-200" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square animate-pulse rounded-3xl bg-white" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-white" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-white" />
          <div className="h-12 w-full animate-pulse rounded-full bg-white" />
        </div>
      </div>
    </Container>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const stock = await getCachedStock();
  const inStock = productInStock(stock, product.slug);
  const related = products.filter((p) => p.slug !== product.slug);
  const included = product.includes?.map((s) => getProduct(s)).filter(Boolean) ?? [];

  return (
    <>
      <JsonLd data={[productJsonLd(product, inStock), faqJsonLd(product.faqs)]} />
      <Container className="py-8 lg:py-12">
        <Breadcrumbs items={[{ name: "Shop", href: "/products" }, { name: product.name, href: `/products/${product.slug}` }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductViewer kind={product.kind} image={product.image} />
            {product.gallery.length > 1 ? (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {product.gallery.slice(1).map((g) => (
                  <li key={g.src} className="overflow-hidden rounded-2xl bg-cream-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.src} alt={g.alt} width={400} height={400} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <Reveal>
              {product.badge ? (
                <span className="inline-block rounded-full bg-amla-100 px-3 py-1 text-xs font-bold text-forest">{product.badge}</span>
              ) : null}
              <h1 className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-lg text-stone">{product.tagline}</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-forest">{formatINR(product.pricePaise)}</span>
                {product.compareAtPaise ? (
                  <>
                    <span className="text-lg text-stone line-through">{formatINR(product.compareAtPaise)}</span>
                    <span className="rounded-full bg-terracotta-100 px-2.5 py-1 text-xs font-bold text-terracotta">
                      Save {formatINR(product.compareAtPaise - product.pricePaise)}
                    </span>
                  </>
                ) : null}
                <span className="text-sm text-stone">incl. GST · {product.size}</span>
              </div>
              <p className={`mt-2 text-sm font-semibold ${inStock ? "text-amla" : "text-terracotta"}`}>
                {inStock ? "In stock, dispatches within one working day" : "Currently sold out"}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-8">
              <AddToCart product={product} inStock={inStock} />
              <ul className="mt-6 grid gap-3 text-sm text-forest sm:grid-cols-3">
                <li className="flex items-center gap-2"><Truck className="size-4 text-amla" aria-hidden="true" /> Free shipping above ₹999</li>
                <li className="flex items-center gap-2"><Package className="size-4 text-amla" aria-hidden="true" /> COD available</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-amla" aria-hidden="true" /> 7-day returns</li>
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="mt-10">
              <ul className="space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-[0.98rem] text-ink">
                    <Check className="mt-1 size-4 shrink-0 text-terracotta" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            {included.length > 0 ? (
              <section className="mt-10" aria-labelledby="included-title">
                <h2 id="included-title" className="font-display text-2xl text-forest">What is in the box</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {included.map((p) => (
                    <li key={p!.slug} className="rounded-2xl border border-line bg-white p-4">
                      <Link href={`/products/${p!.slug}`} className="font-semibold text-forest hover:underline">{p!.name}</Link>
                      <p className="mt-1 text-sm text-stone">{p!.size}</p>
                    </li>
                  ))}
                  <li className="rounded-2xl border border-dashed border-line bg-cream-50 p-4">
                    <p className="font-semibold text-forest">The 30-Day Guide (eBook)</p>
                    <p className="mt-1 text-sm text-stone">Delivered by email within 2 minutes</p>
                  </li>
                </ul>
              </section>
            ) : null}

            <section className="prose-ks mt-10" aria-labelledby="about-title">
              <h2 id="about-title">About this product</h2>
              {product.longDescription.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>

            <section className="mt-10" aria-labelledby="use-title">
              <h2 id="use-title" className="font-display text-2xl text-forest">How to use</h2>
              <ol className="mt-4 space-y-3">
                {product.howToUse.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest text-sm font-bold text-cream">{i + 1}</span>
                    <p className="pt-1 text-[0.98rem] leading-relaxed text-ink">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            {product.ingredients.length > 0 ? (
              <section className="mt-10" aria-labelledby="ingredients-title">
                <h2 id="ingredients-title" className="font-display text-2xl text-forest">
                  Full ingredient list {product.kind === "powder" ? "(per 5 g serving)" : "(per 100 ml)"}
                </h2>
                <div className="prose-ks mt-4 overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Ingredient</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Why it is there</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.ingredients.map((ing) => (
                        <tr key={ing.name}>
                          <td>
                            <span className="font-semibold text-forest">{ing.name}</span>
                            {ing.botanical ? <span className="block text-xs italic text-stone">{ing.botanical}</span> : null}
                          </td>
                          <td className="whitespace-nowrap">{ing.amount}</td>
                          <td>{ing.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-stone">
                  Shelf life: {product.shelfLife}. {product.kind === "powder" ? "Store in a cool, dry place with the lid tight." : "Keep away from direct sunlight."}
                </p>
              </section>
            ) : null}

            <section className="mt-10" aria-labelledby="faq-title">
              <h2 id="faq-title" className="font-display text-2xl text-forest">Questions about {product.shortName}</h2>
              <div className="mt-4">
                <Accordion items={product.faqs} defaultOpen={null} />
              </div>
            </section>
          </div>
        </div>

        <section className="mt-24" aria-labelledby="related-title">
          <div className="flex items-end justify-between">
            <h2 id="related-title" className="font-display text-3xl text-forest">Complete the routine</h2>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:underline">
              All products <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} inStock={productInStock(stock, p.slug)} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
