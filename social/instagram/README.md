# Keshvardhan on Instagram: first content pack

Made with the `instagram-agent-skill` (ig-reel, ig-caption, ig-carousel, ig-human, ig-plan, ig-profile) and rendered with the scripts in `tools/`. **Nothing here is posted for you. You upload each file yourself.**

## What is in this folder

| Folder | Contents |
| --- | --- |
| `reels/` | 3 Reels as MP4 with original music and sound effects (1080x1920, about 30 s, still text-led so they work muted), a silent master of each (`-silent.mp4`) and a cover JPG |
| `audio/` | The soundtrack of each Reel as a WAV, normalised to -14 LUFS, in case you want to edit or reuse it |
| `carousels/` | 3 carousels as PNG slides (1080x1350, 4:5): 8, 9 and 10 slides |
| `captions/` | 6 ready-to-paste captions, all passing the caption linter |
| `scripts/` | Per-Reel sheet: scored hook, optional voiceover script, timed beat sheet, on-screen cards |
| `tools/` | Editable specs and renderers (`reels.mjs`, `carousels.mjs`) |

## The six posts

| # | Format | Title | Type | Hook score |
| --- | --- | --- | --- | --- |
| 1 | Reel | Oil is half the job | Opinion, the brand thesis | 81 strong |
| 2 | Reel | 1,200 mg | Proof: real label numbers | 81 strong |
| 3 | Reel | Scalp, not lengths | Teach: oiling technique | 81 strong |
| 4 | Carousel | Your first 30 days | Teach: week-by-week routine | n/a |
| 5 | Carousel | 6 ways to take 1 teaspoon | Teach: recipes | n/a |
| 6 | Carousel | 8 plants, 8 numbers | Proof: every ingredient amount | n/a |

## Two-week schedule (post about 7 to 9 pm IST)

Instagram rewards Reels for reaching new people and carousels for depth with existing followers. Never two of the same format back to back.

| Day | Post |
| --- | --- |
| Week 1 Monday | Reel 1, Oil is half the job |
| Week 1 Wednesday | Reel 2, 1,200 mg |
| Week 1 Friday | Reel 3, Scalp not lengths |
| Week 1 Sunday | Carousel 1, Your first 30 days |
| Week 2 Monday | Carousel 3, 8 plants 8 numbers |
| Week 2 Thursday | Carousel 2, 6 ways to take 1 teaspoon |
| Rest of week 2 | New Reels (ask for more once you have the first insights) |

Stories every day are worth more than another post. Re-share each post to Stories with one line, and answer questions you receive with a Story reply.

## How to post

**Reels**
1. Upload the MP4 from your phone (send it via cable, Drive or WhatsApp to yourself).
2. Cover: Edit cover, Add from camera roll, pick the matching `-cover.jpg`.
3. Audio: the files already contain original music and sound effects, so you can post them as they are. To use a trending sound instead, upload the `-silent.mp4` and add the sound in Instagram. To add your own voice, record it from `scripts/` and lower our music in a video editor first (use the WAV in `audio/`).
4. Paste the caption from `captions/`. Add alt text if prompted.
5. Share. Each caption has one ask ("save this"), so do not add a second.

**Carousels**
1. Select all slides of one carousel in order (`slide-01` is the cover).
2. Paste the caption and add the cover alt text below.
3. Share.

| Carousel | Alt text for the cover |
| --- | --- |
| Your first 30 days | Cover slide reading 'Your first 30 days', a week-by-week hair care routine with Keshvardhan Daily Root Powder and Root Ritual Oil. |
| 6 ways to take 1 teaspoon | Cover slide reading '6 ways to take 1 teaspoon' about Keshvardhan Daily Root Powder recipes. |
| 8 plants, 8 numbers | Cover slide reading '8 plants. 8 numbers.' listing every ingredient in Keshvardhan Daily Root Powder with its amount. |

## Audio (original, royalty-free)

I cannot download or license commercial music, and popular songs get muted or struck on business accounts, so every sound here is original: synthesised from scratch with no samples. You own it and can post, boost and monetise it freely.

