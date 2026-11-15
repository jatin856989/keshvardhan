# Reel 2: 1,200 mg

- **Type:** Proof of transparency (real label numbers)
- **Suggested day:** Wednesday evening (about 7 to 9 pm IST)
- **Hook formula:** #3 Nobody Tells You
- **File:** `reels/reel-2-1200-mg.mp4` (1080x1920, 29.1 s, with original music and sound effects, still works muted; silent master alongside)
- **Cover:** `reels/reel-2-1200-mg-cover.jpg`

## Hook score (ig-reel hookscore.py)

```
HOOK SCORE
==============================================================
  "Nobody tells you what 1,200 mg looks like."

  LENGTH        ######################## 100.0
                8 words, 42 chars, ~2.9s spoken (want 5-12 words)
  SPECIFICITY   ##################......  75.0
                1 concrete marker(s): 1,200
  STAKES        #################.......  70.0
                1 tension marker(s): nobody
  FRONTLOAD     ######################## 100.0
                payload at word 1
  ADDRESS       ######################## 100.0
                speaks to the viewer
--------------------------------------------------------------
  HOOK SCORE    ####################....  81.4   STRONG
```

## Voiceover script (optional, record it if you want audio)

```
Nobody tells you what 1,200 mg looks like.
It's one teaspoon of amla, and we print it.
Black sesame is 700. Moringa and bhringraj are 600 each.
Curry leaf, fenugreek and pumpkin seed are 500 each, and hibiscus is 400.
That's all 8. No added sugar, no isolated vitamins.
A proprietary blend wouldn't tell you any of that.
Save this, then check the label on whatever you take now.
Nobody tells you how much is inside. We print all 8.
```

## Timed beat sheet (ig-reel beats.py, 165 words per minute)

```
BEAT SHEET  ·  80 words  ·  ~29.1s at 165 wpm  ·  target 28.0s
========================================================================
  0:00.0   2.9s  HOOK    Nobody tells you what 1,200 mg looks like.
  0:02.9   3.3s          It's one teaspoon of amla, and we print it.
  0:06.2   3.6s          Black sesame is 700. Moringa and bhringraj are 600 each.
  0:09.8   4.7s  MID     Curry leaf, fenugreek and pumpkin seed are 500 each, and hibiscus is 400.
                         ^ 4.7s on one beat
  0:14.6   3.3s          That's all 8. No added sugar, no isolated vitamins.
  0:17.8   3.3s          A proprietary blend wouldn't tell you any of that.
  0:21.1   4.0s          Save this, then check the label on whatever you take now.
  0:25.1   4.0s  CTA     Nobody tells you how much is inside. We print all 8.
------------------------------------------------------------------------
  - Beat(s) 4 run past 4s. Either split the line or change what is on screen inside it. A static frame is where people leave.
  - Loops: the last beat repeats "nobody, tells" from the hook. Second watches are free reach.
  - Length is on target (29.1s against 28.0s).
```

## Human-voice check (ig-human detect.py)

```
AI DETECTION PANEL
==============================================================
  BURSTINESS    #########...............  38.9
                variation 0.41 across 11 sentences (want 0.55+)
  SPECIFICITY   ######################## 100.0
                7 concrete markers, 9.6 per 100 words (want 4+)
  SLOP DENSITY  ######################## 100.0
                0 stock terms, 0.0 per 100 words
  FINGERPRINT   ######################## 100.0
                0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space
  VOICE         ######################## 100.0
                4.1 contractions, 8.2 personal pronouns per 100 words, 0 structural tell(s)
--------------------------------------------------------------
  HUMAN SCORE   ################........  68.2   REVIEW

  Weakest signal: BURSTINESS. Fix that first.
```

The scorer rewards uneven sentence lengths. These are short instructional lines, so the overall score is a heuristic only; read the script aloud and change anything that does not sound like you.

## On-screen cards (what the video shows)

| # | Time | Colour | Text |
| --- | --- | --- | --- |
| 1 | 0.0 to 2.9 s | forest | 1,200 mg of amla |
| 2 | 2.9 to 6.2 s | cream | That's 1 teaspoon. We print it. |
| 3 | 6.2 to 9.8 s | amla | Black sesame 700 mg / Moringa leaf 600 mg / Bhringraj 600 mg |
| 4 | 9.8 to 14.5 s | cream | Curry leaf 500 mg / Fenugreek 500 mg / Pumpkin seed 500 mg / Hibiscus 400 mg |
| 5 | 14.5 to 16.1 s | forest | That's all 8. |
| 6 | 16.1 to 17.8 s | amla | No added sugar. No isolated vitamins. |
| 7 | 17.8 to 21.1 s | cream | “Proprietary blend” means no numbers. |
| 8 | 21.1 to 25.1 s | terracotta | Save this. Check your label. |
| 9 | 25.1 to 29.1 s | forest | We print all 8. |

## Caption (ig-caption caption.py: READY)

```
Save this, then check the label on your own hair powder.

One 5 g teaspoon of our herbal hair powder, Daily Root Powder: amla 1,200 mg, black sesame 700 mg, moringa leaf 600 mg, bhringraj 600 mg, curry leaf 500 mg, fenugreek 500 mg, pumpkin seed 500 mg and hibiscus flower 400 mg.

That's all 8 plants and seeds on the ingredient label, with no added sugar and no isolated vitamins. A proprietary blend can't tell you any of that. Whether you take amla powder or a mixed herbal powder, look for milligrams on the label. We print every number, on the pack and on our website.

Contains sesame. A food product, not a medicine.

#amlapowder #cleanlabel #ayurveda
```
