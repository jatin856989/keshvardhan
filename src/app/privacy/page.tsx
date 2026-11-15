import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Keshsudha collects, uses and protects your personal data: what we collect at checkout, cookies and analytics, the third-party services we use, how long we keep data and how to request deletion.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "15 November 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Legal" title="Privacy policy" lead={`Last updated ${UPDATED}. This policy explains what ${siteConfig.legalName} ("we") collects on ${siteConfig.url.replace(/^https?:\/\//, "")}, why, and the choices you have. It is written to comply with India's Digital Personal Data Protection Act, 2023.`} crumbs={[{ name: "Privacy Policy", href: "/privacy" }]} />
      <Container className="mt-12">
        <div className="prose-ks">
          <h2>1. What we collect and why</h2>
          <table>
            <thead><tr><th scope="col">When</th><th scope="col">Data</th><th scope="col">Purpose</th><th scope="col">Legal basis</th></tr></thead>
            <tbody>
              <tr><td>You place an order</td><td>Name, mobile number, email, delivery address, order contents, payment status, optional delivery notes</td><td>To process payment, deliver the order, send the confirmation email and the guide, provide support, and issue a GST invoice</td><td>Performance of a contract; legal obligation (tax records)</td></tr>
              <tr><td>You pay online</td><td>Handled by Razorpay. We receive a payment ID and status, never your card or UPI credentials</td><td>To confirm payment and process refunds</td><td>Performance of a contract</td></tr>
              <tr><td>You contact us</td><td>Name, email, optional phone, your message, a hashed IP address</td><td>To reply and to prevent spam</td><td>Consent; legitimate use</td></tr>
              <tr><td>You join the waitlist or newsletter</td><td>Email, optional name, where you signed up</td><td>To send the guide and occasional updates (one or two a month)</td><td>Consent; withdraw any time via the unsubscribe link or by emailing us</td></tr>
              <tr><td>You tick the marketing box at checkout</td><td>Your consent choice</td><td>To send routine tips and offers by email and WhatsApp</td><td>Consent</td></tr>
              <tr><td>You browse the site</td><td>Pages viewed, approximate location, device and browser type, referring site (only if analytics is enabled, see section 3)</td><td>To understand what works and fix what does not</td><td>Consent, where required</td></tr>
            </tbody>
          </table>
          <p>We do not collect sensitive personal data, and we do not knowingly collect data from children under 18. We never sell personal data.</p>

          <h2>2. Cookies and local storage</h2>
          <ul>
            <li><strong>Cart (local storage, essential):</strong> your cart contents are saved in your browser so they survive a refresh. This data stays on your device.</li>
            <li><strong>Admin session (cookie, essential):</strong> set only for our staff when they log in to the order dashboard.</li>
            <li><strong>Analytics (cookies, optional):</strong> if Google Analytics 4 is enabled on this site, Google sets cookies such as <code>_ga</code> to recognise returning visitors. See section 3.</li>
            <li><strong>Razorpay:</strong> the payment window sets its own cookies under Razorpay&apos;s privacy policy.</li>
          </ul>

          <h2>3. Analytics</h2>
          <p>
            We may use Google Analytics 4 to measure page views and events such as add to cart and purchase. We configure it
            without collecting names, emails, phone numbers or precise location, and IP addresses are not stored by GA4.
            You can block analytics with a browser extension or by enabling &quot;Do Not Track&quot;; the site works exactly the
            same without it.
          </p>

          <h2>4. Third parties who process data for us</h2>
          <table>
            <thead><tr><th scope="col">Service</th><th scope="col">What they do</th><th scope="col">Data shared</th></tr></thead>
            <tbody>
              <tr><td>Razorpay Software Pvt. Ltd. (India)</td><td>Payment processing</td><td>Order amount, your name, email and phone for prefill, payment outcome</td></tr>
              <tr><td>Shiprocket / partner couriers (India)</td><td>Shipping and delivery</td><td>Name, address, phone, order contents and value (for COD)</td></tr>
              <tr><td>Resend Inc.</td><td>Transactional email delivery</td><td>Email address and the content of order and contact emails</td></tr>
              <tr><td>Neon Inc. (PostgreSQL hosting, Singapore region)</td><td>Database hosting</td><td>Order, contact and waitlist records</td></tr>
              <tr><td>Vercel Inc.</td><td>Website hosting and CDN</td><td>Standard server logs (IP address, user agent, URL) retained briefly for security</td></tr>
              <tr><td>Google LLC</td><td>Analytics (if enabled) and web fonts served at build time</td><td>Pseudonymous usage data</td></tr>
              <tr><td>India Post PIN code API (api.postalpincode.in)</td><td>Autofill city and state at checkout</td><td>The PIN code you type, sent from your browser</td></tr>
            </tbody>
          </table>
          <p>Some of these providers store data outside India. We choose providers with contractual safeguards and limit what we share to what each needs.</p>

          <h2>5. How long we keep data</h2>
          <ul>
            <li>Order and invoice records: 8 years, as required by Indian tax law.</li>
            <li>Contact messages: 24 months, then deleted.</li>
            <li>Waitlist and marketing consent: until you unsubscribe or ask us to delete it.</li>
            <li>Server and security logs: up to 30 days.</li>
          </ul>

          <h2>6. Your rights</h2>
          <p>You can ask us at any time to:</p>
          <ul>
            <li>see the personal data we hold about you;</li>
            <li>correct it;</li>
            <li>delete it, except where we must keep it for tax or legal reasons;</li>
            <li>withdraw marketing consent;</li>
            <li>nominate someone to exercise these rights for you.</li>
          </ul>
          <p>
            Email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> with the subject &quot;Data request&quot; and the
            phone number or email used on your order. We respond within 30 days. If you are not satisfied, you may complain
            to the Data Protection Board of India.
          </p>

          <h2>7. Security</h2>
          <p>
            All pages are served over HTTPS. Card data is entered on Razorpay&apos;s PCI DSS compliant page and never touches our
            servers. Access to order data is limited to staff who need it, protected by a password and signed session.
            If a breach affecting your data ever occurs, we will notify you and the Data Protection Board as the law requires.
          </p>

          <h2>8. Grievance officer</h2>
          <p>
            Grievance Officer, {siteConfig.legalName}, {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality},{" "}
            {siteConfig.address.addressRegion} {siteConfig.address.postalCode}. Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h2>9. Changes</h2>
          <p>We will post any changes here and update the date at the top. Material changes will also be emailed to customers with an active order or subscription.</p>
          <p>See also our <Link href="/terms">Terms of Service</Link> and <Link href="/shipping-returns">Shipping &amp; Returns</Link>.</p>
        </div>
      </Container>
    </>
  );
}
