import { z } from "zod";
import { products } from "./products";

const slugs = products.map((p) => p.slug) as [string, ...string[]];

export const indianPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^\+91/, "").replace(/^0/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"));

export const pincode = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code");

export const cartLineSchema = z.object({
  slug: z.enum(slugs),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  items: z.array(cartLineSchema).min(1, "Your cart is empty").max(10),
  paymentMethod: z.enum(["razorpay", "cod"]),
  customer: z.object({
    name: z.string({ error: "Enter your full name" }).trim().min(2, "Enter your full name").max(80),
    email: z.string({ error: "Enter a valid email" }).trim().email("Enter a valid email").max(120).toLowerCase(),
    phone: z.string({ error: "Enter your mobile number" }).pipe(indianPhone),
    addressLine1: z.string({ error: "Enter your street address" }).trim().min(5, "Enter your street address").max(160),
    addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
    city: z.string({ error: "Enter your city" }).trim().min(2, "Enter your city").max(80),
    state: z.string({ error: "Select your state" }).trim().min(2, "Select your state").max(80),
    pincode: z.string({ error: "Enter your PIN code" }).pipe(pincode),
    notes: z.string().trim().max(300).optional().or(z.literal("")),
    marketingConsent: z.boolean().optional().default(false),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120).toLowerCase(),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(3, "Add a subject").max(120),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
  // Honeypot: real users never fill this
  website: z.string().max(0).optional().or(z.literal("")),
  // Time-trap: form rendered timestamp (ms); bots submit instantly
  startedAt: z.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const waitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120).toLowerCase(),
  name: z.string().trim().max(80).optional().or(z.literal("")),
  source: z.string().trim().max(40).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});
