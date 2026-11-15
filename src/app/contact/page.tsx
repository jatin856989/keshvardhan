import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, defaultOgImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Questions about an order, an ingredient or the routine? Write to ${siteConfig.name}; a person replies within one working day (${siteConfig.supportHours}).`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Keshsudha", description: "A person replies within one working day.", url: "/contact", images: [defaultOgImage] },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl("/contact"),
          name: "Contact Keshsudha",
          mainEntity: { "@id": `${siteConfig.url}/#organization` },
        }}
      />
      <PageIntro
        eyebrow="Contact"
        title="Talk to a person, not a bot."
        lead="Order questions, ingredient questions, press, retail or anything else. We read everything and reply within one working day."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />
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
            <p className="mt-2">Include your order number (it starts with KS) and the phone number used at checkout so we can find it quickly.</p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
