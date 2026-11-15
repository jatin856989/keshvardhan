/**
 * Single source of truth for brand and business details used in metadata,
 * structured data, emails and the footer. Update here, not in components.
 */
export const siteConfig = {
  name: "Keshsudha",
  legalName: "Keshsudha Wellness",
  tagline: "Nectar for your hair, inside and out",
  description:
    "Keshsudha is an inside-out hair care routine from India: a food-grade herbal Daily Root Powder you eat and a Root Ritual Oil you massage in, made from amla, bhringraj, curry leaf and hibiscus.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  language: "en-IN",
  currency: "INR",
  email: "hello@keshsudha.in",
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
    instagram: "https://www.instagram.com/keshsudha",
    youtube: "https://www.youtube.com/@keshsudha",
    facebook: "https://www.facebook.com/keshsudha",
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
  alt: "Keshsudha: nectar for your hair, inside and out",
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
