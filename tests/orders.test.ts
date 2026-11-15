import { describe, expect, it } from "vitest";
import { priceLines, stockRequirements } from "@/lib/orders";
import { checkoutSchema, contactSchema, indianPhone } from "@/lib/validation";

describe("priceLines", () => {
  it("re-prices from the catalogue and merges duplicate lines", () => {
    const lines = priceLines([
      { slug: "root-ritual-oil", quantity: 1 },
      { slug: "root-ritual-oil", quantity: 2 },
      { slug: "routine-bundle", quantity: 1 },
    ]);
    const oil = lines.find((l) => l.slug === "root-ritual-oil")!;
    expect(oil.quantity).toBe(3);
    expect(oil.unitPricePaise).toBe(69_900);
    expect(oil.lineTotalPaise).toBe(209_700);
    expect(lines).toHaveLength(2);
  });
  it("expands bundles into physical stock requirements", () => {
    const req = stockRequirements(priceLines([{ slug: "routine-bundle", quantity: 2 }, { slug: "daily-root-powder", quantity: 1 }]));
    expect(req.get("daily-root-powder")).toBe(3);
    expect(req.get("root-ritual-oil")).toBe(2);
    expect(req.has("routine-bundle")).toBe(false);
  });
});

describe("validation", () => {
  it("normalises Indian phone numbers", () => {
    expect(indianPhone.parse("+91 98765-43210")).toBe("9876543210");
    expect(indianPhone.parse("09876543210")).toBe("9876543210");
    expect(() => indianPhone.parse("12345")).toThrow();
  });
  it("rejects unknown products and bad PIN codes at checkout", () => {
    const base = {
      items: [{ slug: "daily-root-powder", quantity: 1 }],
      paymentMethod: "cod",
      customer: { name: "Asha Rao", email: "asha@example.com", phone: "9876543210", addressLine1: "12 MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
    };
    expect(checkoutSchema.safeParse(base).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...base, items: [{ slug: "nope", quantity: 1 }] }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...base, customer: { ...base.customer, pincode: "0123" } }).success).toBe(false);
  });
  it("honeypot must be empty on the contact form", () => {
    const ok = { name: "Asha", email: "a@b.co", subject: "Hello there", message: "This is a real message." };
    expect(contactSchema.safeParse(ok).success).toBe(true);
    expect(contactSchema.safeParse({ ...ok, website: "http://spam" }).success).toBe(false);
  });
});
