/**
 * Product catalogue. Content lives in code so product pages prerender fully
 * (SEO) and never depend on the database being reachable. Stock, orders and
 * everything transactional live in PostgreSQL.
 */
export type ProductSlug =
  | "daily-root-powder"
  | "root-ritual-oil"
  | "routine-bundle";

export interface Ingredient {
  name: string;
  botanical?: string;
  amount: string;
  role: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  slug: ProductSlug;
  name: string;
  shortName: string;
  kind: "powder" | "oil" | "bundle";
  tagline: string;
  description: string;
  longDescription: string[];
  pricePaise: number;
  compareAtPaise?: number;
  size: string;
  servings?: string;
  shelfLife: string;
  weightGrams: number; // packed weight for shipping
  hsn: string;
  gstRate: number; // percent, confirm with tax advisor
  sku: string;
  image: { src: string; alt: string; width: number; height: number };
  gallery: Array<{ src: string; alt: string; width: number; height: number }>;
  color: string; // accent used on cards and the 3D scene
  highlights: string[];
  howToUse: string[];
  ingredients: Ingredient[];
  faqs: ProductFaq[];
  includes?: ProductSlug[];
  badge?: string;
  rating: { value: number; count: number };
}

export const products: Product[] = [
  {
    slug: "routine-bundle",
    name: "The Keshvardhan Routine",
    shortName: "Routine Bundle",
    kind: "bundle",
    tagline: "Eat it. Oil it. Repeat. Powder and oil together for one month.",
    description:
      "The complete inside-out hair routine: a 30-serving jar of Daily Root Powder and a 100 ml bottle of Root Ritual Oil, with the 30-day guide included.",
    longDescription: [
      "Hair is built from the inside and protected from the outside. The Routine pairs a spoon of food-grade botanicals a day with a twice-weekly scalp oil made from the same plants, so both sides of the story are covered for a full month.",
      "Every bundle ships with a printed quick-start card and instant access to the Keshvardhan Guide, a 40-page eBook that walks you through the first 30 days, recipes for the powder and the oiling technique step by step.",
    ],
    pricePaise: 139_900,
    compareAtPaise: 159_800,
    size: "150 g jar + 100 ml bottle",
    servings: "30 days",
    shelfLife: "12 months (powder), 18 months (oil)",
    weightGrams: 650,
    hsn: "2106",
    gstRate: 18,
    sku: "KV-BUNDLE-01",
    image: {
      src: "/images/products/routine-bundle.webp",
      alt: "Keshvardhan Routine bundle: a jar of Daily Root Powder next to a bottle of Root Ritual Oil",
      width: 1200,
      height: 1200,
    },
    gallery: [
      {
        src: "/images/products/routine-bundle.webp",
        alt: "Keshvardhan Routine bundle: a jar of Daily Root Powder next to a bottle of Root Ritual Oil",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/products/daily-root-powder.webp",
        alt: "Daily Root Powder jar with a wooden scoop of green herbal powder",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/products/root-ritual-oil.webp",
        alt: "Root Ritual Oil in an amber glass bottle with a dropper",
        width: 1200,
        height: 1200,
      },
    ],
    color: "#C4653A",
    highlights: [
      "Save Rs 199 versus buying separately",
      "30 servings of powder and 12 to 15 oil applications",
      "Free shipping and the 30-day guide included",
      "Subscribe later and save a further 15%",
    ],
    howToUse: [
      "Morning: stir one level teaspoon (5 g) of Daily Root Powder into warm water, milk or curd.",
      "Twice a week: warm a teaspoon of Root Ritual Oil, massage into the scalp for five minutes, leave for an hour or overnight, then wash.",
      "Follow the 30-day guide for the daily routine and the hair-fall tracker.",
    ],
    ingredients: [],
    faqs: [
      {
        question: "How long does the bundle last?",
        answer:
          "One month at the recommended routine: one serving of powder a day and two to three oil applications a week.",
      },
      {
        question: "Can I buy the powder or oil alone?",
        answer:
          "Yes, both are sold separately. The bundle is priced at a 12% saving and includes free shipping.",
      },
      {
        question: "Is the guide a physical book?",
        answer:
          "The guide is a designed eBook (PDF) delivered to your email within two minutes of ordering, plus a printed quick-start card in the box.",
      },
    ],
    includes: ["daily-root-powder", "root-ritual-oil"],
    badge: "Best value",
    rating: { value: 0, count: 0 },
  },
  {
    slug: "daily-root-powder",
    name: "Daily Root Powder",
    shortName: "Root Powder",
    kind: "powder",
    tagline: "A spoon of nine Indian botanicals a day, for hair built from within.",
    description:
      "Food-grade herbal hair nourishment powder with amla, bhringraj, curry leaf, moringa, hibiscus, fenugreek, black sesame and pumpkin seed. 150 g, 30 servings, no added sugar or synthetic vitamins.",
    longDescription: [
      "Daily Root Powder is a food, not a pill. Each 5 g serving blends nine botanicals that Indian households have used for hair for generations, ground fresh and nitrogen-flushed so they stay potent for a year.",
      "It tastes mildly tangy and nutty from the amla and black sesame, and mixes into warm water, milk, curd or a smoothie. The 30-day guide includes six recipes if you prefer it in food.",
      "We publish the exact quantity of every ingredient per serving. No proprietary blends, no isolated vitamins, no added sugar.",
    ],
    pricePaise: 89_900,
    size: "150 g jar",
    servings: "30 servings of 5 g",
    shelfLife: "12 months, nitrogen-flushed",
    weightGrams: 320,
    hsn: "2106",
    gstRate: 18,
    sku: "KV-POWDER-150",
    image: {
      src: "/images/products/daily-root-powder.webp",
      alt: "Daily Root Powder jar with a wooden scoop of green herbal powder",
      width: 1200,
      height: 1200,
    },
    gallery: [
      {
        src: "/images/products/daily-root-powder.webp",
        alt: "Daily Root Powder jar with a wooden scoop of green herbal powder",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/products/powder-ingredients.webp",
        alt: "Amla, curry leaves, moringa, hibiscus and black sesame arranged on a cream background",
        width: 1200,
        height: 1200,
      },
    ],
    color: "#7FA650",
    highlights: [
      "Nine botanicals, every quantity on the label",
      "No added sugar, no synthetic vitamins, no fillers",
      "Mixes into water, milk, curd or a smoothie",
      "Lab-tested per batch for heavy metals and microbes",
    ],
    howToUse: [
      "Take one level teaspoon (5 g) once a day, ideally in the morning.",
      "Stir into 150 ml of warm water or milk, or fold into curd or a smoothie.",
      "Give it 30 days of daily use; hair works on a slow cycle.",
    ],
    ingredients: [
      { name: "Amla", botanical: "Emblica officinalis", amount: "1,200 mg", role: "Vitamin C, traditional hair tonic" },
      { name: "Black sesame", botanical: "Sesamum indicum", amount: "700 mg", role: "Healthy fats, zinc" },
      { name: "Moringa leaf", botanical: "Moringa oleifera", amount: "600 mg", role: "Iron, protein, micronutrients" },
      { name: "Bhringraj", botanical: "Eclipta alba", amount: "600 mg", role: "Classic Ayurvedic hair herb" },
      { name: "Curry leaf", botanical: "Murraya koenigii", amount: "500 mg", role: "Antioxidants, scalp conditioning" },
      { name: "Fenugreek", botanical: "Trigonella foenum-graecum", amount: "500 mg", role: "Protein, traditional anti-fall use" },
      { name: "Pumpkin seed", botanical: "Cucurbita pepo", amount: "500 mg", role: "Zinc, plant protein" },
      { name: "Hibiscus flower", botanical: "Hibiscus rosa-sinensis", amount: "400 mg", role: "Conditioning, traditional use" },
    ],
    faqs: [
      {
        question: "Is it a supplement?",
        answer:
          "No. Daily Root Powder is a food product made only from botanicals and seeds, with no isolated vitamins or minerals. It is licensed under FSSAI as a food.",
      },
      {
        question: "What does it taste like?",
        answer:
          "Mildly tangy from the amla with a nutty finish from black sesame. Most people take it in warm water or milk; the guide has recipes for curd, smoothies and laddoos.",
      },
      {
        question: "Can I take it during pregnancy or with medication?",
        answer:
          "It is made from common food ingredients, but please check with your doctor if you are pregnant, breastfeeding, or on medication.",
      },
      {
        question: "When will I see a difference?",
        answer:
          "Hair grows in a slow cycle. Give the routine a full 30 days and use the tracker in the guide to notice changes in shedding and texture.",
      },
    ],
    badge: "Food-grade",
    rating: { value: 0, count: 0 },
  },
  {
    slug: "root-ritual-oil",
    name: "Root Ritual Oil",
    shortName: "Ritual Oil",
    kind: "oil",
    tagline: "Cold-pressed coconut and sesame, slow-infused with the same plants you eat.",
    description:
      "Herbal scalp oil in cold-pressed coconut and black sesame, slow-infused with bhringraj, amla, curry leaf, hibiscus and fenugreek, finished with castor and rosemary. 100 ml amber glass, no synthetic fragrance.",
    longDescription: [
      "Root Ritual Oil is the outside half of the routine. We slow-infuse the same botanicals from the Daily Root Powder into a base of cold-pressed coconut and black sesame oil, then add castor for body and a drop of rosemary for the scalp.",
      "It is light enough to wash out with one shampoo and scented only by the herbs themselves. The amber glass bottle protects the oil from light; a pump keeps it clean.",
    ],
    pricePaise: 69_900,
    size: "100 ml amber glass bottle",
    servings: "12 to 15 applications",
    shelfLife: "18 months",
    weightGrams: 290,
    hsn: "3305",
    gstRate: 18,
    sku: "KV-OIL-100",
    image: {
      src: "/images/products/root-ritual-oil.webp",
      alt: "Root Ritual Oil in an amber glass bottle with a dropper",
      width: 1200,
      height: 1200,
    },
    gallery: [
      {
        src: "/images/products/root-ritual-oil.webp",
        alt: "Root Ritual Oil in an amber glass bottle with a dropper",
        width: 1200,
        height: 1200,
      },
      {
        src: "/images/products/oil-ingredients.webp",
        alt: "Coconut halves, sesame seeds, bhringraj leaves and a rosemary sprig beside a bottle of oil",
        width: 1200,
        height: 1200,
      },
    ],
    color: "#C9A227",
    highlights: [
      "Cold-pressed coconut and black sesame base",
      "Slow-infused botanicals, no synthetic fragrance",
      "Washes out in one shampoo",
      "Amber glass with a pump; fragile-packed for shipping",
    ],
    howToUse: [
      "Warm a teaspoon of oil between your palms.",
      "Part the hair and massage into the scalp with fingertips for five minutes.",
      "Leave for one hour or overnight, then shampoo. Repeat two to three times a week.",
    ],
    ingredients: [
      { name: "Cold-pressed coconut oil", botanical: "Cocos nucifera", amount: "50 ml", role: "Penetrates the hair shaft" },
      { name: "Black sesame oil", botanical: "Sesamum indicum", amount: "30 ml", role: "Ayurvedic carrier oil" },
      { name: "Castor oil", botanical: "Ricinus communis", amount: "15 ml", role: "Viscosity, traditional scalp use" },
      { name: "Bhringraj (infused)", botanical: "Eclipta alba", amount: "5 g", role: "Classic Ayurvedic hair herb" },
      { name: "Amla (infused)", botanical: "Emblica officinalis", amount: "5 g", role: "Traditional hair tonic" },
      { name: "Curry leaf (infused)", botanical: "Murraya koenigii", amount: "3 g", role: "Scalp conditioning" },
      { name: "Hibiscus (infused)", botanical: "Hibiscus rosa-sinensis", amount: "3 g", role: "Conditioning" },
      { name: "Fenugreek (infused)", botanical: "Trigonella foenum-graecum", amount: "2 g", role: "Traditional anti-fall use" },
      { name: "Rosemary essential oil", botanical: "Rosmarinus officinalis", amount: "0.5 ml", role: "Scent and scalp stimulation" },
    ],
    faqs: [
      {
        question: "Will it make my hair greasy?",
        answer:
          "It is a light oil built on coconut and sesame and washes out with one shampoo. Use a teaspoon, not a handful.",
      },
      {
        question: "Does it have fragrance?",
        answer:
          "Only from the herbs and a drop of rosemary essential oil. There is no synthetic perfume.",
      },
      {
        question: "Does coconut oil solidify in winter?",
        answer:
          "Below about 24 degrees C it can thicken. Stand the bottle in warm water for a minute before use.",
      },
    ],
    badge: "No synthetic fragrance",
    rating: { value: 0, count: 0 },
  },
];

export const productBySlug = Object.fromEntries(
  products.map((p) => [p.slug, p]),
) as Record<ProductSlug, Product>;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function isProductSlug(slug: string): slug is ProductSlug {
  return products.some((p) => p.slug === slug);
}

export const allIngredients: Array<Ingredient & { usedIn: string[] }> = (() => {
  const map = new Map<string, Ingredient & { usedIn: string[] }>();
  for (const p of products) {
    for (const ing of p.ingredients) {
      const key = ing.name.replace(/\s*\(infused\)/, "");
      const existing = map.get(key);
      if (existing) existing.usedIn.push(p.shortName);
      else map.set(key, { ...ing, name: key, usedIn: [p.shortName] });
    }
  }
  return Array.from(map.values());
})();
