import { createHmac, timingSafeEqual } from "node:crypto";

export type PaymentsMode = "razorpay" | "mock";

export function paymentsMode(): PaymentsMode {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) return "razorpay";
  if (process.env.NODE_ENV === "production") {
    // Production without keys is a misconfiguration; still never enable mock payments.
    return "razorpay";
  }
  return "mock";
}

/** True when live or test keys are present. */
export function paymentsConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Online payment can be offered when keys exist or the dev simulator is active. */
export function onlinePaymentAvailable(): boolean {
  return paymentsConfigured() || paymentsMode() === "mock";
}

export function razorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID ?? "";
}

/**
 * Razorpay checkout signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
 * https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/#verify-the-payment-signature
 */
export function verifyCheckoutSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
  secret?: string;
}): boolean {
  const secret = params.secret ?? process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");
  return constantTimeEqual(expected, params.signature);
}

/** Webhook signature: HMAC-SHA256(raw body, webhook secret) in X-Razorpay-Signature */
export function verifyWebhookSignature(rawBody: string, signature: string | null, secret?: string): boolean {
  const key = secret ?? process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!key || !signature) return false;
  const expected = createHmac("sha256", key).update(rawBody).digest("hex");
  return constantTimeEqual(expected, signature);
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/**
 * Creates a Razorpay Order via the REST API (Basic auth with key id/secret).
 * Amount is in paise. Uses fetch so no SDK runtime quirks on the edge.
 */
export async function createRazorpayOrder(input: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured");
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes ?? {},
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return (await res.json()) as RazorpayOrderResponse;
}

export async function createRazorpayRefund(paymentId: string, amountPaise?: number) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured");
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(amountPaise ? { amount: amountPaise } : {}),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay refund failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}
