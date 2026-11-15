// Shared brand tokens for the Instagram renderers. Edit HANDLE if the real account name differs.
export const HANDLE = "@keshvardhan";

export const C = {
  cream: "#F6F1E7",
  forest: "#1F3D2B",
  terracotta: "#C4653A",
  amla: "#7FA650",
  ink: "#1A1A1A",
  stone: "#6B665C",
};

export const themes = {
  forest: { bg: C.forest, fg: C.cream, accent: C.amla, muted: "rgba(246,241,231,0.72)", chip: "rgba(246,241,231,0.12)" },
  cream: { bg: C.cream, fg: C.forest, accent: C.terracotta, muted: C.stone, chip: "rgba(31,61,43,0.08)" },
  terracotta: { bg: C.terracotta, fg: "#FFFFFF", accent: C.cream, muted: "rgba(255,255,255,0.85)", chip: "rgba(255,255,255,0.16)" },
  amla: { bg: "#E7EFDB", fg: C.forest, accent: C.terracotta, muted: C.stone, chip: "rgba(31,61,43,0.08)" },
};

export const fontLink = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@500;700;800&display=swap" rel="stylesheet">`;

export function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** file:// URL of a product image in the website's public folder. */
export function productImage(name) {
  return new URL(`../../../public/images/products/${name}`, import.meta.url).href;
}

export function themeVars(t) {
  const th = themes[t] ?? themes.cream;
  return `--bg:${th.bg};--fg:${th.fg};--accent:${th.accent};--muted:${th.muted};--chip:${th.chip};`;
}
