import Link from "next/link";
import { ArrowRight, MessageSquareHeart, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/testimonials";
import { getProduct } from "@/lib/products";

export function Testimonials() {
  const hasReviews = testimonials.length > 0;
  return (
    <section className="bg-cream-50 py-20 lg:py-28" aria-labelledby="reviews-title">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{hasReviews ? "In their words" : "Real reviews only"}</p>
          <h2 id="reviews-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
            {hasReviews ? "What our customers say" : "Be one of our first reviewers"}
          </h2>
        </Reveal>

        {hasReviews ? (
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="card flex h-full flex-col p-7">
                  <div className="flex gap-0.5 text-gold" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`size-4 ${i < t.rating ? "fill-current" : "opacity-25"}`} aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 leading-relaxed text-ink/90">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold text-forest">{t.name}</span>
                    {t.city ? <span className="text-stone">, {t.city}</span> : null}
                    <span className="mt-0.5 block text-xs text-stone">
                      {getProduct(t.product)?.name}
                      {t.verifiedPurchase ? " · Verified purchase" : ""}
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
            <div className="card grid gap-6 p-8 sm:grid-cols-[auto_1fr] sm:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-amla-100 text-forest">
                <MessageSquareHeart className="size-7" aria-hidden="true" />
              </span>
              <div>
                <p className="leading-relaxed text-ink/90">
                  We are new, and we would rather show you no reviews than invent any. Every review on this page will come from a
                  real customer who has agreed to be quoted, with the product they bought. Until then, here is how you can judge
                  us for yourself.
                </p>
                <ul className="mt-5 space-y-2 text-sm font-semibold text-forest">
                  <li>
                    Every ingredient and quantity is published on the label and the{" "}
                    <Link href="/ingredients" className="text-terracotta underline-offset-4 hover:underline">ingredients page</Link>.
                  </li>
                  <li>7-day returns on sealed products and cash on delivery, so you can try with little risk.</li>
                  <li>A person answers every message within one working day.</li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/scalp-test" className="btn btn-primary">
                    Try the free scalp check <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link href="/contact" className="btn btn-ghost">Share your experience</Link>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
