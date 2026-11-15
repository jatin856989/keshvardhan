import { Resend } from "resend";
import { formatINR } from "./money";
import { absoluteUrl, siteConfig } from "./site";
import type { Order, OrderItem } from "./db/schema";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Sends through Resend when configured; otherwise logs to the server console
 * so the flow can be exercised locally without credentials.
 */
export async function sendEmail(args: SendArgs): Promise<{ delivered: boolean; id?: string }> {
  const from = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;
  if (!isEmailConfigured()) {
    console.info(`[email:dry-run] to=${args.to} subject="${args.subject}"\n${args.text}`);
    return { delivered: false };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
  });
  if (error) throw new Error(`Email send failed: ${error.message}`);
  return { delivered: true, id: data?.id };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#F6F1E7;font-family:Georgia,'Times New Roman',serif;color:#1A1A1A;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F6F1E7;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#1F3D2B;padding:28px 32px;color:#F6F1E7;">
<div style="font-size:26px;letter-spacing:0.02em;">${siteConfig.name}</div>
<div style="font-size:13px;opacity:0.8;font-family:Arial,sans-serif;">${siteConfig.tagline}</div>
</td></tr>
<tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
<tr><td style="padding:20px 32px;background:#F6F1E7;font-family:Arial,sans-serif;font-size:12px;color:#5a5a5a;">
${siteConfig.legalName} · ${siteConfig.address.addressLocality}, ${siteConfig.address.addressRegion} · <a href="${absoluteUrl("/privacy")}" style="color:#1F3D2B;">Privacy</a> · <a href="mailto:${siteConfig.email}" style="color:#1F3D2B;">${siteConfig.email}</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
  return `<p style="margin:28px 0;"><a href="${href}" style="display:inline-block;background:#C4653A;color:#fff;text-decoration:none;padding:14px 26px;border-radius:999px;font-weight:bold;font-family:Arial,sans-serif;">${escapeHtml(label)}</a></p>`;
}

export function orderConfirmationEmail(params: {
  order: Order;
  items: OrderItem[];
  orderUrl: string;
  ebookUrl: string;
}): { subject: string; html: string; text: string } {
  const { order, items, orderUrl, ebookUrl } = params;
  const firstName = order.customerName.split(" ")[0];
  const itemsHtml = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(i.name)} × ${i.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #eee;">${formatINR(i.lineTotalPaise)}</td></tr>`,
    )
    .join("");
  const cod = order.paymentMethod === "cod";
  const subject = `Your Keshvardhan guide is ready (and order ${order.orderNumber} is on its way)`;
  const html = layout(
    subject,
    `<p style="font-size:18px;">Namaste ${escapeHtml(firstName)},</p>
<p>Thank you for starting the routine. Your 30-day guide is ready now, before the parcel even leaves us. It walks you through the first month, the recipes and the oiling technique.</p>
${button(ebookUrl, "Open your 30-day guide")}
<p style="font-size:13px;color:#5a5a5a;">This link works for 7 days. You can always request a fresh one from your order page.</p>
<h3 style="margin:28px 0 8px;font-family:Georgia,serif;">Order ${escapeHtml(order.orderNumber)}</h3>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">${itemsHtml}
<tr><td style="padding:8px 0;">Shipping</td><td align="right">${order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)}</td></tr>
${order.codFeePaise ? `<tr><td style="padding:8px 0;">Cash on delivery fee</td><td align="right">${formatINR(order.codFeePaise)}</td></tr>` : ""}
<tr><td style="padding:8px 0;font-weight:bold;">Total ${cod ? "(pay on delivery)" : "(paid)"}</td><td align="right" style="font-weight:bold;">${formatINR(order.totalPaise)}</td></tr>
</table>
<p style="margin-top:20px;">Delivering to:<br>${escapeHtml(order.customerName)}<br>${escapeHtml(order.addressLine1)}${order.addressLine2 ? `, ${escapeHtml(order.addressLine2)}` : ""}<br>${escapeHtml(order.city)}, ${escapeHtml(order.state)} ${escapeHtml(order.pincode)}</p>
<p>We dispatch within one working day and you will get tracking by email and WhatsApp. Expect delivery in 2 to 5 days.</p>
<p><a href="${orderUrl}" style="color:#1F3D2B;">View your order</a></p>
<p>Questions? Just reply to this email.</p>`,
  );
  const text = `Namaste ${firstName},

Thank you for starting the routine. Your 30-day guide is ready: ${ebookUrl}
(The link works for 7 days; request a fresh one from your order page.)

Order ${order.orderNumber}
${items.map((i) => `- ${i.name} x ${i.quantity}: ${formatINR(i.lineTotalPaise)}`).join("\n")}
Shipping: ${order.shippingPaise === 0 ? "Free" : formatINR(order.shippingPaise)}
${order.codFeePaise ? `COD fee: ${formatINR(order.codFeePaise)}\n` : ""}Total ${cod ? "(pay on delivery)" : "(paid)"}: ${formatINR(order.totalPaise)}

Delivering to: ${order.customerName}, ${order.addressLine1}${order.addressLine2 ? ", " + order.addressLine2 : ""}, ${order.city}, ${order.state} ${order.pincode}

View your order: ${orderUrl}
We dispatch within one working day. Expect delivery in 2 to 5 days.

${siteConfig.name}`;
  return { subject, html, text };
}

export function contactAcknowledgementEmail(name: string, subject: string) {
  const s = `We received your message: ${subject}`;
  const html = layout(
    s,
    `<p>Hi ${escapeHtml(name.split(" ")[0])},</p><p>Thanks for writing to ${siteConfig.name}. We reply within one working day (${siteConfig.supportHours}).</p><p>Your subject: <em>${escapeHtml(subject)}</em></p>`,
  );
  const text = `Hi ${name},\n\nThanks for writing to ${siteConfig.name}. We reply within one working day (${siteConfig.supportHours}).\nYour subject: ${subject}\n`;
  return { subject: s, html, text };
}

export function contactNotificationEmail(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const s = `[Contact] ${input.subject}`;
  const text = `From: ${input.name} <${input.email}>${input.phone ? ` (${input.phone})` : ""}\n\n${input.message}`;
  const html = layout(s, `<p><strong>${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt;${input.phone ? ` · ${escapeHtml(input.phone)}` : ""}</p><p style="white-space:pre-wrap;">${escapeHtml(input.message)}</p>`);
  return { subject: s, html, text };
}
