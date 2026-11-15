import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyCheckoutSignature, verifyWebhookSignature } from "@/lib/razorpay";

describe("Razorpay signature verification", () => {
  const secret = "test_secret_123";
  it("accepts a correct checkout signature", () => {
    const sig = createHmac("sha256", secret).update("order_A|pay_B").digest("hex");
    expect(verifyCheckoutSignature({ razorpayOrderId: "order_A", razorpayPaymentId: "pay_B", signature: sig, secret })).toBe(true);
  });
  it("rejects a tampered checkout signature", () => {
    const sig = createHmac("sha256", secret).update("order_A|pay_B").digest("hex");
    expect(verifyCheckoutSignature({ razorpayOrderId: "order_A", razorpayPaymentId: "pay_C", signature: sig, secret })).toBe(false);
    expect(verifyCheckoutSignature({ razorpayOrderId: "order_A", razorpayPaymentId: "pay_B", signature: sig.slice(0, -2) + "00", secret })).toBe(false);
  });
  it("verifies webhook bodies against the webhook secret", () => {
    const body = JSON.stringify({ event: "payment.captured" });
    const sig = createHmac("sha256", "wh_secret").update(body).digest("hex");
    expect(verifyWebhookSignature(body, sig, "wh_secret")).toBe(true);
    expect(verifyWebhookSignature(body + " ", sig, "wh_secret")).toBe(false);
    expect(verifyWebhookSignature(body, null, "wh_secret")).toBe(false);
  });
  it("fails closed when no secret is configured", () => {
    expect(verifyCheckoutSignature({ razorpayOrderId: "a", razorpayPaymentId: "b", signature: "c", secret: "" })).toBe(false);
  });
});
