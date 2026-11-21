import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Lock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ScalpTest } from "@/components/scalp/ScalpTest";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, defaultOgImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Scalp Check: Is Your Scalp Dry, Oily or Sensitive?",
  description:
    "A free two-minute scalp check. Nine questions about how your scalp feels and how you care for it, with habit tips and a routine that fits. Not a medical test.",
  alternates: { canonical: "/scalp-test" },
  openGraph: {
    title: "Free Scalp Check | Keshvardhan",
    description: "Nine questions, two minutes. Find out whether your scalp leans dry, oily or sensitive and what to try.",
    url: "/scalp-test",
    images: [defaultOgImage],
  },
};

export default function ScalpTestPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: absoluteUrl("/scalp-test"),
          name: "Keshvardhan Scalp Check",
          description: "A free habit and comfort self-check for the scalp. Not a medical test.",
        }}
      />
      <PageIntro
        eyebrow="Free scalp check"
        title="How is your scalp really doing?"
        lead="Nine quick questions about how your scalp feels and how you look after your hair. You get a plain-language read, habit tips and, if it fits, a routine to try."
        crumbs={[{ name: "Scalp Check", href: "/scalp-test" }]}
      >
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-forest">
          <li className="flex items-center gap-2"><Clock className="size-4 text-amla" aria-hidden="true" /> About two minutes</li>
          <li className="flex items-center gap-2"><Lock className="size-4 text-amla" aria-hidden="true" /> Runs in your browser, nothing stored</li>
          <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-amla" aria-hidden="true" /> Habit check, not a diagnosis</li>
        </ul>
      </PageIntro>
      <Container className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Reveal>
          <ScalpTest />
        </Reveal>
        <Reveal delay={0.1} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-xl text-forest">What it looks at</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone">
              <li>How your scalp feels between washes: dry, oily or both.</li>
              <li>Itching and flaking, so you know when to stop and see a doctor.</li>
              <li>Washing, oiling, heat and tight styles.</li>
              <li>Your eating, water and sleep, because hair is built from them.</li>
            </ul>
          </div>
          <div className="card p-6 text-sm leading-relaxed text-stone">
            <h2 className="font-display text-xl text-forest">When to see a doctor</h2>
            <p className="mt-2">
              Persistent itching or burning, thick scaling, sores, sudden shedding or bare patches need a dermatologist, not a
              new product. Our{" "}
              <Link href="/guide" className="font-semibold text-terracotta underline-offset-4 hover:underline">guide</Link> has a
              plain-spoken chapter on it.
            </p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
