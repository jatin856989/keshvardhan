import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Our story: why hair care should work from the inside and the outside",
  description:
    "Keshvardhan started with two household habits, amla in the kitchen and oil on Sunday, and made them measurable: nine botanicals in a daily spoon, the same plants in a scalp oil, every quantity on the label.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Our story | Keshvardhan", description: "Two household habits, made measurable.", url: "/about", images: [defaultOgImage] },
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Our story"
        title="Two habits every Indian home already had. We made them measurable."
        lead="Kesh means hair. Vardhan means to nurture and tend. Keshvardhan is what happens when the kitchen remedy and the Sunday oiling finally get a label, a dose and a schedule."
        crumbs={[{ name: "Our Story", href: "/about" }]}
      />
      <Container className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Reveal className="prose-ks">
          <h2>The problem we kept seeing</h2>
          <p>
            Ask anyone in India how to look after hair and you will hear the same two answers: eat amla, oil your
            scalp. Both are right. Neither is done consistently. Doses change with whoever is cooking, oils sit in
            the sun and go rancid, and the ingredient list on most bottles tells you nothing about how much of
            anything is inside.
          </p>
          <p>
            Meanwhile the newer brands pick one side. Oils and serums treat the scalp. Gummies and tablets treat the
            body with isolated vitamins and a lot of sugar. Hair needs both sides, and it needs them every week for
            months, not for a two-week burst.
          </p>
          <h2>What we did about it</h2>
          <p>
            We took nine plants that show up in every regional hair tradition in India, amla, bhringraj, curry
            leaf, moringa, hibiscus, fenugreek, black sesame, pumpkin seed and coconut, and used them two ways. Ground
            and nitrogen-flushed in a jar you eat a teaspoon of each morning. Slow-infused into a cold-pressed oil you
            massage in twice a week.
          </p>
          <p>
            Then we did the boring part properly. Every ingredient is listed with its quantity. Every batch goes to
            an NABL-accredited lab for heavy metals and microbial testing before it ships. The powder is registered
            as a food, not a supplement, so there are no isolated vitamins to overdose on and nothing to take a break
            from.
          </p>
          <h2>What we promise</h2>
          <ul>
            <li>Full disclosure: every ingredient and its amount, on the label and on this website.</li>
            <li>No miracle claims. We will tell you what to expect week by week and when to see a dermatologist.</li>
            <li>A routine you can keep: one spoon, two oilings, one guide to make it stick.</li>
            <li>Honest answers. Write to us and a person replies within one working day.</li>
          </ul>
          <p>
            Ready to start? The <Link href="/products/routine-bundle">Routine Bundle</Link> is the whole month in
            one box, and the <Link href="/guide">30-day guide</Link> arrives in your inbox two minutes after you order.
          </p>
        </Reveal>
        <div className="space-y-6 lg:sticky lg:top-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/products/oil-ingredients.webp"
              alt="Coconut halves, sesame seeds, bhringraj leaves and a rosemary sprig beside a bottle of oil"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="card p-6">
            <h2 className="font-display text-2xl text-forest">By the numbers</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {[
                ["9", "botanicals, all named with quantities"],
                ["0", "added sugar, synthetic vitamins or fragrance"],
                ["30", "days in the routine and the guide"],
                ["1", "working day to dispatch"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="font-display text-4xl text-terracotta">{n}</dt>
                  <dd className="mt-1 text-sm text-stone">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
