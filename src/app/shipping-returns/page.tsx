import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping, returns and refunds",
  description: "Keshsudha ships across India within one working day. Free shipping above ₹999, cash on delivery for ₹49, 7-day returns on sealed products and free replacement for transit damage.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturnsPage() {
  return (
    <>
      <PageIntro eyebrow="Help" title="Shipping, returns and refunds" lead="Plain rules, no small print. If something is not covered here, write to us and we will sort it out." crumbs={[{ name: "Shipping & Returns", href: "/shipping-returns" }]} />
      <Container className="mt-12">
        <div className="prose-ks">
          <h2>Shipping</h2>
          <table>
            <tbody>
              <tr><th scope="row">Where</th><td>All serviceable PIN codes in India. No international shipping yet.</td></tr>
              <tr><th scope="row">Cost</th><td>Free on orders above ₹999. Flat ₹79 otherwise.</td></tr>
              <tr><th scope="row">Cash on delivery</th><td>Available on all orders for a ₹49 fee. Keep exact change ready for the courier.</td></tr>
              <tr><th scope="row">Dispatch</th><td>Within one working day (Monday to Saturday, excluding public holidays). Orders placed before 1 pm usually leave the same day.</td></tr>
              <tr><th scope="row">Delivery time</th><td>2 to 3 days to metro cities, 3 to 5 days elsewhere. Remote PIN codes may take longer.</td></tr>
              <tr><th scope="row">Tracking</th><td>Sent by email and WhatsApp as soon as the courier picks up the parcel.</td></tr>
              <tr><th scope="row">Packaging</th><td>The glass oil bottle ships in a protective sleeve inside a rigid box. Please open carefully.</td></tr>
            </tbody>
          </table>

          <h2>Cancellations</h2>
          <p>Cancel any time before dispatch for a full refund: reply to your confirmation email or <Link href="/contact">contact us</Link> with your order number. Once a parcel has left, please follow the return process below.</p>

          <h2>Returns</h2>
          <ul>
            <li>Sealed, unused products can be returned within 7 days of delivery.</li>
            <li>For hygiene and food-safety reasons we cannot accept opened powder jars or oil bottles unless they are faulty.</li>
            <li>To start a return, contact us with your order number and reason. We arrange a free pickup where available; otherwise we reimburse reasonable courier charges.</li>
          </ul>

          <h2>Damaged or wrong items</h2>
          <p>If anything arrives damaged, leaking or incorrect, send a photo within 48 hours of delivery and we will ship a replacement free of charge. No need to return the damaged item unless we ask.</p>

          <h2>Refunds</h2>
          <ul>
            <li>Refunds are issued to the original payment method within 5 working days of receiving the return (or immediately for pre-dispatch cancellations).</li>
            <li>Banks and card issuers can take a further 5 to 7 working days to show the credit.</li>
            <li>Cash-on-delivery refunds are made by bank transfer or UPI; we will ask for your details.</li>
            <li>Shipping and COD fees are refunded only if the return is due to our error or a faulty product.</li>
          </ul>

          <h2>Contact</h2>
          <p>Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>, call or WhatsApp {siteConfig.supportPhone} ({siteConfig.supportHours}), or use the <Link href="/contact">contact form</Link>.</p>
        </div>
      </Container>
    </>
  );
}
