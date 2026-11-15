# Keshvardhan — storefront, checkout and admin

Direct-to-consumer store for **Keshvardhan** (edible Daily Root Powder + Root Ritual Oil), built on Next.js 16 with Cache Components, PostgreSQL on Neon, Razorpay hosted checkout, Resend email, Shiprocket shipping and a procedural React Three Fiber 3D hero.

Business context lives in `docs/Hair Care Brand BRD.pdf`. The pre-launch audit is in `docs/pre-launch-audit.md`.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, Partial Prefetching, Turbopack), React 19, TypeScript |
| Styling / motion | Tailwind CSS v4, `motion`, CSS scroll-reveal that stays visible without JS |
| 3D | three + @react-three/fiber + drei (procedural models, no CDN assets) |
| Data | PostgreSQL on Neon, Drizzle ORM, SQL migrations in `drizzle/` |
| Payments | Razorpay Orders API + Standard Checkout + signed webhooks (dev simulator when keys are absent) |
| Email | Resend (console dry-run when no key) |
| Shipping | Shiprocket API (skipped when no credentials; manual AWB entry in admin) |
| Analytics | GA4 via `@next/third-parties` (only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set) |
| Tests | Vitest unit tests, Playwright audit scripts |

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in DATABASE_URL at minimum
npm run db:migrate              # applies drizzle/*.sql to the database
npm run db:seed                 # creates stock rows (2,000 units per SKU)
npm run dev                     # http://localhost:3000
```

Without Razorpay keys the checkout runs in **simulated mode** in development (never in production). Without a Resend key, emails are printed to the server console. Without Shiprocket credentials, shipments are skipped and can be entered manually in `/admin`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server, production build, production server |
| `npm run check` | typecheck + lint + unit tests |
| `npm run typecheck`, `npm run lint`, `npm test` | individually |
| `npm run db:generate` | generate a migration from `src/lib/db/schema.ts` |
| `npm run db:migrate` | apply migrations |
| `npm run db:seed` | seed product stock |
| `npm run images` | regenerate placeholder product imagery (WebP) and brand icons |
| `node scripts/audit-pages.mjs [base] [shotDir]` | headless-browser SEO/a11y audit of every public page |
| `bash scripts/audit-http.sh [base]` | status codes, redirects, headers, APIs and the full checkout → order → eBook flow |
| `ADMIN_PASSWORD=… node scripts/audit-admin.mjs [base]` | admin login, dashboard, orders, logout |

## Environment variables

See `.env.example`. All secrets are server-only; the only public variables are `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## Project layout

```
src/app/                 routes (pages, API route handlers, sitemap, robots, manifest, OG images)
src/app/admin/           staff area: /admin/login (public) and (authed)/ pages behind a signed cookie
src/components/          UI (layout, home sections, product, cart, checkout, three, admin)
src/lib/                 domain logic: products catalogue, money, orders, razorpay, email, ebook (PDF), shiprocket, seo, crypto
src/lib/db/              Drizzle schema + client
src/proxy.ts             404 for unknown product slugs, admin cookie guard
drizzle/                 SQL migrations
scripts/                 seed, image generation, audit scripts
tests/                   Vitest unit tests
docs/                    BRD and the pre-launch audit
```

## How the order flow works

1. `POST /api/checkout` re-prices the cart from the catalogue, checks stock, creates a `pending` order and either confirms it (COD), returns a Razorpay order (online) or a simulated-payment token (dev).
2. The browser opens Razorpay Checkout; on success it calls `POST /api/razorpay/verify`, which checks the HMAC signature and marks the order paid.
3. Razorpay's webhook (`POST /api/webhooks/razorpay`) performs the same transition independently; `markOrderPaid` is idempotent, so either can arrive first.
4. `fulfilOrder` sends the confirmation email with a signed, 7-day eBook link and pushes the shipment to Shiprocket. The customer's order page (`/order/[id]?k=…`) is protected by a derived access key.

## Deployment notes

- Set `NEXT_PUBLIC_SITE_URL` to the production origin before building; canonical URLs, sitemap and OG images derive from it.
- Register the Razorpay webhook at `https://<domain>/api/webhooks/razorpay` for `payment.captured`, `payment.failed`, `order.paid`, `refund.processed` with the same secret as `RAZORPAY_WEBHOOK_SECRET`.
- Register the Shiprocket webhook at `/api/webhooks/shiprocket` with `SHIPROCKET_WEBHOOK_TOKEN` as the `x-api-key`.
- Replace the placeholder images in `public/images/products/` with photography of the same names and sizes; replace placeholder phone and address in `src/lib/site.ts`.
