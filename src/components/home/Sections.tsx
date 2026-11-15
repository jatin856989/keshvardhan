import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Droplets, RefreshCw, Utensils } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/product/ProductCard";
import { WaitlistForm } from "./WaitlistForm";
import { RoutineTimeline } from "./RoutineTimeline";
import { faqJsonLd } from "@/lib/seo";
import { allIngredients, products } from "@/lib/products";
import { productInStock } from "@/lib/stock";

export function TrustStrip() {
  const items = [
    "Nine Indian botanicals",
    "No added sugar",
    "No synthetic fragrance",
    "Every quantity on the label",
    "Lab-tested per batch",
    "Made in India",
    "Free shipping above ₹999",
    "Cash on delivery available",
  ];
  return (
    <div className="border-y border-line bg-cream-50 py-4">
      <Marquee>
        {items.map((t) => (
          <span key={t} className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-forest">
            <span className="size-1.5 rounded-full bg-terracotta" />
            {t}
          </span>
        ))}
      </Marquee>
      <p className="sr-only">{items.join(". ")}.</p>
    </div>
  );
}

export function RoutineSteps() {
  const steps = [
    {
      icon: Utensils,
      title: "Eat it",
      body: "One level teaspoon of Daily Root Powder every morning, in warm water, milk, curd or a smoothie. Nine botanicals, 5 grams, no pills.",
      color: "bg-amla-100 text-amla",
    },
    {
      icon: Droplets,
      title: "Oil it",
      body: "Twice a week, warm a teaspoon of Root Ritual Oil, massage into the scalp for five minutes, leave an hour or overnight, wash once.",
      color: "bg-terracotta-100 text-terracotta",
    },
    {
      icon: RefreshCw,
      title: "Repeat",
      body: "Hair works on a slow cycle. The 30-day guide keeps you going with recipes, a technique walkthrough and a weekly tracker.",
      color: "bg-forest-200 text-forest",
    },
  ];
  return (
    <section className="py-20 lg:py-28" aria-labelledby="routine-title">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The routine</p>
          <h2 id="routine-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
            Three verbs. One month. That is the whole plan.
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <StaggerItem key={s.title} className="card relative overflow-hidden p-8">
              <span className="absolute right-6 top-6 font-display text-6xl text-cream-200" aria-hidden="true">
                0{i + 1}
              </span>
              <span className={`grid size-12 place-items-center rounded-2xl ${s.color}`}>
                <s.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-display mt-6 text-3xl text-forest">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function FeaturedProducts({ stock }: { stock: Record<string, number> }) {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="products-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Shop</p>
            <h2 id="products-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
              Two products. Built to be used together.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/products" className="inline-flex items-center gap-2 font-semibold text-terracotta hover:underline">
              View all products <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} inStock={productInStock(stock, p.slug)} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function IngredientsSection() {
  const featured = allIngredients.slice(0, 8);
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-cream lg:py-28" aria-labelledby="ingredients-title">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow !text-amla">Ingredients</p>
              <h2 id="ingredients-title" className="font-display mt-3 text-balance text-4xl sm:text-5xl">
                Plants your grandmother would recognise. Quantities she never got.
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-cream/80">
                Amla, bhringraj, curry leaf, moringa, hibiscus, fenugreek, black sesame and pumpkin seed. The
                same plants go into the jar you eat and the oil you massage in, and every milligram is printed
                on the label.
              </p>
              <Link href="/ingredients" className="btn btn-light mt-8">
                Read the full ingredient list
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featured.map((ing) => (
              <StaggerItem key={ing.name} className="group rounded-2xl border border-cream/15 bg-cream/5 p-4 transition hover:bg-cream/10">
                <p className="font-display text-lg leading-tight">{ing.name}</p>
                <p className="mt-1 text-[0.7rem] italic text-cream/60">{ing.botanical}</p>
                <p className="mt-3 text-xs text-cream/80">{ing.role}</p>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-wider text-amla">
                  {ing.usedIn.join(" + ")}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="how-title">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="eyebrow">What to expect</p>
          <h2 id="how-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
            Thirty days, week by week.
          </h2>
          <p className="mt-4 leading-relaxed text-stone">
            Hair grows on a slow cycle, so the first changes show up in the scalp and in shedding, not in
            length. Here is the honest timeline we ask you to give it.
          </p>
        </Reveal>
        <RoutineTimeline />
      </Container>
    </section>
  );
}

export function GuideCta() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="guide-title">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-terracotta text-white">
          <div className="grain absolute inset-0" aria-hidden="true" />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-16">
            <Reveal>
              <p className="eyebrow !text-white/80">Included with every order</p>
              <h2 id="guide-title" className="font-display mt-3 text-balance text-4xl sm:text-5xl">
                The 30-Day Inside-Out Hair Guide
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-white/90">
                A designed 40-page eBook delivered to your inbox within two minutes of ordering. The daily
                routine, six recipes for the powder, the oiling technique step by step, a hair-fall tracker and
                a plain-spoken chapter on when to see a dermatologist.
              </p>
              <Link href="/guide" className="btn btn-light mt-8">
                <BookOpen className="size-4" aria-hidden="true" />
                What is inside the guide
              </Link>
            </Reveal>
            <Reveal delay={0.15} className="mx-auto w-full max-w-sm">
              <div className="animate-float rounded-2xl bg-forest p-8 shadow-lift">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cream/60">Keshvardhan</p>
                <p className="font-display mt-6 text-4xl leading-tight text-cream">
                  The 30-Day
                  <br />
                  Inside-Out
                  <br />
                  Hair Guide
                </p>
                <p className="mt-6 text-sm text-cream/70">Eat it. Oil it. Repeat.</p>
                <div className="mt-8 h-1 w-16 bg-terracotta" />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FounderNote() {
  return (
    <section className="bg-white py-20 lg:py-28" aria-labelledby="founder-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-50">
            <Image
              src="/images/products/powder-ingredients.webp"
              alt="Amla, curry leaves, moringa, hibiscus and black sesame arranged on a cream background"
              width={1200}
              height={1200}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Why we made this</p>
            <h2 id="founder-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
              Most hair brands treat the scalp or the body. Hair needs both.
            </h2>
            <div className="prose-ks mt-6 text-stone">
              <p>
                Every Indian home has a hair recipe: amla in the kitchen, oil on Sunday. What those recipes never
                had was consistency. Doses changed, oils went rancid, and nobody knew what was actually in the
                bottle.
              </p>
              <p>
                Keshvardhan takes those two habits and makes them repeatable: a measured spoon of the same nine
                plants every day, an oil made from the same plants twice a week, and a label that tells you
                exactly how much of each is inside.
              </p>
            </div>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-terracotta hover:underline">
              Read our story <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export const homeFaqs = [
  {
    question: "Is Daily Root Powder a supplement?",
    answer:
      "No. It is a food made only from botanicals and seeds, with no isolated vitamins, minerals or sugar. It is registered as a food product, not a health supplement.",
  },
  {
    question: "How long before I notice anything?",
    answer:
      "Give it 30 days. Most people notice a calmer scalp in week two, fewer strands in the brush by week three and softer texture by week four. Use the tracker in the guide.",
  },
  {
    question: "Can men use the routine?",
    answer: "Yes. Both products are unisex and the routine is the same for everyone.",
  },
  {
    question: "Do you ship across India? Is cash on delivery available?",
    answer:
      "We ship to every serviceable PIN code in India in 2 to 5 days. Shipping is free above ₹999. Cash on delivery is available for a ₹49 fee.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Sealed, unused products can be returned within 7 days of delivery. Anything damaged in transit is replaced free on photo proof. Details are on the Shipping and Returns page.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="faq-title">
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 id="faq-title" className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl">
              Asked before, answered honestly.
            </h2>
            <p className="mt-4 text-stone">
              More on the <Link href="/faq" className="font-semibold text-terracotta underline-offset-4 hover:underline">full FAQ page</Link>, or{" "}
              <Link href="/contact" className="font-semibold text-terracotta underline-offset-4 hover:underline">write to us</Link>.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion items={homeFaqs} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function NewsletterCta() {
  return (
    <section className="pb-8 pt-4" aria-labelledby="newsletter-title">
      <Container>
        <Reveal className="card mx-auto max-w-3xl px-6 py-12 text-center sm:px-12">
          <p className="eyebrow">Stay close</p>
          <h2 id="newsletter-title" className="font-display mt-3 text-balance text-3xl text-forest sm:text-4xl">
            Get the guide, launch offers and nothing else.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone">
            One or two emails a month. We never share your address.
          </p>
          <WaitlistForm source="home" />
        </Reveal>
      </Container>
    </section>
  );
}
