/**
 * Generates product and brand imagery as WebP from inline SVG using sharp.
 * Placeholder art until studio photography is available; swap the files in
 * public/images/products with real photos of the same names and sizes.
 *
 * Usage: node scripts/generate-images.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("public/images/products");
await mkdir(out, { recursive: true });

const cream = "#F6F1E7";
const forest = "#1F3D2B";
const amla = "#7FA650";
const terracotta = "#C4653A";
const gold = "#C9A227";

const bg = (accent) => `
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="${cream}"/>
      <stop offset="100%" stop-color="#E9E1CF"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" x2="1">
      <stop offset="0%" stop-color="#5a3a1c"/>
      <stop offset="35%" stop-color="#9c6a35"/>
      <stop offset="55%" stop-color="#c58f4e"/>
      <stop offset="100%" stop-color="#5a3a1c"/>
    </linearGradient>
    <linearGradient id="jar" x1="0" x2="1">
      <stop offset="0%" stop-color="#e9e2d2"/>
      <stop offset="40%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d8d0bd"/>
    </linearGradient>
    <linearGradient id="powder" x1="0" x2="1">
      <stop offset="0%" stop-color="#5f8a3a"/>
      <stop offset="50%" stop-color="${amla}"/>
      <stop offset="100%" stop-color="#5f8a3a"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
  </defs>
  <rect width="1200" height="1200" fill="url(#g)"/>
  <circle cx="900" cy="260" r="260" fill="${accent}" opacity="0.10"/>
  <circle cx="240" cy="980" r="220" fill="${forest}" opacity="0.06"/>
`;

const jar = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="300" rx="190" ry="34" fill="${forest}" opacity="0.18" filter="url(#shadow)"/>
    <rect x="-160" y="-260" width="320" height="520" rx="60" fill="url(#jar)" stroke="#cfc6b2" stroke-width="3"/>
    <rect x="-150" y="-330" width="300" height="110" rx="28" fill="${forest}"/>
    <rect x="-150" y="-300" width="300" height="12" fill="#2b5a3f" opacity="0.6"/>
    <rect x="-118" y="-150" width="236" height="300" rx="18" fill="${cream}" stroke="#e4dccb" stroke-width="2"/>
    <text x="0" y="-70" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${forest}">Keshvardhan</text>
    <rect x="-40" y="-52" width="80" height="4" fill="${terracotta}"/>
    <text x="0" y="10" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${forest}">Daily Root</text>
    <text x="0" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${forest}">Powder</text>
    <text x="0" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="4" fill="${terracotta}">150 g · 30 SERVINGS</text>
    <path d="M-150 130 q 150 -40 300 0 v 60 h -300 z" fill="${amla}" opacity="0.15"/>
  </g>`;

const bottle = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="330" rx="130" ry="26" fill="${forest}" opacity="0.18" filter="url(#shadow)"/>
    <rect x="-28" y="-420" width="56" height="90" rx="10" fill="#111"/>
    <rect x="-40" y="-350" width="80" height="40" rx="6" fill="#222"/>
    <rect x="-22" y="-330" width="44" height="150" rx="6" fill="#c58f4e" opacity="0.7"/>
    <path d="M-60 -300 h120 v40 q 60 40 60 120 v 380 q0 60 -60 60 h-120 q-60 0 -60 -60 v-380 q0 -80 60 -120z" fill="url(#glass)"/>
    <rect x="-70" y="-60" width="140" height="190" rx="12" fill="${cream}" opacity="0.95"/>
    <text x="0" y="-10" text-anchor="middle" font-family="Georgia, serif" font-size="19" fill="${forest}">Keshvardhan</text>
    <rect x="-26" y="2" width="52" height="3" fill="${terracotta}"/>
    <text x="0" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${forest}">Root Ritual</text>
    <text x="0" y="74" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="${forest}">Oil</text>
    <text x="0" y="110" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" letter-spacing="3" fill="${terracotta}">100 ml</text>
    <rect x="-56" y="-290" width="22" height="500" rx="11" fill="#fff" opacity="0.22"/>
  </g>`;

const leaf = (x, y, r, fill, s = 1) => `
  <g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M0 -120 C 70 -60 70 60 0 120 C -70 60 -70 -60 0 -120z" fill="${fill}"/>
    <path d="M0 -100 v200" stroke="#F6F1E7" stroke-width="4" opacity="0.6"/>
  </g>`;

const berry = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="#fff" opacity="0.35"/>`;

const svgs = {
  "daily-root-powder": `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg(amla)}
    ${leaf(960, 900, -30, amla, 0.9)}${leaf(1010, 820, 20, "#5f8a3a", 0.7)}
    ${berry(220, 300, 46, amla)}${berry(300, 250, 32, "#9cc06a")}
    ${jar(600, 600, 1.2)}
    <g transform="translate(260 880) rotate(-18)"><rect x="-120" y="-16" width="240" height="32" rx="16" fill="#b98a55"/><ellipse cx="130" cy="0" rx="62" ry="42" fill="#b98a55"/><ellipse cx="130" cy="-6" rx="46" ry="26" fill="url(#powder)"/></g>
  </svg>`,
  "root-ritual-oil": `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg(gold)}
    ${leaf(260, 300, -40, amla, 0.9)}${leaf(1000, 880, 30, "#5f8a3a", 0.8)}
    ${bottle(600, 620, 1.35)}
    <g transform="translate(300 900)"><ellipse cx="0" cy="0" rx="120" ry="60" fill="#fff"/><ellipse cx="0" cy="0" rx="92" ry="42" fill="#f1e7d5"/><path d="M-100 -20 a100 50 0 0 0 200 0" fill="#8a5a2b" opacity="0.5"/></g>
  </svg>`,
  "routine-bundle": `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg(terracotta)}
    ${leaf(150, 260, -35, amla, 0.8)}${leaf(1040, 300, 25, "#5f8a3a", 0.7)}
    ${jar(430, 640, 1.05)}
    ${bottle(830, 640, 1.2)}
    <rect x="140" y="1020" width="920" height="90" rx="20" fill="${forest}"/>
    <text x="600" y="1078" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${cream}">Eat it. Oil it. Repeat.</text>
  </svg>`,
  "powder-ingredients": `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg(amla)}
    ${berry(300, 320, 90, amla)}${berry(430, 260, 60, "#9cc06a")}${berry(250, 480, 50, "#9cc06a")}
    ${leaf(820, 300, -20, "#3f6b2a", 1.1)}${leaf(930, 420, 30, amla, 0.9)}${leaf(700, 420, -60, "#5f8a3a", 0.8)}
    <g transform="translate(300 850)">${[...Array(12)].map((_, i) => `<ellipse cx="${(i % 4) * 44 - 66}" cy="${Math.floor(i / 4) * 30 - 30}" rx="16" ry="9" fill="#1a1a1a" transform="rotate(${i * 23})"/>`).join("")}</g>
    <g transform="translate(850 850)"><circle r="150" fill="#c8405e"/><circle r="100" fill="#e05a7a"/><circle r="30" fill="${gold}"/></g>
    <g transform="translate(600 650)"><circle r="130" fill="#fff"/><circle r="100" fill="url(#powder)"/></g>
  </svg>`,
  "oil-ingredients": `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">${bg(gold)}
    <g transform="translate(330 420)"><circle r="190" fill="#6b4a2b"/><circle r="150" fill="#fff"/><circle r="110" fill="#f1e7d5"/><circle r="30" fill="#6b4a2b" opacity="0.4"/></g>
    ${leaf(880, 330, 15, "#3f6b2a", 1.2)}${leaf(960, 500, 70, amla, 0.9)}
    <g transform="translate(330 900)">${[...Array(30)].map((_, i) => `<ellipse cx="${(i % 6) * 36 - 90}" cy="${Math.floor(i / 6) * 28 - 56}" rx="12" ry="7" fill="#e8d8b8" stroke="#c9b58a" transform="rotate(${i * 17})"/>`).join("")}</g>
    ${bottle(760, 760, 0.95)}
    <g transform="translate(560 960) rotate(-30)"><rect x="-6" y="-160" width="12" height="320" rx="6" fill="#4b6b3a"/>${[...Array(10)].map((_, i) => `<ellipse cx="${i % 2 ? 22 : -22}" cy="${i * 30 - 140}" rx="26" ry="8" fill="#5f8a3a"/>`).join("")}</g>
  </svg>`,
};

for (const [name, svg] of Object.entries(svgs)) {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(1200, 1200).webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`));
  console.log("wrote", `${name}.webp`);
}

// Brand mark PNG (for Organization schema logo) and apple icon
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" rx="14" fill="${forest}"/>
  <path d="M32 10c-2 10-10 14-14 24 0 10 6 18 14 20 8-2 14-10 14-20-4-10-12-14-14-24z" fill="${amla}"/>
  <path d="M32 18c6 8 10 12 10 18 0 7-4 13-10 15 2-6 2-22 0-33z" fill="${gold}" opacity="0.9"/>
  <path d="M32 22v32" stroke="${cream}" stroke-width="2" stroke-linecap="round"/>
</svg>`;
await sharp(Buffer.from(mark)).png().toFile(path.resolve("public/images/logo-mark.png"));
await sharp(Buffer.from(mark)).resize(180, 180).png().toFile(path.resolve("src/app/apple-icon.png"));
await sharp(Buffer.from(mark)).resize(32, 32).png().toFile(path.resolve("src/app/icon.png"));
await writeFile(path.resolve("src/app/icon.svg"), mark.replace('width="512" height="512"', ""));
console.log("wrote logo-mark.png, apple-icon.png, icon.png, icon.svg");

// Social preview fallback for pages without a generated OG image
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${forest}"/>
  <circle cx="1000" cy="120" r="260" fill="${amla}" opacity="0.18"/>
  <circle cx="160" cy="560" r="200" fill="${terracotta}" opacity="0.25"/>
  <text x="80" y="140" font-family="Arial, sans-serif" font-size="26" letter-spacing="8" fill="${cream}" opacity="0.8">KESHVARDHAN</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="88" fill="${cream}">Nectar for your hair,</text>
  <text x="80" y="400" font-family="Georgia, serif" font-size="88" fill="${cream}">inside and out.</text>
  <text x="80" y="500" font-family="Arial, sans-serif" font-size="30" fill="${cream}" opacity="0.85">Edible Daily Root Powder + Root Ritual Oil · Made in India</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(path.resolve("public/images/og-default.png"));
console.log("wrote og-default.png");
