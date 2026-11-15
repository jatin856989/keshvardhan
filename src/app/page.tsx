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
  title: "Keshvardhan | Edible Hair Powder and Herbal Hair Oil",
  description:
    "Eat a spoon of amla, bhringraj and moringa daily and oil your scalp twice a week. Free 30-day guide, free shipping above ₹999, COD across India.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | Nectar for your hair, inside and out`,
    description:
      "An edible herbal powder and a scalp oil made from a shared set of Indian botanicals. One routine, one ingredient list, one month to notice the difference.",
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
