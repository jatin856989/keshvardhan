/**
 * Canonical origin used for canonicals, sitemap, robots, Open Graph and schema.
 *
 * Order of precedence:
 * 1. NEXT_PUBLIC_SITE_URL, unless it points at localhost while running on Vercel
 *    (a copied development value would otherwise poison every canonical URL);
 * 2. Vercel's own production hostname (set automatically on every deployment);
 * 3. http://localhost:3000 for local development.
 * Set NEXT_PUBLIC_SITE_URL to the final custom domain once it is connected.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const isLocalhost = (u: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(u);
  if (explicit && !(vercelHost && isLocalhost(explicit))) return explicit;
  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

/**
 * Single source of truth for brand and business details used in metadata,
 * structured data, emails and the footer. Update here, not in components.
 */
export const siteConfig = {
  name: "Keshvardhan",
  legalName: "Keshvardhan Wellness",
  tagline: "Nectar for your hair, inside and out",
  description:
    "Keshvardhan is an inside-out hair care routine from India: a food-grade herbal Daily Root Powder you eat and a Root Ritual Oil you massage in, made from amla, bhringraj, curry leaf and hibiscus.",
  url: resolveSiteUrl(),
  locale: "en_IN",
  language: "en-IN",
  currency: "INR",
  email: "hello@keshvardhan.in",
  // TODO(launch): replace placeholder phone and address with the registered business details
  supportPhone: "+91 98765 43210",
  supportHours: "Mon to Sat, 10:00 to 19:00 IST",
  address: {
    streetAddress: "Plot 12, Wellness Park",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560001",
    addressCountry: "IN",
  },
  social: {
    instagram: "https://www.instagram.com/keshvardhan",
    youtube: "https://www.youtube.com/@keshvardhan",
    facebook: "https://www.facebook.com/keshvardhan",
  },
  foundingYear: 2026,
  gstin: "", // printed on invoices and the footer once registered
  fssaiLicense: "", // printed on the powder page and footer once issued
} as const;

/** Default social preview image; pages that override openGraph must re-add it. */
export const defaultOgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Keshvardhan: nectar for your hair, inside and out",
};

export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean === "/" ? "" : clean}`;
}

export const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/guide", label: "The Guide" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
] as const;

export const footerLinks = {
  shop: [
    { href: "/products/routine-bundle", label: "The Routine Bundle" },
    { href: "/products/daily-root-powder", label: "Daily Root Powder" },
    { href: "/products/root-ritual-oil", label: "Root Ritual Oil" },
    { href: "/guide", label: "Free 30-day Guide" },
  ],
  company: [
    { href: "/about", label: "Our Story" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;
