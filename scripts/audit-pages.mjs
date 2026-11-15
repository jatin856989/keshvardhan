/**
 * Live pre-launch audit helper. Loads each public page in headless Chromium
 * and reports what a crawler and a user actually get: status, title,
 * description, canonical, OG tags, H1 count, JSON-LD types, image alt
 * coverage, lazy-loading, console errors, and whether the WebGL hero mounted.
 *
 * Usage: node scripts/audit-pages.mjs [baseUrl] [screenshotDir]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const shotDir = process.argv[3] ?? "";
if (shotDir) await mkdir(shotDir, { recursive: true });

const pages = [
  "/",
  "/products",
  "/products/routine-bundle",
  "/products/daily-root-powder",
  "/products/root-ritual-oil",
  "/ingredients",
  "/guide",
  "/about",
  "/faq",
  "/contact",
  "/shipping-returns",
  "/privacy",
  "/terms",
  "/cart",
  "/checkout",
  "/this-page-does-not-exist",
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
const results = [];
const internalLinks = new Set();

for (const p of pages) {
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 160)}`));
  const res = await page.goto(base + p, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(2500); // let hydration finish before scrolling
  // Scroll through the page so scroll-reveal sections and lazy images trigger, like a real visit.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const meta = (n) => q(`meta[name="${n}"]`)?.content ?? q(`meta[property="${n}"]`)?.content ?? null;
    const imgs = Array.from(document.images);
    const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap((s) => {
      try {
        const j = JSON.parse(s.textContent || "null");
        return Array.isArray(j) ? j.map((x) => x["@type"]) : [j?.["@type"]];
      } catch {
        return ["INVALID_JSON"];
      }
    });
    return {
      title: document.title,
      description: meta("description"),
      canonical: q('link[rel="canonical"]')?.href ?? null,
      robots: meta("robots"),
      ogTitle: meta("og:title"),
      ogDescription: meta("og:description"),
      ogImage: meta("og:image"),
      ogUrl: meta("og:url"),
      twitterCard: meta("twitter:card"),
      h1s: Array.from(document.querySelectorAll("h1")).map((h) => h.textContent.trim().slice(0, 80)),
      headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((h) => h.tagName).join(" "),
      images: imgs.length,
      imagesMissingAlt: imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.currentSrc.split("/").pop()),
      imagesEmptyAlt: imgs.filter((i) => i.getAttribute("alt") === "").length,
      lazyImages: imgs.filter((i) => i.loading === "lazy").length,
      eagerImages: imgs.filter((i) => i.loading !== "lazy").map((i) => i.currentSrc.split("?")[0].split("/").pop()),
      webp: imgs.filter((i) => /\.webp|f=webp|image\/webp/.test(i.currentSrc)).length,
      jsonLd: ld,
      canvas: Boolean(document.querySelector("canvas")),
      links: Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")),
      textLength: document.body.innerText.length,
      breadcrumb: Boolean(document.querySelector('nav[aria-label="Breadcrumb"]')),
      gaScript: Boolean(document.querySelector('script[src*="googletagmanager"]')),
    };
  });
  for (const l of data.links) if (l && l.startsWith("/")) internalLinks.add(l.split("#")[0].split("?")[0]);
  if (shotDir) {
    await page.screenshot({ path: path.join(shotDir, `${p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "")}.png`), fullPage: p === "/" || p.startsWith("/products/") });
  }
  results.push({ path: p, status: res?.status(), errors, ...data });
  await page.close();
}

// Mobile screenshot of home for layout check
if (shotDir) {
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await m.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(shotDir, "home-mobile.png"), fullPage: true });
  await m.close();
}

// Crawl internal links for broken ones
const linkStatus = {};
for (const href of internalLinks) {
  const r = await context.request.get(base + href, { maxRedirects: 0 }).catch(() => null);
  linkStatus[href] = r ? r.status() : "ERR";
}

await browser.close();

for (const r of results) {
  console.log(`\n=== ${r.path} [${r.status}]`);
  console.log(`title: ${r.title}`);
  console.log(`description: ${r.description?.slice(0, 120)}`);
  console.log(`canonical: ${r.canonical} | robots: ${r.robots}`);
  console.log(`og: ${r.ogTitle ? "title" : "-"} ${r.ogDescription ? "desc" : "-"} ${r.ogImage ? "image" : "-"} ${r.ogUrl ? "url" : "-"} | twitter: ${r.twitterCard}`);
  console.log(`h1 (${r.h1s.length}): ${r.h1s.join(" | ")}`);
  console.log(`headings: ${r.headings.slice(0, 120)}`);
  console.log(`images: ${r.images} total, ${r.webp} webp, ${r.lazyImages} lazy, eager: ${r.eagerImages.join(",")} | missing alt: ${r.imagesMissingAlt.join(",") || "none"} | empty alt: ${r.imagesEmptyAlt}`);
  console.log(`json-ld: ${r.jsonLd.join(", ") || "none"} | breadcrumb nav: ${r.breadcrumb} | canvas: ${r.canvas} | ga: ${r.gaScript} | text chars: ${r.textLength}`);
  console.log(`console errors: ${r.errors.length ? r.errors.join(" || ") : "none"}`);
}
console.log("\n=== internal links");
for (const [h, s] of Object.entries(linkStatus)) if (s !== 200) console.log(`${s} ${h}`);
console.log(`checked ${Object.keys(linkStatus).length} unique internal links`);
