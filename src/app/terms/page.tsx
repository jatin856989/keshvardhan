import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { defaultOgImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you buy from Keshvardhan: ordering, pricing, payment, delivery, cancellations, product use and liability.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of service | Keshvardhan", description: "The terms that apply when you buy from Keshvardhan: ordering, pricing, payment, delivery, cancellations, product use and liability.", url: "/terms", images: [defaultOgImage] },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Terms of service" lead={`Last updated 15 November 2026. These terms govern purchases from ${siteConfig.legalName} through this website. By placing an order you accept them.`} crumbs={[{ name: "Terms of Service", href: "/terms" }]} />
      <Container className="mt-12">
        <div className="prose-ks">
          <h2>1. Who we are</h2>
          <p>{siteConfig.legalName}, {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} {siteConfig.address.postalCode}, India. Email {siteConfig.email}.</p>

          <h2>2. Products</h2>
          <p>Daily Root Powder is a food product. Root Ritual Oil is a cosmetic for external use. Neither is a medicine and neither is intended to diagnose, treat, cure or prevent any disease. Results vary from person to person. Read the label, follow the directions, do a patch test with the oil, and consult a doctor if you are pregnant, breastfeeding, on medication or have a medical condition.</p>

          <h2>3. Orders and acceptance</h2>
          <p>An order is accepted when payment is confirmed (online) or when we accept a cash-on-delivery request. We may refuse or cancel an order for reasons including stock errors, pricing errors, suspected fraud or an unserviceable address; any payment taken is refunded in full.</p>

          <h2>4. Pricing and payment</h2>
          <p>Prices are in Indian rupees and include GST. Shipping is free on orders above ₹999 and ₹79 otherwise; cash on delivery carries a ₹49 fee. Online payments are processed by Razorpay; we never see your card or UPI credentials. A GST invoice is emailed with your order.</p>

          <h2>5. Delivery</h2>
          <p>We ship within India only. Dispatch is within one working day of acceptance and delivery typically takes 2 to 5 days. Delivery dates are estimates. Risk passes to you on delivery. See <Link href="/shipping-returns">Shipping &amp; Returns</Link> for details.</p>

          <h2>6. Cancellations, returns and refunds</h2>
          <p>You may cancel before dispatch for a full refund. Sealed, unused products may be returned within 7 days of delivery. Products damaged in transit are replaced free on photo proof within 48 hours of delivery. Refunds are issued to the original payment method within 5 working days of receiving the return. Full policy: <Link href="/shipping-returns">Shipping &amp; Returns</Link>.</p>

          <h2>7. The guide</h2>
          <p>The 30-Day Inside-Out Hair Guide is provided free with orders for personal, non-commercial use. You may print and share it with family; you may not resell or republish it.</p>

          <h2>8. Your account and conduct</h2>
          <p>There are no customer accounts. You are responsible for the accuracy of the contact and address details you give. Do not misuse the website, attempt to access other customers&apos; orders, or interfere with its operation.</p>

          <h2>9. Intellectual property</h2>
          <p>The Keshvardhan name, logo, packaging, photography, text and guide are our property or used under licence. You may not use them without written permission.</p>

          <h2>10. Liability</h2>
          <p>To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid for that order. Nothing in these terms limits liability that cannot be limited under Indian law, including under the Consumer Protection Act, 2019.</p>

          <h2>11. Governing law and disputes</h2>
          <p>These terms are governed by the laws of India. Courts in {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} have jurisdiction, without prejudice to your rights under consumer protection law to approach the forum nearest to you.</p>

          <h2>12. Contact</h2>
          <p>Questions about these terms: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or the <Link href="/contact">contact page</Link>. See also our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </Container>
    </>
  );
}
