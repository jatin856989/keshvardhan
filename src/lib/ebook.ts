import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { signToken, verifyToken } from "./crypto";
import { absoluteUrl, siteConfig } from "./site";

const EBOOK_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function createEbookToken(orderId: string): string {
  return signToken(`ebook:${orderId}`, EBOOK_TTL_SECONDS);
}

export function ebookUrlForOrder(orderId: string): string {
  return absoluteUrl(`/api/ebook?t=${encodeURIComponent(createEbookToken(orderId))}`);
}

export function verifyEbookToken(token: string): string | null {
  const parsed = verifyToken(token);
  if (!parsed || !parsed.payload.startsWith("ebook:")) return null;
  return parsed.payload.slice("ebook:".length);
}

/* ------------------------------------------------------------------ */
/* Guide content                                                       */
/* ------------------------------------------------------------------ */

interface Chapter {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const guideChapters: Chapter[] = [
  {
    title: "Welcome to the routine",
    paragraphs: [
      "Hair is built from the inside and protected from the outside. For the next 30 days you will do two small things: eat a spoon of Daily Root Powder every morning, and oil your scalp with Root Ritual Oil two or three times a week.",
      "That is the whole routine. This guide exists to make it easy to keep, to explain what each plant is doing, and to help you notice the changes, which arrive slowly and then all at once.",
    ],
  },
  {
    title: "Week 1: build the habit",
    paragraphs: [
      "Pick a fixed moment for the powder: with your first glass of water, in your morning milk, or folded into breakfast curd. Habits attach to moments, not to intentions.",
      "Do your first oiling on day 2. Warm a teaspoon between your palms, part the hair in rows and press the oil into the scalp with your fingertips. Five minutes of slow circles. Leave for an hour or overnight, then shampoo once.",
    ],
    bullets: [
      "Powder: 1 level teaspoon (5 g) daily",
      "Oil: days 2, 5 and 7 this week",
      "Photograph your parting and your hairbrush on day 1 for the tracker",
    ],
  },
  {
    title: "What is in the jar, and why",
    paragraphs: [
      "Amla brings vitamin C and has been the first hair herb in Indian kitchens for centuries. Bhringraj is the classic scalp tonic of Ayurveda. Curry leaf and moringa carry antioxidants, iron and protein. Fenugreek and pumpkin seed add protein and zinc, and black sesame contributes healthy fats and a nutty taste.",
      "Every quantity is printed on the label. There are no isolated vitamins and no sugar, because the point is a food you can take every day for years, not a short course.",
    ],
  },
  {
    title: "Six ways to take the powder",
    paragraphs: ["If warm water bores you after a week, try these. Each uses one 5 g serving."],
    bullets: [
      "Golden milk: whisk into 150 ml warm milk with a pinch of cardamom",
      "Morning curd: fold into 3 tablespoons of curd with a drizzle of honey",
      "Green smoothie: blend with banana, spinach and coconut water",
      "Chutney: mix into coconut chutney for dosa or idli",
      "Energy laddoo: bind 30 g with dates and roasted peanuts, makes six",
      "Buttermilk: stir into chaas with roasted cumin and black salt",
    ],
  },
  {
    title: "The oiling technique",
    paragraphs: [
      "Oil the scalp, not the lengths. Section the hair into four, then work row by row with the pads of your fingers, never nails. Pressure should feel like a firm hug for the scalp, not a scratch.",
      "Leave it for at least an hour. Overnight is fine with an old pillowcase. Wash with one round of a gentle shampoo; a second round strips the benefit.",
    ],
    bullets: [
      "Teaspoon of oil, warmed between palms",
      "Five minutes of slow circles across the whole scalp",
      "Two to three times a week; more does not help",
    ],
  },
  {
    title: "Weeks 2 to 4: what to notice",
    paragraphs: [
      "Hair grows in a slow cycle, so the first changes are usually in the scalp and in shedding, not in length. By week two many people notice less itch and flaking. By week three, fewer strands in the brush. By week four, new baby hairs at the hairline and a softer texture.",
      "Use the tracker on the last page every Sunday. A photo of the parting and a count of strands in the brush tells you more than a mirror does.",
    ],
  },
  {
    title: "Hard water, heat and stress",
    paragraphs: [
      "Most Indian cities have hard water, which leaves minerals on the hair. A final rinse with a litre of filtered water, or a diluted apple cider vinegar rinse once a week, helps the oil do its job.",
      "Keep heat styling under 180 degrees and never on damp hair. Sleep matters more than any product: hair is one of the first places the body economises when rest is short.",
    ],
  },
  {
    title: "When to see a dermatologist",
    paragraphs: [
      "This routine supports healthy hair; it does not treat medical conditions. See a dermatologist if you notice sudden patchy loss, scalp pain or sores, or shedding that continues heavily beyond three months. Thyroid, iron and vitamin D levels are worth checking with a doctor if hair loss is new.",
    ],
  },
  {
    title: "Your 30-day tracker",
    paragraphs: [
      "Print this page or copy it into your notes. Each Sunday record the date, the number of strands in your brush after 20 strokes, how your scalp feels from 1 to 5, and one line about what you notice.",
    ],
    bullets: ["Day 1", "Day 7", "Day 14", "Day 21", "Day 28"],
  },
];

/* ------------------------------------------------------------------ */
/* PDF rendering                                                       */
/* ------------------------------------------------------------------ */

let cachedPdf: Uint8Array | null = null;

const PAGE_W = 595.28; // A4 portrait in points
const PAGE_H = 841.89;
const MARGIN = 56;

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = current ? `${current} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildGuidePdf(): Promise<Uint8Array> {
  if (cachedPdf) return cachedPdf;
  const doc = await PDFDocument.create();
  doc.setTitle(`${siteConfig.name}: The 30-Day Inside-Out Hair Guide`);
  doc.setAuthor(siteConfig.name);
  doc.setSubject("A 30-day routine for healthier hair with Daily Root Powder and Root Ritual Oil");
  doc.setLanguage("en-IN");

  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  const forest = rgb(0.12, 0.24, 0.17);
  const cream = rgb(0.965, 0.945, 0.905);
  const terracotta = rgb(0.77, 0.4, 0.23);
  const ink = rgb(0.1, 0.1, 0.1);
  const muted = rgb(0.38, 0.38, 0.38);

  // Cover
  const cover = doc.addPage([PAGE_W, PAGE_H]);
  cover.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: forest });
  cover.drawCircle({ x: PAGE_W * 0.72, y: PAGE_H * 0.68, size: 150, color: rgb(0.5, 0.65, 0.31), opacity: 0.25 });
  cover.drawCircle({ x: PAGE_W * 0.3, y: PAGE_H * 0.3, size: 110, color: terracotta, opacity: 0.25 });
  cover.drawText(siteConfig.name.toUpperCase(), { x: MARGIN, y: PAGE_H - 110, size: 14, font: sans, color: cream, opacity: 0.8 });
  const titleLines = ["The 30-Day", "Inside-Out", "Hair Guide"];
  titleLines.forEach((t, i) => {
    cover.drawText(t, { x: MARGIN, y: PAGE_H - 220 - i * 58, size: 50, font: serifBold, color: cream });
  });
  cover.drawText("Eat it. Oil it. Repeat.", { x: MARGIN, y: PAGE_H - 440, size: 20, font: serif, color: cream });
  wrap(
    "A month of small, repeatable steps with Daily Root Powder and Root Ritual Oil: what to do, what each plant does, and how to notice the change.",
    sans,
    12,
    PAGE_W - MARGIN * 2 - 120,
  ).forEach((l, i) => cover.drawText(l, { x: MARGIN, y: PAGE_H - 490 - i * 17, size: 12, font: sans, color: cream, opacity: 0.9 }));
  cover.drawText(siteConfig.url.replace(/^https?:\/\//, ""), { x: MARGIN, y: 60, size: 11, font: sans, color: cream, opacity: 0.7 });

  // Chapters
  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;
  let pageNo = 2;
  const footer = (p: PDFPage, n: number) => {
    p.drawText(`${siteConfig.name} · The 30-Day Guide`, { x: MARGIN, y: 32, size: 9, font: sans, color: muted });
    p.drawText(String(n), { x: PAGE_W - MARGIN - 10, y: 32, size: 9, font: sans, color: muted });
  };
  footer(page, pageNo);
  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    pageNo += 1;
    footer(page, pageNo);
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed: number) => {
    if (y - needed < MARGIN + 30) newPage();
  };

  guideChapters.forEach((ch, idx) => {
    if (idx > 0) {
      newPage();
    }
    page.drawRectangle({ x: MARGIN, y: y - 6, width: 36, height: 4, color: terracotta });
    y -= 28;
    page.drawText(`Chapter ${idx + 1}`, { x: MARGIN, y, size: 10, font: sans, color: muted });
    y -= 30;
    wrap(ch.title, serifBold, 26, PAGE_W - MARGIN * 2).forEach((l) => {
      page.drawText(l, { x: MARGIN, y, size: 26, font: serifBold, color: forest });
      y -= 32;
    });
    y -= 8;
    for (const para of ch.paragraphs) {
      const lines = wrap(para, serif, 12.5, PAGE_W - MARGIN * 2);
      ensure(lines.length * 18 + 10);
      for (const l of lines) {
        page.drawText(l, { x: MARGIN, y, size: 12.5, font: serif, color: ink });
        y -= 18;
      }
      y -= 10;
    }
    if (ch.bullets) {
      for (const b of ch.bullets) {
        const lines = wrap(b, sans, 11.5, PAGE_W - MARGIN * 2 - 18);
        ensure(lines.length * 16 + 6);
        page.drawCircle({ x: MARGIN + 4, y: y + 4, size: 2.2, color: terracotta });
        lines.forEach((l, i) => {
          page.drawText(l, { x: MARGIN + 16, y, size: 11.5, font: sans, color: ink });
          y -= 16;
          if (i === lines.length - 1) y -= 4;
        });
      }
    }
  });

  // Tracker table on last chapter page
  ensure(200);
  y -= 10;
  const cols = ["Date", "Strands in brush", "Scalp feel (1-5)", "Notes"];
  const colX = [MARGIN, MARGIN + 110, MARGIN + 250, MARGIN + 360];
  cols.forEach((c, i) => page.drawText(c, { x: colX[i], y, size: 10, font: sans, color: muted }));
  y -= 8;
  for (let r = 0; r < 5; r++) {
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.6, color: rgb(0.8, 0.8, 0.8) });
    y -= 28;
  }
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.6, color: rgb(0.8, 0.8, 0.8) });

  const bytes = await doc.save();
  cachedPdf = bytes;
  return bytes;
}