| Reel | Tempo and key | Feel |
| --- | --- | --- |
| 1 Oil is half the job | 96 bpm, A minor | Warm and steady: tanpura-style drone, soft pad, plucked melody, light kick, clap and hats |
| 2 1,200 mg | 104 bpm, D minor | Brisker and precise, to carry the numbers |
| 3 Scalp not lengths | 88 bpm, G major | Calm and spa-like, to fit the how-to |

- **Structure:** a sparse intro under the hook, the full groove from the second card, a gentle resolve on the last card, then a fade out on the final frame.
- **Sound effects, locked to every cut:** a low thud on the hook, a swoosh into each new card (starting 20 to 60 ms early so it builds into the cut), a pop on product shots, a tick per row on the ingredient list, and a bell on the big numbers and the save card.
- **Levels:** -14 LUFS (Instagram's own loudness target) with true peaks under -1.5 dBFS, so Instagram does not turn it down or distort it.
- **Caveat:** I checked it with measurements (loudness, balance across frequencies, effect timing against each cut, spectrogram), but I cannot hear it. Listen before you post and tell me what to change (tempo, mood, busier or calmer drums, louder or quieter effects) and I will re-render.

## Profile (ig-profile)

| Field | Suggestion |
| --- | --- |
| Name field (searchable) | `Keshvardhan | Hair Care Routine` |
| Bio | `Eat it. Oil it. Repeat.` / `Herbal hair powder + scalp oil, made in India.` / `Every milligram on the label.` |
| Link | `https://keshvardhan.vercel.app` (switch to your own domain once you have it) |
| Highlights | Routine, Ingredients, How to oil, FAQ, Orders |
| Pinned three | Reel 1, Reel 2, Reel 3 |
| Account type | Business or Creator, category Health/Beauty or Personal care |

## Engagement round (20 minutes a day, before you post)

The planner needs real accounts, and only you know which ones fit, so fill in names: 5 reach accounts (Indian hair-care, Ayurveda and wellness creators with audiences you want), 3 peers (small Indian wellness or D2C brands of similar size), 2 likely buyers (new mothers, working professionals who share hair-care questions). Leave real comments about what the post actually says, never emoji-only, and never pitch in a comment.

## Rules these posts follow (do not break them when you add more)

- **No outcome or growth claims.** Never say hair growth, regrowth, stops hair fall, cures, reduces, detox or "clinically proven". Say "part of a routine", "traditionally used", "track what you notice". This follows the Drugs and Magic Remedies Act, ASCI and FSSAI advertising rules.
- **Powder is a food, oil is a cosmetic.** Never call either a medicine or a supplement.
- **No invented proof.** There are no customers, reviews or follower counts to quote yet. Do not post testimonials until real ones exist.
- **One ask per post**, and never "follow for more".
- **The waitlist does not send a guide.** Only an order includes the 30-day guide, so do not promise a free guide by email in posts or stories.

## Before you drive traffic to the store

The site is live but these must be true first: real stock and photography (the product art here is placeholder illustration), GSTIN, FSSAI food registration for the powder, the manufacturer's cosmetic licence details on the oil pack, Razorpay live keys if you want online payment, and your real Instagram handle in `tools/brand.mjs` (it is assumed to be `@keshvardhan`).

## Change something and re-render

Edit text or timings in `tools/reels.mjs` or `tools/carousels.mjs`, then from the project root:

```bash
node social/instagram/tools/render-reels.mjs           # all Reels, silent masters (about 2 minutes each)
node social/instagram/tools/render-audio.mjs           # compose the music and effects and mix them into each Reel (seconds)
node social/instagram/tools/render-reels.mjs reel-2    # one Reel
node social/instagram/tools/render-reels.mjs reel-2 --preview   # stills only, fast
node social/instagram/tools/render-carousels.mjs       # all carousels
```

Reels are rendered frame by frame, so playback is smooth. They need `ffmpeg` and the Playwright browser, both already installed on this machine.
