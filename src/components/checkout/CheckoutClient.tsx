"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useHydrated } from "@/lib/hooks";
import { productBySlug } from "@/lib/products";
import { computeTotals, formatINR, type PaymentMethod } from "@/lib/money";
import { gaItem, trackEvent } from "@/lib/analytics";
import type { PaymentsMode } from "@/lib/razorpay";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

interface CheckoutResponse {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  orderId?: string;
  accessKey?: string;
  mode?: "razorpay" | "mock" | "cod";
  razorpay?: { keyId: string; orderId: string; amount: number; currency: string; name: string; description: string; prefill: { name: string; email: string; contact: string } };
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: unknown) => void) => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutClient({ paymentsMode, onlineAvailable }: { paymentsMode: PaymentsMode; onlineAvailable: boolean }) {
  const router = useRouter();
  const { lines, clear } = useCart();
  const hydrated = useHydrated();
  const [method, setMethod] = useState<PaymentMethod>(onlineAvailable ? "razorpay" : "cod");
  const [status, setStatus] = useState<"idle" | "submitting" | "paying" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pendingMock, setPendingMock] = useState<{ orderId: string; accessKey: string } | null>(null);
  const [pinLookup, setPinLookup] = useState<{ city: string; state: string } | null>(null);

  const priced = useMemo(
    () => lines.map((l) => ({ ...l, product: productBySlug[l.slug] })).filter((l) => l.product),
    [lines],
  );
  const totals = computeTotals(priced.map((l) => ({ unitPricePaise: l.product.pricePaise, quantity: l.quantity })), method);

  useEffect(() => {
    if (hydrated && priced.length > 0) {
      trackEvent("begin_checkout", {
        currency: "INR",
        value: totals.subtotalPaise / 100,
        items: priced.map((l) => gaItem({ slug: l.slug, name: l.product.name, pricePaise: l.product.pricePaise, quantity: l.quantity })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  async function lookupPin(pin: string, form: HTMLFormElement) {
    if (!/^[1-9]\d{5}$/.test(pin)) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = (await res.json()) as Array<{ Status: string; PostOffice?: Array<{ District: string; State: string }> }>;
      const po = data?.[0]?.PostOffice?.[0];
      if (po) {
        setPinLookup({ city: po.District, state: po.State });
        const city = form.elements.namedItem("city") as HTMLInputElement;
        const state = form.elements.namedItem("state") as HTMLSelectElement;
        if (city && !city.value) city.value = po.District;
        if (state && INDIAN_STATES.includes(po.State)) state.value = po.State;
      }
    } catch {
      // lookup is a convenience only
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    const customer = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      addressLine1: String(fd.get("addressLine1") ?? ""),
      addressLine2: String(fd.get("addressLine2") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? ""),
      pincode: String(fd.get("pincode") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      marketingConsent: fd.get("marketingConsent") === "on",
    };
    setStatus("submitting");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines, paymentMethod: method, customer }),
      });
      const data = (await res.json()) as CheckoutResponse;
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        throw new Error(data.message ?? "Could not start checkout");
      }
      if (data.mode === "cod") {
        clear();
        router.push(`/order/${data.orderId}?k=${data.accessKey}`);
        return;
      }
      if (data.mode === "mock") {
        setPendingMock({ orderId: data.orderId!, accessKey: data.accessKey! });
        setStatus("paying");
        return;
      }
      if (data.mode === "razorpay" && data.razorpay) {
        const loaded = await loadRazorpay();
        if (!loaded || !window.Razorpay) throw new Error("Payment page could not load. Check your connection and try again.");
        setStatus("paying");
        const rz = new window.Razorpay({
          key: data.razorpay.keyId,
          amount: data.razorpay.amount,
          currency: data.razorpay.currency,
          name: data.razorpay.name,
          description: data.razorpay.description,
          order_id: data.razorpay.orderId,
          prefill: data.razorpay.prefill,
          notes: { orderId: data.orderId },
          theme: { color: "#1F3D2B" },
          method: { upi: true, card: true, netbanking: true, wallet: true },
          modal: {
            ondismiss: () => {
              setStatus("idle");
              setError("Payment was cancelled. Your order is saved; you can try again.");
            },
          },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            const verify = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderId, ...response }),
            });
            const v = (await verify.json()) as { ok: boolean; accessKey?: string; message?: string };
            if (!verify.ok || !v.ok) {
              setStatus("error");
              setError(v.message ?? "We could not verify the payment. If money was deducted it will be refunded automatically.");
              return;
            }
            clear();
            router.push(`/order/${data.orderId}?k=${v.accessKey}`);
          },
        });
        rz.on("payment.failed", (r: unknown) => {
          const reason = (r as { error?: { description?: string } })?.error?.description;
          setStatus("idle");
          setError(reason ? `Payment failed: ${reason}` : "Payment failed. Please try again or choose cash on delivery.");
        });
        rz.open();
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function simulatePayment() {
    if (!pendingMock) return;
    setStatus("submitting");
    const res = await fetch("/api/checkout/mock-pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: pendingMock.orderId }),
    });
    const data = (await res.json()) as { ok: boolean; accessKey?: string; message?: string };
    if (!res.ok || !data.ok) {
      setStatus("error");
      setError(data.message ?? "Simulated payment failed");
      return;
    }
    clear();
    router.push(`/order/${pendingMock.orderId}?k=${data.accessKey}`);
  }

  if (!hydrated) return <div className="mt-10 h-64 animate-pulse rounded-3xl bg-white" aria-hidden="true" />;

  if (priced.length === 0 && !pendingMock) {
    return (
      <div className="card mt-10 px-6 py-16 text-center">
        <p className="font-display text-2xl text-forest">Your cart is empty</p>
        <Link href="/products" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const err = (name: string) => fieldErrors[name];

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-8" noValidate aria-describedby={error ? "checkout-error" : undefined}>
        <fieldset className="card p-6 sm:p-8">
          <legend className="font-display px-2 text-2xl text-forest">Contact</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" autoComplete="name" required error={err("customer.name")} />
            <Field label="Mobile number" name="phone" type="tel" inputMode="numeric" autoComplete="tel" required error={err("customer.phone")} placeholder="10-digit number" />
            <Field label="Email (for your guide and tracking)" name="email" type="email" autoComplete="email" required error={err("customer.email")} className="sm:col-span-2" />
          </div>
        </fieldset>

        <fieldset className="card p-6 sm:p-8">
          <legend className="font-display px-2 text-2xl text-forest">Delivery address</legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Address line 1" name="addressLine1" autoComplete="address-line1" required error={err("customer.addressLine1")} className="sm:col-span-2" placeholder="Flat, house no., building, street" />
            <Field label="Address line 2 (optional)" name="addressLine2" autoComplete="address-line2" className="sm:col-span-2" placeholder="Area, landmark" />
            <Field label="PIN code" name="pincode" inputMode="numeric" autoComplete="postal-code" required error={err("customer.pincode")} onBlur={(e) => lookupPin(e.target.value, e.target.form!)} />
            <Field label="City" name="city" autoComplete="address-level2" required error={err("customer.city")} defaultValue={pinLookup?.city} />
            <div className="sm:col-span-2">
              <label htmlFor="state" className="mb-1.5 block text-sm font-semibold text-forest">State</label>
              <select id="state" name="state" required autoComplete="address-level1" className="field" defaultValue="" aria-invalid={Boolean(err("customer.state"))}>
                <option value="" disabled>Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {err("customer.state") ? <p className="mt-1 text-xs text-red-700">{err("customer.state")}</p> : null}
            </div>
            <Field label="Delivery notes (optional)" name="notes" className="sm:col-span-2" placeholder="Gate code, best time, etc." />
          </div>
        </fieldset>

        <fieldset className="card p-6 sm:p-8">
          <legend className="font-display px-2 text-2xl text-forest">Payment</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {onlineAvailable ? (
              <PaymentOption checked={method === "razorpay"} onChange={() => setMethod("razorpay")} title="Pay online" body="UPI, cards, netbanking, wallets. Secured by Razorpay." />
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-4 text-sm text-stone">
                <span className="block font-semibold text-forest">Online payment temporarily unavailable</span>
                Please use cash on delivery for now.
              </div>
            )}
            <PaymentOption checked={method === "cod"} onChange={() => setMethod("cod")} title="Cash on delivery" body="Pay the courier at your door. ₹49 handling fee." />
          </div>
          <label className="mt-5 flex items-start gap-3 text-sm text-stone">
            <input type="checkbox" name="marketingConsent" className="mt-1 size-4 accent-forest" />
            Send me routine tips and offers by email and WhatsApp (one or two a month, unsubscribe anytime).
          </label>
          <p className="mt-4 text-xs text-stone">
            By placing the order you agree to our <Link href="/terms" className="underline">Terms</Link>, <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/shipping-returns" className="underline">Shipping &amp; Returns</Link>.
          </p>
        </fieldset>

        {error ? (
          <p id="checkout-error" role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p>
        ) : null}

        {pendingMock ? (
          <div className="rounded-2xl border border-gold/50 bg-gold/10 p-5">
            <p className="font-semibold text-forest">Test mode: Razorpay keys are not configured.</p>
            <p className="mt-1 text-sm text-stone">Your order has been created. Simulate a successful payment to see the confirmation and eBook flow.</p>
            <button type="button" onClick={simulatePayment} className="btn btn-primary mt-4" disabled={status === "submitting"}>Simulate successful payment</button>
          </div>
        ) : (
          <button type="submit" className="btn btn-accent h-14 w-full text-base" disabled={status === "submitting" || status === "paying"}>
            <Lock className="size-4" aria-hidden="true" />
            {status === "submitting" ? "Preparing your order…" : status === "paying" ? "Complete payment in the window…" : method === "cod" ? `Place order · ${formatINR(totals.totalPaise)}` : `Pay ${formatINR(totals.totalPaise)}`}
          </button>
        )}
        {paymentsMode === "mock" && !pendingMock ? (
          <p className="text-center text-xs text-stone">Development mode: online payment will be simulated because Razorpay keys are not set.</p>
        ) : null}
      </form>

      <aside className="card h-fit p-6 lg:sticky lg:top-24" aria-labelledby="order-summary">
        <h2 id="order-summary" className="font-display text-2xl text-forest">Order summary</h2>
        <ul className="mt-5 space-y-4">
          {priced.map(({ product, quantity }) => (
            <li key={product.slug} className="flex items-center gap-3">
              <Image src={product.image.src} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-forest">{product.name}</p>
                <p className="text-xs text-stone">Qty {quantity}</p>
              </div>
              <span className="text-sm font-semibold">{formatINR(product.pricePaise * quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{formatINR(totals.subtotalPaise)}</dd></div>
          <div className="flex justify-between"><dt className="text-stone">Shipping</dt><dd>{totals.shippingPaise === 0 ? "Free" : formatINR(totals.shippingPaise)}</dd></div>
          {totals.codFeePaise ? <div className="flex justify-between"><dt className="text-stone">COD fee</dt><dd>{formatINR(totals.codFeePaise)}</dd></div> : null}
          <div className="flex justify-between border-t border-line pt-2 text-base"><dt className="font-semibold text-forest">Total</dt><dd className="font-bold text-forest">{formatINR(totals.totalPaise)}</dd></div>
        </dl>
        <p className="mt-5 flex items-start gap-2 text-xs text-stone">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amla" aria-hidden="true" />
          Card details are entered on Razorpay&apos;s secure page and never touch our servers. Your 30-day guide is emailed within two minutes of confirmation.
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-forest">{label}</label>
      <input id={name} name={name} className="field" aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...rest} />
      {error ? <p id={`${name}-error`} className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function PaymentOption({ checked, onChange, title, body }: { checked: boolean; onChange: () => void; title: string; body: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${checked ? "border-forest bg-forest/5" : "border-line hover:border-forest/40"}`}>
      <input type="radio" name="paymentMethod" checked={checked} onChange={onChange} className="mt-1 size-4 accent-forest" />
      <span>
        <span className="block font-semibold text-forest">{title}</span>
        <span className="block text-sm text-stone">{body}</span>
      </span>
    </label>
  );
}
