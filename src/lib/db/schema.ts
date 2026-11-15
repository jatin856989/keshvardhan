import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // created, awaiting payment
  "paid", // online payment verified
  "cod_confirmed", // cash on delivery order accepted
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "rto", // returned to origin
]);

export const paymentMethodEnum = pgEnum("payment_method", ["razorpay", "cod"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "cod_pending",
]);

export const productStock = pgTable("product_stock", {
  slug: text("slug").primaryKey(),
  stock: integer("stock").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(50),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  razorpayOrderId: text("razorpay_order_id").unique(),
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  subtotalPaise: integer("subtotal_paise").notNull(),
  shippingPaise: integer("shipping_paise").notNull().default(0),
  codFeePaise: integer("cod_fee_paise").notNull().default(0),
  totalPaise: integer("total_paise").notNull(),
  currency: text("currency").notNull().default("INR"),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  notes: text("notes"),
  marketingConsent: boolean("marketing_consent").notNull().default(false),
  ebookSentAt: timestamp("ebook_sent_at", { withTimezone: true }),
  confirmationEmailSentAt: timestamp("confirmation_email_sent_at", { withTimezone: true }),
  shipmentId: text("shipment_id"),
  awb: text("awb"),
  courier: text("courier"),
  trackingUrl: text("tracking_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  unitPricePaise: integer("unit_price_paise").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotalPaise: integer("line_total_paise").notNull(),
});

export const orderEvents = pgTable("order_events", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  data: jsonb("data"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(), // provider event id (or a deterministic key)
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").notNull().default(false),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  ipHash: text("ip_hash"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
