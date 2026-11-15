// Carousel specs. Edit text here, then run: node social/instagram/tools/render-carousels.mjs
// Slide kinds: cover | text | plant | list | cta.  Type is never below 32 px (read at a third of size on a phone).

export const carousels = [
  {
    id: "carousel-1",
    out: "carousel-1-first-30-days",
    alt: "Cover slide reading 'Your first 30 days', a week-by-week hair care routine with Keshvardhan Daily Root Powder and Root Ritual Oil.",
    slides: [
      { kind: "cover", theme: "forest", kicker: "Keshvardhan 30-day routine", title: "Your first 30 days", body: "A week-by-week routine, one Sunday at a time.", image: "routine-bundle.webp" },
      { kind: "text", theme: "cream", kicker: "Why 30 days", title: "Hair works on a slow cycle.", body: "So give the routine a full month, not a week. Track what you notice and judge it on day 30." },
      { kind: "text", theme: "amla", kicker: "Week 1", title: "Build the habit.", body: "Pick a fixed moment for the powder. Do your first oiling on day 2. Take a day-1 photo of your parting." },
      { kind: "text", theme: "cream", kicker: "Week 2", title: "Check in on your scalp.", body: "Rate how it feels from 1 to 5 each Sunday. Write one line about it." },
      { kind: "text", theme: "amla", kicker: "Week 3", title: "Count the brush.", body: "After 20 strokes, count the strands in your brush. Same brush, same time, every Sunday." },
      { kind: "text", theme: "cream", kicker: "Week 4", title: "Compare day 1 and day 28.", body: "Put your day-1 photo next to today's. Look at your parting and your texture." },
      {
        kind: "list", theme: "forest", kicker: "The whole routine", title: "Three habits.",
        items: [
          ["Every morning", "1 teaspoon (5 g) of Daily Root Powder in water, milk, curd or a smoothie."],
          ["2 or 3 times a week", "Oil your scalp for 5 minutes. Leave it 1 hour or overnight. Wash with 1 shampoo."],
          ["Every Sunday", "A photo, a brush count and a scalp score from 1 to 5."],
        ],
      },
      { kind: "cta", theme: "terracotta", title: "Save this for day 1.", body: "Eat it. Oil it. Repeat.", note: "Results vary. Daily Root Powder is a food and Root Ritual Oil is a cosmetic." },
    ],
  },
  {
    id: "carousel-2",
    out: "carousel-2-six-ways",
    alt: "Cover slide reading '6 ways to take 1 teaspoon' about Keshvardhan Daily Root Powder recipes.",
    slides: [
      { kind: "cover", theme: "amla", kicker: "Daily Root Powder", title: "6 ways to take 1 teaspoon", body: "Beyond warm water.", image: "daily-root-powder.webp" },
      { kind: "text", theme: "cream", kicker: "The problem", title: "Warm water gets boring by week 2.", body: "It's a food, so it goes where food goes. Each serving is 1 level teaspoon (5 g)." },
      { kind: "text", theme: "forest", kicker: "1 of 6", title: "Golden milk.", body: "Whisk 1 teaspoon into 150 ml of warm milk with a pinch of cardamom." },
      { kind: "text", theme: "cream", kicker: "2 of 6", title: "Morning curd.", body: "Fold 1 teaspoon into 3 tablespoons of curd with a drizzle of honey." },
      { kind: "text", theme: "amla", kicker: "3 of 6", title: "Green smoothie.", body: "Blend 1 teaspoon with banana, spinach and coconut water." },
      { kind: "text", theme: "cream", kicker: "4 of 6", title: "Coconut chutney.", body: "Stir 1 teaspoon into coconut chutney for dosa or idli." },
      { kind: "text", theme: "forest", kicker: "5 of 6", title: "Energy laddoo.", body: "Bind 30 g of powder with dates and roasted peanuts. Makes 6, one serving each." },
      { kind: "text", theme: "amla", kicker: "6 of 6", title: "Chaas.", body: "Stir 1 teaspoon into buttermilk with roasted cumin and black salt." },
      { kind: "cta", theme: "terracotta", title: "Save this for breakfast.", body: "1 level teaspoon = 5 g.", note: "Contains sesame. If you are pregnant, breastfeeding or on medication, check with your doctor first." },
    ],
  },
  {
    id: "carousel-3",
    out: "carousel-3-eight-plants",
    alt: "Cover slide reading '8 plants. 8 numbers.' listing every ingredient in Keshvardhan Daily Root Powder with its amount.",
    slides: [
      { kind: "cover", theme: "forest", kicker: "Daily Root Powder", title: "8 plants. 8 numbers.", body: "Everything in 1 teaspoon (5 g).", image: "powder-ingredients.webp" },
      { kind: "plant", theme: "cream", name: "Amla", amount: "1,200 mg", role: "Vitamin C. A traditional hair tonic in Indian homes.", n: "1 of 8" },
      { kind: "plant", theme: "amla", name: "Black sesame", amount: "700 mg", role: "Healthy fats and zinc.", n: "2 of 8" },
      { kind: "plant", theme: "cream", name: "Moringa leaf", amount: "600 mg", role: "Iron, protein and micronutrients.", n: "3 of 8" },
      { kind: "plant", theme: "amla", name: "Bhringraj", amount: "600 mg", role: "A classic Ayurvedic hair herb.", n: "4 of 8" },
      { kind: "plant", theme: "cream", name: "Curry leaf", amount: "500 mg", role: "Antioxidants. A South Indian kitchen staple.", n: "5 of 8" },
      { kind: "plant", theme: "amla", name: "Fenugreek", amount: "500 mg", role: "Protein. Traditionally used in Indian hair care.", n: "6 of 8" },
      { kind: "plant", theme: "cream", name: "Pumpkin seed", amount: "500 mg", role: "Zinc and plant protein.", n: "7 of 8" },
      { kind: "plant", theme: "amla", name: "Hibiscus flower", amount: "400 mg", role: "A flower traditionally used in Indian hair care.", n: "8 of 8" },
      { kind: "cta", theme: "terracotta", title: "Save this before your next hair powder.", body: "No added sugar. No isolated vitamins.", note: "Contains sesame. A food product, not a medicine." },
    ],
  },
];
