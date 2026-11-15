import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";
import { orderConfirmationEmail, sendEmail } from "./email";
import { ebookUrlForOrder } from "./ebook";
import { orderAccessKey } from "./crypto";
import { getOrderWithItems, recordEvent } from "./orders";
import { createShipment } from "./shiprocket";
import { absoluteUrl } from "./site";

/**
 * Runs once per confirmed order: sends the confirmation email with the eBook
 * link and pushes the shipment to Shiprocket. Safe to call repeatedly; each
 * step checks its own "already done" marker.
 */
export async function fulfilOrder(orderId: string): Promise<void> {
  const data = await getOrderWithItems(orderId);
  if (!data) return;
  const { order, items } = data;
  const db = getDb();

  if (!order.confirmationEmailSentAt) {
    const orderUrl = absoluteUrl(`/order/${order.id}?k=${orderAccessKey(order.id)}`);
    const ebookUrl = ebookUrlForOrder(order.id);
    const mail = orderConfirmationEmail({ order, items, orderUrl, ebookUrl });
    try {
      const result = await sendEmail({ to: order.email, ...mail });
      await db
        .update(schema.orders)
        .set({
          confirmationEmailSentAt: new Date(),
          ebookSentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.id, order.id));
      await recordEvent(order.id, "confirmation_email", { delivered: result.delivered, id: result.id });
    } catch (err) {
      await recordEvent(order.id, "confirmation_email_failed", { message: String(err) });
      console.error("Confirmation email failed", err);
    }
  }

  if (!order.shipmentId) {
    try {
      const shipment = await createShipment(order, items);
      if (shipment.configured) {
        await db
          .update(schema.orders)
          .set({
            shipmentId: shipment.shipmentId,
            awb: shipment.awb,
            courier: shipment.courier,
            trackingUrl: shipment.trackingUrl,
            updatedAt: new Date(),
          })
          .where(eq(schema.orders.id, order.id));
        await recordEvent(order.id, "shipment_created", shipment);
      } else {
        await recordEvent(order.id, "shipment_skipped", { reason: "Shiprocket not configured" });
      }
    } catch (err) {
      await recordEvent(order.id, "shipment_failed", { message: String(err) });
      console.error("Shipment creation failed", err);
    }
  }
}
