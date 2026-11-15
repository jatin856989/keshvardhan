# Reel 3: Scalp, not lengths

- **Type:** Teach (how to oil your scalp)
- **Suggested day:** Friday evening (about 7 to 9 pm IST)
- **Hook formula:** #2 Negative Command
- **File:** `reels/reel-3-scalp-not-lengths.mp4` (1080x1920, 28.3 s, with original music and sound effects, still works muted; silent master alongside)
- **Cover:** `reels/reel-3-scalp-not-lengths-cover.jpg`

## Hook score (ig-reel hookscore.py)

```
HOOK SCORE
==============================================================
  "Stop oiling your lengths. Oil your scalp."

  LENGTH        ######################## 100.0
                7 words, 41 chars, ~2.5s spoken (want 5-12 words)
  SPECIFICITY   ##################......  75.0
                1 concrete marker(s): Oil
  STAKES        #################.......  70.0
                1 tension marker(s): stop
  FRONTLOAD     ######################## 100.0
                payload at word 1
  ADDRESS       ######################## 100.0
                speaks to the viewer
--------------------------------------------------------------
  HOOK SCORE    ####################....  81.4   STRONG
```

## Voiceover script (optional, record it if you want audio)

```
Stop oiling your lengths. Oil your scalp.
Here's the 5 minute way.
Warm 1 teaspoon of oil between your palms, then split your hair into 4 sections.
Use your fingertips, never your nails.
Make slow circles across the whole scalp for 5 minutes.
Leave it in for an hour, or overnight.
Wash it out with 1 shampoo, not 2.
2 or 3 times a week is plenty. Save this for wash day.
Scalp first. The lengths can wait.
```

## Timed beat sheet (ig-reel beats.py, 165 words per minute)

```
BEAT SHEET  ·  78 words  ·  ~28.4s at 165 wpm  ·  target 28.0s
========================================================================
  0:00.0   2.5s  HOOK    Stop oiling your lengths. Oil your scalp.
  0:02.5   1.8s          Here's the 5 minute way.
  0:04.4   5.5s          Warm 1 teaspoon of oil between your palms, then split your hair into 4 sections.
                         ^ 5.5s on one beat
  0:09.8   2.2s          Use your fingertips, never your nails.
  0:12.0   3.6s  MID     Make slow circles across the whole scalp for 5 minutes.
  0:15.6   2.9s          Leave it in for an hour, or overnight.
  0:18.6   2.9s          Wash it out with 1 shampoo, not 2.
  0:21.4   4.7s          2 or 3 times a week is plenty. Save this for wash day.
                         ^ 4.7s on one beat
  0:26.2   2.2s  CTA     Scalp first. The lengths can wait.
------------------------------------------------------------------------
  - Beat(s) 3, 8 run past 4s. Either split the line or change what is on screen inside it. A static frame is where people leave.
  - Loops: the last beat repeats "lengths, scalp" from the hook. Second watches are free reach.
  - Length is on target (28.4s against 28.0s).
```

## Human-voice check (ig-human detect.py)

```
AI DETECTION PANEL
==============================================================
  BURSTINESS    #############...........  53.3
                variation 0.48 across 11 sentences (want 0.55+)
  SPECIFICITY   ######################## 100.0
                8 concrete markers, 11.4 per 100 words (want 4+)
  SLOP DENSITY  ######################## 100.0
                0 stock terms, 0.0 per 100 words
  FINGERPRINT   ######################## 100.0
                0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space
  VOICE         ####################....  81.7
                1.4 contractions, 8.6 personal pronouns per 100 words, 0 structural tell(s)
--------------------------------------------------------------
  HUMAN SCORE   ##################......  73.5   REVIEW

  Weakest signal: BURSTINESS. Fix that first.
```

The scorer rewards uneven sentence lengths. These are short instructional lines, so the overall score is a heuristic only; read the script aloud and change anything that does not sound like you.

## On-screen cards (what the video shows)

| # | Time | Colour | Text |
| --- | --- | --- | --- |
| 1 | 0.0 to 2.5 s | forest | Oil your scalp. Not your lengths. |
| 2 | 2.5 to 4.3 s | cream | The 5 minute way. |
| 3 | 4.3 to 7.5 s | amla | Warm 1 teaspoon in your palms. |
| 4 | 7.5 to 9.8 s | cream | Split hair into 4 sections. |
| 5 | 9.8 to 12.0 s | forest | Fingertips. Never nails. |
| 6 | 12.0 to 15.6 s | amla | Slow circles. 5 minutes. |
| 7 | 15.6 to 18.5 s | cream | Leave 1 hour, or overnight. |
| 8 | 18.5 to 21.4 s | forest | 1 shampoo. Not 2. |
| 9 | 21.4 to 24.0 s | cream | 2 or 3 times a week. |
| 10 | 24.0 to 26.1 s | terracotta | Save this for wash day. |
| 11 | 26.1 to 28.3 s | forest | Scalp first. Lengths wait. |

## Caption (ig-caption caption.py: READY)

```
Save this for wash day.

How to oil your scalp in 5 minutes, a simple scalp massage routine: warm 1 teaspoon of oil between your palms, split your hair into 4 sections, and make slow circles with your fingertips (never your nails) across the whole scalp. Leave it in for an hour or overnight, then wash with 1 shampoo, not 2. 2 or 3 times a week is plenty.

Our Root Ritual Oil is made for hair oiling: cold-pressed coconut and black sesame oil, slow-infused with 5 botanicals and scented only by the herbs. Do a patch test on your inner arm before first use.

#hairoiling #scalpcare #washday
```
