import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/site";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { faqJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { homeFaqs } from "@/components/home/Sections";

export const metadata: Metadata = {
  title: "FAQ: dosage, taste, shipping, returns and more",
  description:
    "Answers about Keshvardhan's Daily Root Powder and Root Ritual Oil: is it a supplement, what it tastes like, when to expect results, shipping across India, cash on delivery, returns and the free guide.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Frequently asked questions | Keshvardhan", description: "Dosage, taste, shipping, returns and the guide.", url: "/faq", images: [defaultOgImage] },
};

const groups = [
  { title: "The routine", items: homeFaqs },
  ...products.map((p) => ({ title: p.name, items: p.faqs })),
  {
    title: "Orders, shipping and returns",
    items: [
      { question: "How long does delivery take?", answer: "We dispatch within one working day. Metro cities usually receive orders in 2 to 3 days, other PIN codes in 3 to 5 days. You get tracking by email and WhatsApp." },
      { question: "Which payment methods do you accept?", answer: "UPI, debit and credit cards, netbanking and wallets through Razorpay, plus cash on delivery for a ₹49 fee." },
      { question: "Can I change my address after ordering?", answer: "Yes, if the parcel has not been dispatched. Contact us with your order number as soon as possible." },
      { question: "How do returns and refunds work?", answer: "Sealed, unused products can be returned within 7 days of delivery. Once we receive them, refunds go back to the original payment method within 5 working days. Damaged-in-transit items are replaced free on photo proof." },
      { question: "Do you ship outside India?", answer: "Not yet. We currently ship to serviceable PIN codes within India only." },
      { question: "I did not receive the guide email.", answer: "Check spam and promotions folders first. Then open your order page from the confirmation screen and click 'Resend my guide'. You can also download it directly from that page." },
    ],
  },
];

export default function FaqPage() {
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <PageIntro
        eyebrow="FAQ"
        title="Asked before, answered honestly."
        lead="If your question is not here, write to us and a person will reply within one working day."
        crumbs={[{ name: "FAQ", href: "/faq" }]}
      />
      <Container className="mt-14 space-y-12">
        {groups.map((g) => (
          <Reveal key={g.title} as="section" className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <h2 className="font-display text-3xl text-forest">{g.title}</h2>
            <Accordion items={g.items} defaultOpen={null} />
          </Reveal>
        ))}
        <p className="text-stone">
          Still curious? <Link href="/contact" className="font-semibold text-terracotta underline-offset-4 hover:underline">Contact us</Link>.
        </p>
      </Container>
    </>
  );
}
