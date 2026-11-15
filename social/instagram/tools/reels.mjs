// Reel specs. Edit the text or timings here, then run: node social/instagram/tools/render-reels.mjs
// Times are seconds from the start, taken from the timed beat sheets (beats.py at 165 wpm).
// Each card shows 6 words or fewer, except data cards (lists, big numbers), per the ig-reel rules.
// Safe zone (1080x1920): nothing above y=230 or below y=1440, right 230 px clear. The renderer enforces this.

export const reels = [
  {
    id: "reel-1",
    out: "reel-1-half-the-job",
    cards: [
      { s: 0, e: 2.9, theme: "forest", layout: "text", lines: ["Oil is only", "half the job."] },
      { s: 2.9, e: 5.5, theme: "cream", layout: "text", lines: ["Built from", "what you eat."] },
      { s: 5.5, e: 8.0, theme: "amla", layout: "text", lines: ["Protected by", "what you apply."] },
      { s: 8.0, e: 10.6, theme: "cream", layout: "text", lines: ["One bottle", "can't do both."] },
      { s: 10.6, e: 12.0, theme: "forest", layout: "image", image: "routine-bundle.webp", lines: ["So we made both."] },
      { s: 12.0, e: 15.3, theme: "amla", layout: "image", image: "daily-root-powder.webp", lines: ["1 teaspoon.", "8 plants.", "Every morning."] },
      { s: 15.3, e: 17.5, theme: "cream", layout: "image", image: "root-ritual-oil.webp", lines: ["Plus an oil", "infused with 5."] },
      { s: 17.5, e: 19.3, theme: "terracotta", layout: "text", lines: ["Twice a week."] },
      { s: 19.3, e: 21.4, theme: "amla", layout: "text", lines: ["Every milligram", "on the label."] },
      { s: 21.4, e: 23.0, theme: "cream", layout: "bignum", big: "30", lines: ["Give it 30 days."] },
      { s: 23.0, e: 24.7, theme: "cream", layout: "text", lines: ["That's the", "fair test."] },
      { s: 24.7, e: 27.3, theme: "terracotta", layout: "text", lines: ["Save this for", "wash day."] },
      { s: 27.3, e: 30.5, theme: "forest", layout: "text", handle: true, lines: ["Eat it.", "Oil it.", "Repeat."] },
    ],
  },
  {
    id: "reel-2",
    out: "reel-2-1200-mg",
    cards: [
      { s: 0, e: 2.9, theme: "forest", layout: "bignum", big: "1,200 mg", lines: ["of amla"] },
      { s: 2.9, e: 6.2, theme: "cream", layout: "text", lines: ["That's 1 teaspoon.", "We print it."] },
      { s: 6.2, e: 9.8, theme: "amla", layout: "list", rows: [["Black sesame", "700 mg"], ["Moringa leaf", "600 mg"], ["Bhringraj", "600 mg"]] },
      { s: 9.8, e: 14.5, theme: "cream", layout: "list", rows: [["Curry leaf", "500 mg"], ["Fenugreek", "500 mg"], ["Pumpkin seed", "500 mg"], ["Hibiscus", "400 mg"]] },
      { s: 14.5, e: 16.1, theme: "forest", layout: "text", lines: ["That's all 8."] },
      { s: 16.1, e: 17.8, theme: "amla", layout: "text", lines: ["No added sugar.", "No isolated", "vitamins."] },
      { s: 17.8, e: 21.1, theme: "cream", layout: "text", lines: ["“Proprietary", "blend” means", "no numbers."] },
      { s: 21.1, e: 25.1, theme: "terracotta", layout: "text", lines: ["Save this.", "Check your", "label."] },
      { s: 25.1, e: 29.1, theme: "forest", layout: "text", handle: true, lines: ["We print all 8."] },
    ],
  },
  {
    id: "reel-3",
    out: "reel-3-scalp-not-lengths",
    cards: [
      { s: 0, e: 2.5, theme: "forest", layout: "text", lines: ["Oil your scalp.", "Not your", "lengths."] },
      { s: 2.5, e: 4.3, theme: "cream", layout: "image", image: "root-ritual-oil.webp", lines: ["The 5 minute way."] },
      { s: 4.3, e: 7.5, theme: "amla", layout: "text", lines: ["Warm 1 teaspoon", "in your palms."] },
      { s: 7.5, e: 9.8, theme: "cream", layout: "text", lines: ["Split hair into", "4 sections."] },
      { s: 9.8, e: 12.0, theme: "forest", layout: "text", lines: ["Fingertips.", "Never nails."] },
      { s: 12.0, e: 15.6, theme: "amla", layout: "text", lines: ["Slow circles.", "5 minutes."] },
      { s: 15.6, e: 18.5, theme: "cream", layout: "text", lines: ["Leave 1 hour,", "or overnight."] },
      { s: 18.5, e: 21.4, theme: "forest", layout: "text", lines: ["1 shampoo.", "Not 2."] },
      { s: 21.4, e: 24.0, theme: "cream", layout: "text", lines: ["2 or 3", "times a week."] },
      { s: 24.0, e: 26.1, theme: "terracotta", layout: "text", lines: ["Save this for", "wash day."] },
      { s: 26.1, e: 28.3, theme: "forest", layout: "text", handle: true, lines: ["Scalp first.", "Lengths wait."] },
    ],
  },
];
