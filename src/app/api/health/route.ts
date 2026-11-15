import { connection } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { paymentsMode } from "@/lib/razorpay";
import { isShiprocketConfigured } from "@/lib/shiprocket";
import { siteConfig } from "@/lib/site";

export async function GET() {
  await connection();
  return Response.json(
    {
      ok: true,
      database: isDatabaseConfigured(),
      payments: paymentsMode(),
      email: isEmailConfigured(),
      shipping: isShiprocketConfigured(),
      analytics: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
      siteUrl: siteConfig.url,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
