import { describe, expect, it } from "vitest";
import { COD_FEE_PAISE, computeTotals, formatINR, SHIPPING_FEE_PAISE } from "@/lib/money";

describe("computeTotals", () => {
  it("charges shipping under the free threshold", () => {
    const t = computeTotals([{ unitPricePaise: 69_900, quantity: 1 }], "razorpay");
    expect(t.shippingPaise).toBe(SHIPPING_FEE_PAISE);
    expect(t.totalPaise).toBe(69_900 + SHIPPING_FEE_PAISE);
  });
  it("gives free shipping at or above Rs 999", () => {
    const t = computeTotals([{ unitPricePaise: 139_900, quantity: 1 }], "razorpay");
    expect(t.shippingPaise).toBe(0);
    expect(t.totalPaise).toBe(139_900);
  });
  it("adds the COD fee only for cash on delivery", () => {
    const cod = computeTotals([{ unitPricePaise: 139_900, quantity: 1 }], "cod");
    expect(cod.codFeePaise).toBe(COD_FEE_PAISE);
    expect(cod.totalPaise).toBe(139_900 + COD_FEE_PAISE);
  });
  it("returns zeros for an empty cart", () => {
    const t = computeTotals([], "cod");
    expect(t).toEqual({ subtotalPaise: 0, shippingPaise: 0, codFeePaise: 0, totalPaise: 0 });
  });
});

describe("formatINR", () => {
  it("formats paise as rupees with Indian grouping", () => {
    expect(formatINR(139_900)).toContain("1,399");
    expect(formatINR(7_950)).toContain("79.50");
  });
});
