/**
 * Renders the Reel specs in reels.mjs to 1080x1920 H.264 MP4 (30 fps, silent) plus a cover JPG.
 * Frames are captured deterministically: every animation is paused and set to an exact time,
 * so playback is smooth regardless of machine speed.
 *
 * Usage (from the project root):
 *   node social/instagram/tools/render-reels.mjs           # all reels
 *   node social/instagram/tools/render-reels.mjs reel-2    # one reel
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { C, HANDLE, esc, fontLink, productImage, themeVars } from "./brand.mjs";
import { reels } from "./reels.mjs";

const FPS = 30;
const W = 1080;
const H = 1920;
const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../reels");
mkdirSync(outDir, { recursive: true });

function cardFont(lines) {
  // Fraunces at display size averages ~0.36em per character; fit the longest line to the 790 px safe width.
  const maxLen = Math.max(...lines.map((l) => l.length), 1);
  return Math.max(100, Math.min(210, Math.floor(2050 / maxLen)));
}

function cardHtml(card, i) {
  const t = themeVars(card.theme);
  const size = card.layout === "image" ? 104 : cardFont(card.lines ?? [""]);
  const text = (card.lines ?? []).map((l) => `<div class="line" style="font-size:${size}px">${esc(l)}</div>`).join("");
  let inner = "";
  if (card.layout === "image") {
    inner = `<div class="imgwrap"><img class="kb" src="${productImage(card.image)}" alt=""></div><div class="lines">${text}</div>`;
  } else if (card.layout === "bignum") {
    inner = `<div class="big" style="font-size:${card.big.length <= 6 ? 230 : 168}px">${esc(card.big)}</div><div class="lines sub">${text}</div>`;
  } else if (card.layout === "list") {
    inner = `<div class="rows">${card.rows
      .map(([a, b]) => `<div class="row"><span>${esc(a)}</span><b>${esc(b)}</b></div>`)
      .join("")}</div>`;
  } else {
    inner = `<div class="lines">${text}</div>`;
  }
  const handle = card.handle ? `<div class="handle">${esc(HANDLE)}</div>` : "";
  return `<section class="card" id="c${i}" style="${t};z-index:${i + 1}"><div class="safe"><div class="content">${inner}</div>${handle}</div></section>`;
}

function pageHtml(spec) {
  return `<!doctype html><html><head><meta charset="utf-8">${fontLink}
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${C.cream}}
body{font-family:Manrope,Arial,sans-serif;position:relative}
.card{position:absolute;inset:0;background:var(--bg);color:var(--fg);opacity:0}
/* Safe zone: x 60..850, y 230..1440 */
.safe{position:absolute;left:60px;top:230px;width:790px;height:1210px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}
.content{width:100%}
.line{font-family:Fraunces,Georgia,serif;font-weight:600;line-height:1.04;letter-spacing:-0.01em;color:var(--fg);white-space:nowrap}
.lines{display:flex;flex-direction:column;gap:6px}
.big{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:230px;line-height:1;color:var(--accent);margin-bottom:24px;letter-spacing:-0.02em}
.sub .line{font-size:96px}
.imgwrap{width:640px;height:640px;border-radius:56px;overflow:hidden;margin-bottom:56px;box-shadow:0 30px 80px rgba(0,0,0,0.18)}
.imgwrap img{width:100%;height:100%;object-fit:cover;display:block}
.rows{display:flex;flex-direction:column;gap:28px;width:100%}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:24px;background:var(--chip);border-radius:40px;padding:38px 44px}
.row span{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:64px;line-height:1.05;color:var(--fg)}
.row b{font-weight:800;font-size:60px;color:var(--accent);white-space:nowrap}
.handle{position:absolute;left:0;bottom:0;font-weight:800;font-size:44px;letter-spacing:.04em;color:var(--accent)}
</style></head><body>
${spec.cards.map(cardHtml).join("\n")}
</body></html>`;
}

async function setTime(page, t) {
  await page.evaluate((ms) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = ms;
    }
  }, t * 1000);
}

async function renderReel(browser, spec) {
  const total = spec.cards.at(-1).e;
  const frames = Math.round(total * FPS);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const htmlPath = path.resolve(here, "../work", `${spec.id}.html`);
  mkdirSync(path.dirname(htmlPath), { recursive: true });
  writeFileSync(htmlPath, pageHtml(spec));
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() => document.fonts.check('600 100px "Fraunces"') && document.fonts.check('800 40px "Manrope"'));
  if (!fontsOk) console.warn(`  ! ${spec.id}: web fonts did not load, falling back to Georgia/Arial`);

  // Build animations with exact timing (Web Animations API).
  await page.evaluate((cards) => {
    cards.forEach((card, i) => {
      const el = document.getElementById(`c${i}`);
      const first = i === 0;
      const dur = (card.e - card.s) * 1000;
      el.animate(
        first ? [{ opacity: 1 }, { opacity: 1 }] : [{ opacity: 0 }, { opacity: 1 }],
        { delay: card.s * 1000, duration: first ? dur : 1, fill: "both", easing: "linear" },
      );
      const content = el.querySelector(".content");
      if (card.layout === "list") {
        // rows pop in one by one, matching the tick sound for each row
        el.querySelectorAll(".row").forEach((row, r) => {
          row.animate(
            [{ transform: "translateY(30px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
            { delay: (card.s + 0.12 + r * 0.18) * 1000, duration: 320, fill: "both", easing: "cubic-bezier(0.22,1,0.36,1)" },
          );
        });
      } else if (!first) {
        content.animate(
          [{ transform: "translateY(44px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { delay: card.s * 1000, duration: 420, fill: "both", easing: "cubic-bezier(0.22,1,0.36,1)" },
        );
      }
      const kb = el.querySelector(".kb");
      if (kb) {
        kb.animate([{ transform: "scale(1)" }, { transform: "scale(1.09)" }], {
          delay: card.s * 1000,
          duration: dur,
          fill: "both",
          easing: "linear",
        });
      }
      const handle = el.querySelector(".handle");
      if (handle) {
        handle.animate([{ opacity: 0 }, { opacity: 1 }], { delay: (card.s + 0.35) * 1000, duration: 300, fill: "both" });
      }
    });
  }, spec.cards);

  if (process.argv.includes("--preview")) {
    // One still per card (taken 0.7 s in, after the entrance animation), tiled into a contact sheet.
    const prev = path.resolve(here, "../work/preview");
    mkdirSync(prev, { recursive: true });
    for (let i = 0; i < spec.cards.length; i++) {
      const c = spec.cards[i];
      await setTime(page, Math.min(c.s + 0.7, c.e - 0.05));
      await page.screenshot({ path: path.join(prev, `${spec.id}-${String(i + 1).padStart(2, "0")}.jpg`), type: "jpeg", quality: 85 });
    }
    await page.close();
    console.log(`  preview stills written for ${spec.id}`);
    return;
  }

  const mp4 = path.join(outDir, `${spec.out}-silent.mp4`);
  const ff = spawn(
    "ffmpeg",
    ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-vcodec", "mjpeg", "-i", "-",
     "-vf", "scale=in_range=full:out_range=limited,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-color_range", "tv", "-r", String(FPS),
     "-movflags", "+faststart", "-an", mp4],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise((res, rej) => {
    ff.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`))));
    ff.on("error", rej);
  });

  for (let f = 0; f < frames; f++) {
    await setTime(page, f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (f === 0) writeFileSync(path.join(outDir, `${spec.out}-cover.jpg`), buf);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) process.stdout.write(`  ${spec.id}: frame ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await done;
  await page.close();
  console.log(`  done ${spec.out}-silent.mp4 (${total.toFixed(1)}s, ${frames} frames). Add sound with render-audio.mjs`);
}

const only = process.argv[2];
const browser = await chromium.launch();
for (const spec of reels.filter((r) => !only || r.id === only)) {
  console.log(`Rendering ${spec.id} ...`);
  await renderReel(browser, spec);
}
await browser.close();
