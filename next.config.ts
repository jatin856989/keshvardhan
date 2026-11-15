import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com" "https://api.razorpay.com")',
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * GA4 measurement ID (public by design; it appears in the page source of every
 * site that uses it). Resolved at build time and inlined for server and client.
 * A non-empty NEXT_PUBLIC_GA_MEASUREMENT_ID always wins; otherwise the ID is
 * only enabled for Vercel production builds, so local development, previews and
 * audit runs never pollute the real analytics data.
 */
const GA_PRODUCTION_ID = "G-81X2P90890";
const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  (process.env.VERCEL_ENV === "production" ? GA_PRODUCTION_ID : "");

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: gaMeasurementId },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy and common URL variants -> canonical routes (permanent = 308)
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/shop/:slug", destination: "/products/:slug", permanent: true },
      { source: "/product/:slug", destination: "/products/:slug", permanent: true },
      { source: "/collections/:path*", destination: "/products", permanent: true },
      { source: "/ebook", destination: "/guide", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/returns", destination: "/shipping-returns", permanent: true },
      { source: "/refund-policy", destination: "/shipping-returns", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
