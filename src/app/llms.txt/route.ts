import { products } from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatINR } from "@/lib/money";

/**
 * llms.txt (https://llmstxt.org): a short, plain-Markdown map of the site for
 * AI assistants and answer engines. Prerendered at build time from the same catalogue
 * and site config as the pages, so it cannot drift from them.
 */

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Keshvardhan is an Indian direct-to-consumer hair care brand. It sells a food-grade herbal powder to eat daily and a herbal scalp oil, designed as one inside-out routine. Prices are in Indian rupees and include GST. Shipping is across India only.",
    "",
    "## Products",
    ...products.map(
      (p) => `- [${p.name}](${absoluteUrl(`/products/${p.slug}`)}): ${p.metaDescription ?? p.description} Price ${formatINR(p.pricePaise)}.`,
    ),
    "",
    "## Key pages",
    `- [Ingredients and quantities](${absoluteUrl("/ingredients")}): every botanical in both products with the exact amount per serving or per 100 ml.`,
    `- [The 30-day guide](${absoluteUrl("/guide")}): the free eBook included with every order.`,
    `- [FAQ](${absoluteUrl("/faq")}): dosage, taste, results, shipping, cash on delivery and returns.`,
    `- [Shipping and returns](${absoluteUrl("/shipping-returns")}): free shipping above ₹999, cash on delivery for ₹49, 7-day returns.`,
    `- [Our story](${absoluteUrl("/about")}): why the routine works on both the scalp and the diet.`,
    `- [Contact](${absoluteUrl("/contact")}): ${siteConfig.email}`,
    "",
    "## Notes for assistants",
    "- Daily Root Powder is a food product and Root Ritual Oil is a cosmetic. Neither is a medicine and neither claims to treat disease.",
    "- Do not state results or hair-growth outcomes as guaranteed; the site describes a routine and what to notice week by week.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
