import type { Order, OrderItem } from "./db/schema";
import { getProduct, type ProductSlug } from "./products";

/**
 * Shiprocket integration (courier aggregator covering Delhivery, Ekart,
 * Xpressbees, Bluedart and others). When credentials are absent every call is
 * a no-op that returns `configured: false`, so local development and the
 * first days of launch can run with manual shipping from the dashboard.
 *
 * Flow: authenticate -> create adhoc order -> assign AWB -> request pickup.
 * Docs: https://apidocs.shiprocket.in/
 */
const BASE = "https://apiv2.shiprocket.in/v1/external";

let tokenCache: { token: string; expiresAt: number } | null = null;

export function isShiprocketConfigured(): boolean {
  return Boolean(process.env.SHIPROCKET_EMAIL && process.env.SHIPROCKET_PASSWORD);
}

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.token;
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shiprocket auth failed (${res.status})`);
  const data = (await res.json()) as { token: string };
  tokenCache = { token: data.token, expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 9 }; // tokens last 10 days
  return data.token;
}

async function api<T>(path: string, body: unknown): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Shiprocket ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return JSON.parse(text) as T;
}

export interface ShipmentResult {
  configured: boolean;
  shipmentId?: string;
  awb?: string;
  courier?: string;
  trackingUrl?: string;
  pickupScheduled?: boolean;
}

export async function createShipment(order: Order, items: OrderItem[]): Promise<ShipmentResult> {
  if (!isShiprocketConfigured()) return { configured: false };

  const weightKg =
    items.reduce((g, i) => g + (getProduct(i.productSlug as ProductSlug)?.weightGrams ?? 300) * i.quantity, 0) / 1000;
  const [firstName, ...rest] = order.customerName.split(" ");

  const created = await api<{ order_id: number; shipment_id: number }>("/orders/create/adhoc", {
    order_id: order.orderNumber,
    order_date: order.createdAt.toISOString().slice(0, 19).replace("T", " "),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? "Primary",
    billing_customer_name: firstName,
    billing_last_name: rest.join(" ") || ".",
    billing_address: order.addressLine1,
    billing_address_2: order.addressLine2 ?? "",
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: "India",
    billing_email: order.email,
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: items.map((i) => ({
      name: i.name,
      sku: i.sku,
      units: i.quantity,
      selling_price: i.unitPricePaise / 100,
      hsn: getProduct(i.productSlug as ProductSlug)?.hsn ?? "",
    })),
    payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
    shipping_charges: order.shippingPaise / 100,
    total_discount: 0,
    sub_total: order.subtotalPaise / 100,
    length: 20,
    breadth: 15,
    height: 10,
    weight: Math.max(0.3, Number(weightKg.toFixed(2))),
  });

  const awb = await api<{
    response?: { data?: { awb_code?: string; courier_name?: string } };
    awb_assign_status?: number;
  }>("/courier/assign/awb", { shipment_id: created.shipment_id });

  const awbCode = awb.response?.data?.awb_code;
  const courier = awb.response?.data?.courier_name;

  let pickupScheduled = false;
  try {
    await api("/courier/generate/pickup", { shipment_id: [created.shipment_id] });
    pickupScheduled = true;
  } catch (err) {
    console.warn("Shiprocket pickup scheduling failed", err);
  }

  return {
    configured: true,
    shipmentId: String(created.shipment_id),
    awb: awbCode,
    courier,
    trackingUrl: awbCode ? `https://shiprocket.co/tracking/${awbCode}` : undefined,
    pickupScheduled,
  };
}
