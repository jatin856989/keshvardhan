import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { onlinePaymentAvailable, paymentsMode } from "@/lib/razorpay";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for your Keshvardhan order. Pay by UPI, card, netbanking or cash on delivery.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  const mode = paymentsMode();
  return (
    <Container className="py-10 lg:py-16">
      <h1 className="font-display text-4xl text-forest sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-stone">Guest checkout. No account needed; your guide and tracking go to the email you enter.</p>
      <CheckoutClient paymentsMode={mode} onlineAvailable={onlinePaymentAvailable()} />
    </Container>
  );
}
