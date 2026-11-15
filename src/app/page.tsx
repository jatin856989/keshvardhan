import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  FaqSection,
  FeaturedProducts,
  FounderNote,
  GuideCta,
  HowItWorks,
  IngredientsSection,
  NewsletterCta,
  RoutineSteps,
  TrustStrip,
} from "@/components/home/Sections";
import { getCachedStock } from "@/lib/stock";
import { defaultOgImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Inside-out hair care: edible root powder and herbal hair oil`,
  description:
    "Start the Keshsudha routine: a food-grade Daily Root Powder with amla, bhringraj and moringa you eat every morning, and a slow-infused Root Ritual Oil for your scalp. Free 30-day guide with every order. Ships across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | Nectar for your hair, inside and out`,
    description:
      "An edible herbal powder and a scalp oil made from the same nine Indian botanicals. One routine, one ingredient list, one month to notice the difference.",
    url: "/",
    images: [defaultOgImage],
  },
};

export default async function HomePage() {
  const stock = await getCachedStock();
  return (
    <>
      <Hero />
      <TrustStrip />
      <RoutineSteps />
      <FeaturedProducts stock={stock} />
      <IngredientsSection />
      <HowItWorks />
      <GuideCta />
      <FounderNote />
      <FaqSection />
      <NewsletterCta />
    </>
  );
}
