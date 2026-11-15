/**
 * Browser check of the staff admin: login guard, login, dashboard, orders,
 * order detail, inventory and logout. Usage:
 *   ADMIN_PASSWORD=... node scripts/audit-admin.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3000";
const password = process.env.ADMIN_PASSWORD;
if (!password) throw new Error("Set ADMIN_PASSWORD in the environment");

const browser = await chromium.launch();
const page = await browser.newPage();
const log = (...a) => console.log(...a);

await page.goto(`${base}/admin/orders`);
log("guard redirect ->", page.url());

await page.fill("#password", "wrong-password");
await page.click("form button[type=submit]");
await page.waitForSelector("form [role=alert]");
log("wrong password ->", await page.textContent("form [role=alert]"));

await page.fill("#password", password);
await page.click("form button[type=submit]");
await page.waitForURL(/\/admin\/orders/);
log("login ->", page.url());
await page.waitForSelector("tbody tr");
log("orders table rows:", await page.locator("tbody tr").count());

const first = page.locator("tbody tr a").first();
const orderNo = await first.textContent();
await first.click();
await page.waitForSelector("h1");
log("order detail:", (await page.textContent("h1"))?.trim(), "=", orderNo);
log("has status form:", await page.locator("select[name=status]").count());

await page.goto(`${base}/admin`);
await page.waitForSelector("h1");
log("dashboard h1:", (await page.textContent("h1"))?.trim(), "| stat cards:", await page.locator("dl, .card").count());

await page.goto(`${base}/admin/inventory`);
log("inventory forms:", await page.locator("form input[name=stock]").count());

await page.click("text=Log out");
await page.waitForURL(/\/admin\/login/);
log("logout ->", page.url());
await page.goto(`${base}/admin`);
log("after logout /admin ->", page.url());
await browser.close();
