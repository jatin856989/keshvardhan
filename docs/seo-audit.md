# SEO audit with the Claude SEO skill

Audited 15 November 2026 with Claude SEO v2.6.2 (`AgriciDaniel/claude-seo`, MIT, pinned to its release tag). Inputs: the live site at `https://keshvardhan.vercel.app` before the fixes, then a production build of the fixed code. Tools used: the skill's 47-point on-page checker, transport and security-header checker, and e-commerce product-schema validator. Google Search Console, GA4 and CrUX field data were not available (no credentials yet), so nothing here is based on real search or traffic data.

## Before and after

| Severity | Finding | Pages | After |
| --- | --- | --- | --- |
| High | Canonical, og:url, sitemap, robots and schema all pointed at `localhost:3000` | 13 of 14 | Fixed |
| Medium | Title over 60 characters | 7 | Fixed |
| Medium | Meta description over 160 characters | 10 | Fixed |
| Medium | Images without width and height | 6 | Fixed |
| Medium | Thin content (shop, contact) | 2 | Fixed |
| Medium | First image lazy-loaded (about) | 1 | Fixed |
| Medium | Title under 30 characters (contact, privacy) | 2 | Fixed |
| Low | og:url differs from canonical (legal pages) | 3 | Fixed |

After the fixes the checker reports zero findings on all 13 public pages, and all 31 JSON-LD blocks are valid with no placeholders.

## What changed

- **Site URL**: `src/lib/site.ts` now uses `NEXT_PUBLIC_SITE_URL`, ignores a localhost value when running on Vercel, and falls back to Vercel's own production hostname. `/api/health` reports the resolved `siteUrl` so it can be checked on the live site.
- **Titles and descriptions**: every page rewritten to 30 to 60 characters (including the brand suffix) and 120 to 160 characters. Product pages use a short `metaDescription` separate from the long marketing description.
- **Images**: card, viewer, about and founder images carry explicit width and height. The about image is high priority.
- **Content**: a buying guide on the shop page and a "before you write" section on the contact page.
- **Open Graph**: privacy, terms and shipping pages now declare their own og:url, title, description and image.
- **llms.txt**: new `/llms.txt` summarising products and key pages for AI assistants, generated from the same catalogue so it cannot drift.

## Still open

| Item | Why it matters | Action |
| --- | --- | --- |
| Set `NEXT_PUBLIC_SITE_URL` in Vercel | The code fallback fixes the symptom; the variable is still the right source of truth, and must change to the custom domain later | Set to `https://keshvardhan.vercel.app` now, redeploy |
| Search Console and GA4 | No indexing or traffic data exists yet | Follow the setup steps, then re-run `/seo google` |
| Content-Security-Policy header | Missing; low severity | Add a report-only policy first (Razorpay, GA and inline JSON-LD need allow-listing) |
| www and non-www HTTPS | Not covered on a `vercel.app` address; only matters after a custom domain | Add both hostnames in Vercel when `keshvardhan.in` is connected |
| Product reviews | No AggregateRating schema yet (correctly omitted while there are no reviews) | Collect real reviews, then enable rating markup |
| Real photography | Generated art is a placeholder; image search and social previews benefit from real photos | Replace files in `public/images/products` |
| Backlinks and brand mentions | Not assessable without data providers | Optional later: Moz, Bing Webmaster or DataForSEO |

## How to re-run

With the skill installed, ask Claude Code `/seo audit https://keshvardhan.vercel.app`, or run the checker directly:

```bash
"$HOME/.claude/skills/seo/scripts/claude-seo" run page_checks.py --url https://keshvardhan.vercel.app --json
```
