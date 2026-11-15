export const SHIPPING_FEE_PAISE = 7_900; // Rs 79
export const FREE_SHIPPING_THRESHOLD_PAISE = 99_900; // Rs 999
export const COD_FEE_PAISE = 4_900; // Rs 49

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(rupees) ? 0 : 2,
  }).format(rupees);
}

export type PaymentMethod = "razorpay" | "cod";

export interface Totals {
  subtotalPaise: number;
  shippingPaise: number;
  codFeePaise: number;
  totalPaise: number;
}

export function computeTotals(
  lines: Array<{ unitPricePaise: number; quantity: number }>,
  paymentMethod: PaymentMethod,
): Totals {
  const subtotalPaise = lines.reduce(
    (sum, l) => sum + l.unitPricePaise * l.quantity,
    0,
  );
  const shippingPaise =
    subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE
      ? 0
      : SHIPPING_FEE_PAISE;
  const codFeePaise =
    paymentMethod === "cod" && subtotalPaise > 0 ? COD_FEE_PAISE : 0;
  return {
    subtotalPaise,
    shippingPaise,
    codFeePaise,
    totalPaise: subtotalPaise + shippingPaise + codFeePaise,
  };
}
