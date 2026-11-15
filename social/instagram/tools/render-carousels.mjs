/**
 * Renders the carousel specs in carousels.mjs to 1080x1350 PNG slides (Instagram 4:5).
 * Keeps all text at least 120 px from every edge so the grid crop never cuts it.
 *
 * Usage (from the project root):
 *   node social/instagram/tools/render-carousels.mjs            # all carousels
 *   node social/instagram/tools/render-carousels.mjs carousel-2 # one
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { HANDLE, esc, fontLink, productImage, themeVars } from "./brand.mjs";
import { carousels } from "./carousels.mjs";

const W = 1080;
const H = 1350;
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../carousels");
const workDir = path.resolve(here, "../work");
mkdirSync(workDir, { recursive: true });

function titleSize(t, base = 118) {
  const n = t.length;
  if (n <= 14) return base + 40;
  if (n <= 24) return base;
  if (n <= 34) return base - 20;
  return base - 34;
}

function slideHtml(s, i, total) {
  const t = themeVars(s.theme);
  const num = `${i + 1}/${total}`;
  const foot = `<div class="foot"><span>${esc(HANDLE)}</span><span>${num}</span></div>`;
  let body = "";
  if (s.kind === "cover") {
    body = `
      <div class="blob b1"></div><div class="blob b2"></div>
      <div class="kicker">${esc(s.kicker)}</div>
      <div class="title" style="font-size:${titleSize(s.title, 124)}px">${esc(s.title)}</div>
      <div class="body" style="margin-top:36px">${esc(s.body)}</div>
      ${s.image ? `<img class="cover-img" src="${productImage(s.image)}" alt="">` : ""}`;
  } else if (s.kind === "plant") {
    body = `
      <div class="kicker">${esc(s.n)} &middot; amount per 5 g</div>
      <div class="big" style="font-size:${s.amount.length > 6 ? 190 : 250}px">${esc(s.amount)}</div>
      <div class="title" style="font-size:112px">${esc(s.name)}</div>
      <div class="body">${esc(s.role)}</div>`;
  } else if (s.kind === "list") {
    body = `
      <div class="kicker">${esc(s.kicker)}</div>
      <div class="title" style="font-size:112px;margin-bottom:44px">${esc(s.title)}</div>
      <div class="items">${s.items
        .map(([a, b]) => `<div class="item"><b>${esc(a)}</b><span>${esc(b)}</span></div>`)
        .join("")}</div>`;
  } else if (s.kind === "cta") {
    body = `
      <div class="blob b1"></div>
      <div class="title" style="font-size:${titleSize(s.title, 124)}px">${esc(s.title)}</div>
      <div class="body" style="margin-top:44px;font-weight:700">${esc(s.body)}</div>
      ${s.note ? `<div class="note">${esc(s.note)}</div>` : ""}`;
  } else {
    body = `
      <div class="kicker">${esc(s.kicker)}</div>
      <div class="title" style="font-size:${titleSize(s.title, 124)}px">${esc(s.title)}</div>
      <div class="body">${esc(s.body)}</div>`;
  }
  return `<section class="slide ${s.kind}" style="${t}">${body}${foot}</section>`;
}

function pageHtml(spec) {
  return `<!doctype html><html><head><meta charset="utf-8">${fontLink}
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#888;font-family:Manrope,Arial,sans-serif}
.slide{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:var(--bg);color:var(--fg);padding:150px 120px 170px;display:flex;flex-direction:column;justify-content:center}
.slide.cover{justify-content:flex-start;padding-top:190px}
.kicker{font-weight:800;font-size:34px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:40px}
.title{font-family:Fraunces,Georgia,serif;font-weight:600;line-height:1.04;letter-spacing:-.01em;color:var(--fg);max-width:840px}
.body{font-weight:500;font-size:46px;line-height:1.38;color:var(--fg);opacity:.92;margin-top:48px;max-width:820px}
.big{white-space:nowrap;font-family:Fraunces,Georgia,serif;font-weight:600;font-size:250px;line-height:1;color:var(--accent);letter-spacing:-.02em;margin-bottom:12px}
.note{font-weight:500;font-size:34px;line-height:1.4;margin-top:64px;max-width:800px;opacity:.9}
.items{display:flex;flex-direction:column;gap:26px;max-width:840px}
.item{background:var(--chip);border-radius:36px;padding:34px 40px}
.item b{display:block;font-weight:800;font-size:38px;color:var(--accent);margin-bottom:8px}
.item span{display:block;font-weight:500;font-size:38px;line-height:1.3;color:var(--fg)}
.foot{position:absolute;left:120px;right:120px;bottom:64px;display:flex;justify-content:space-between;font-weight:700;font-size:32px;color:var(--fg);opacity:.7}
.blob{position:absolute;border-radius:50%;background:var(--accent);opacity:.14}
.b1{width:620px;height:620px;right:-200px;top:-180px}
.b2{width:420px;height:420px;left:-160px;bottom:-120px}
.cover-img{position:absolute;right:120px;bottom:150px;width:380px;height:380px;border-radius:56px;object-fit:cover;box-shadow:0 30px 70px rgba(0,0,0,.25)}
</style></head><body>
${spec.slides.map((s, i) => slideHtml(s, i, spec.slides.length)).join("\n")}
</body></html>`;
}

const only = process.argv[2];
const browser = await chromium.launch();
for (const spec of carousels.filter((c) => !only || c.id === only)) {
  console.log(`Rendering ${spec.id} (${spec.slides.length} slides) ...`);
  const htmlPath = path.join(workDir, `${spec.id}.html`);
  writeFileSync(htmlPath, pageHtml(spec));
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const ok = await page.evaluate(() => document.fonts.check('600 100px "Fraunces"') && document.fonts.check('800 40px "Manrope"'));
  if (!ok) console.warn("  ! web fonts did not load, falling back to Georgia/Arial");
  const dir = path.join(root, spec.out);
  mkdirSync(dir, { recursive: true });
  const slides = page.locator(".slide");
  const n = await slides.count();
  for (let i = 0; i < n; i++) {
    await slides.nth(i).screenshot({ path: path.join(dir, `slide-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await page.close();
  console.log(`  wrote ${n} slides to carousels/${spec.out}/`);
}
await browser.close();
