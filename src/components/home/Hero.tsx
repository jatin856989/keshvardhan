import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/three/Lazy3D";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-amla/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[460px] rounded-full bg-terracotta/15 blur-3xl" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <Reveal>
            <p className="eyebrow">Inside-out hair care, made in India</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 id="hero-title" className="font-display mt-4 text-balance text-5xl leading-[1.02] text-forest sm:text-6xl lg:text-7xl">
              Nectar for your hair,
              <br />
              <em className="not-italic text-terracotta">inside</em> and out.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
              A spoon of nine Indian botanicals every morning, and a slow-infused oil for your scalp twice a
              week. One honest routine, one ingredient list, one month to notice the difference.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/products/routine-bundle" className="btn btn-accent text-base">
                Start the routine · ₹1,399
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/ingredients" className="btn btn-ghost text-base">
                See every ingredient
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm">
              <li className="flex items-start gap-2 text-forest">
                <Leaf className="mt-0.5 size-4 shrink-0 text-amla" aria-hidden="true" />
                <span>Food-grade botanicals, no isolated vitamins</span>
              </li>
              <li className="flex items-start gap-2 text-forest">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amla" aria-hidden="true" />
                <span>Lab-tested per batch, every quantity on the label</span>
              </li>
              <li className="flex items-start gap-2 text-forest">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-amla" aria-hidden="true" />
                <span>Free 30-day guide with every order</span>
              </li>
            </ul>
          </Reveal>
        </div>
        <div className="relative mx-auto flex w-full justify-center lg:justify-end">
          <HeroVisual
            fallback={
              <Image
                src="/images/products/routine-bundle.webp"
                alt="Keshvardhan Daily Root Powder jar and Root Ritual Oil bottle"
                width={1200}
                height={1200}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="h-full w-full rounded-[2rem] object-cover shadow-lift"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}
