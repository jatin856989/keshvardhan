import { absoluteUrl, siteConfig } from "./site";
import type { Product } from "./products";

type JsonLd = Record<string, unknown>;

// Fixed so product pages stay fully prerenderable; bump when prices change.
const PRICE_VALID_UNTIL = "2027-12-31";

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/logo-mark.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.supportPhone,
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: siteConfig.email,
        telephone: siteConfig.supportPhone,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
        hoursAvailable: siteConfig.supportHours,
      },
    ],
    sameAs: Object.values(siteConfig.social),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function productJsonLd(product: Product, inStock: boolean): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${product.slug}#product`),
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.gallery.map((g) => absoluteUrl(g.src)),
    brand: { "@type": "Brand", name: siteConfig.name },
    category: product.kind === "powder" ? "Food > Herbal powders" : product.kind === "oil" ? "Beauty > Hair care > Hair oil" : "Beauty > Hair care",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "INR",
      price: (product.pricePaise / 100).toFixed(2),
      priceValidUntil: PRICE_VALID_UNTIL,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteConfig.url}/#organization` },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: product.rating.count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    } : undefined,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
