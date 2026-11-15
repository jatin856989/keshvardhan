import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, defaultOgImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us: Orders, Ingredients and Support",
  description:
    "Questions about an order, an ingredient or the routine? Write to Keshvardhan; a person replies within one working day, Monday to Saturday.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Keshvardhan", description: "A person replies within one working day.", url: "/contact", images: [defaultOgImage] },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl("/contact"),
          name: "Contact Keshvardhan",
          mainEntity: { "@id": `${siteConfig.url}/#organization` },
        }}
      />
      <PageIntro
        eyebrow="Contact"
        title="Talk to a person, not a bot."
        lead="Order questions, ingredient questions, press, retail or anything else. We read everything and reply within one working day."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />
      <Container className="mt-10">
        <section className="prose-ks" aria-labelledby="before-title">
          <h2 id="before-title">Before you write</h2>
          <p>
            Many questions are answered already. The <Link href="/faq">FAQ</Link> covers dosage, taste, when to expect
            changes and who the routine suits. <Link href="/shipping-returns">Shipping and returns</Link> explains delivery
            times, cash on delivery, the 7-day return window and what to do if a parcel arrives damaged. The{" "}
            <Link href="/ingredients">ingredients page</Link> lists every botanical with its exact quantity.
          </p>
          <p>
            For an order question, include your order number (it starts with KV) and the phone number used at checkout.
            For a damaged item, attach a photo. For anything medical, such as pregnancy, medication or a scalp condition,
            please check with your doctor first; we are happy to share the full ingredient and batch details for them.
          </p>
        </section>
      </Container>
      <Container className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl text-forest">Send a message</h2>
          <ContactForm />
        </Reveal>
        <Reveal delay={0.1} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-2xl text-forest">Other ways to reach us</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-amla" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-forest hover:underline">{siteConfig.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-amla" aria-hidden="true" />
                <span><a href={`tel:${siteConfig.supportPhone.replace(/\s/g, "")}`} className="font-semibold text-forest hover:underline">{siteConfig.supportPhone}</a> (calls and WhatsApp)</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 text-amla" aria-hidden="true" />
                <span>{siteConfig.supportHours}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-amla" aria-hidden="true" />
                <address className="not-italic">
                  {siteConfig.legalName}<br />
                  {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}<br />
                  {siteConfig.address.addressRegion} {siteConfig.address.postalCode}, India
                </address>
              </li>
            </ul>
          </div>
          <div className="card p-6 text-sm text-stone">
            <h2 className="font-display text-xl text-forest">Order questions</h2>
            <p className="mt-2">Include your order number (it starts with KV) and the phone number used at checkout so we can find it quickly.</p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
