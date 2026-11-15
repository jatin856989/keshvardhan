import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/site";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { WaitlistForm } from "@/components/home/WaitlistForm";
import { guideChapters } from "@/lib/ebook";

export const metadata: Metadata = {
  title: "The 30-Day Inside-Out Hair Guide (Free eBook)",
  description:
    "Inside the free 30-day Keshvardhan guide: daily routine, six powder recipes, oiling technique, a hair-fall tracker and when to see a dermatologist.",
  alternates: { canonical: "/guide" },
  openGraph: { title: "The 30-Day Inside-Out Hair Guide | Keshvardhan", description: "Free with every order, in your inbox within two minutes.", url: "/guide", images: [defaultOgImage] },
};

export default function GuidePage() {
  return (
    <>
      <PageIntro
        eyebrow="The guide"
        title="The 30-Day Inside-Out Hair Guide"
        lead="A designed eBook that turns two products into a routine you keep. It is free with every order and arrives by email within two minutes of payment, before your parcel leaves us."
        crumbs={[{ name: "The Guide", href: "/guide" }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products/routine-bundle" className="btn btn-accent">
            <BookOpen className="size-4" aria-hidden="true" />
            Get the guide with the bundle
          </Link>
          <Link href="/products" className="btn btn-ghost">All products</Link>
        </div>
      </PageIntro>

      <Container className="mt-16">
        <Reveal>
          <h2 className="font-display text-3xl text-forest">What is inside</h2>
          <p className="mt-2 max-w-2xl text-stone">Nine short chapters, written to be read in one sitting and used for a month.</p>
        </Reveal>
        <Stagger className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guideChapters.map((ch, i) => (
            <StaggerItem key={ch.title} className="card p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Chapter {i + 1}</p>
              <h3 className="font-display mt-2 text-2xl text-forest">{ch.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{ch.paragraphs[0]}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Reveal className="prose-ks">
            <h2>How delivery works</h2>
            <ol>
              <li>Place an order for any product. The guide is included with all of them.</li>
              <li>As soon as payment is confirmed (or your cash-on-delivery order is accepted) we email you a download link. It usually lands within two minutes.</li>
              <li>The link is valid for 7 days. If it expires, open your order page and request a fresh one.</li>
              <li>The PDF is yours to keep, print and share with family.</li>
            </ol>
          </Reveal>
          <Reveal delay={0.1} className="card p-8">
            <h2 className="font-display text-2xl text-forest">Not ready to order?</h2>
            <p className="mt-2 text-sm text-stone">Join the list and we will send the first chapter plus launch offers. One or two emails a month.</p>
            <WaitlistForm source="guide" compact />
          </Reveal>
        </div>
      </Container>
    </>
  );
}
