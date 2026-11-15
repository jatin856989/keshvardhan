# Reel 1: Oil is half the job

- **Type:** Opinion / the brand thesis
- **Suggested day:** Monday evening (about 7 to 9 pm IST)
- **Hook formula:** #3 Nobody Tells You
- **File:** `reels/reel-1-half-the-job.mp4` (1080x1920, 30.5 s, with original music and sound effects, still works muted; silent master alongside)
- **Cover:** `reels/reel-1-half-the-job-cover.jpg`

## Hook score (ig-reel hookscore.py)

```
HOOK SCORE
==============================================================
  "Nobody tells you oil is half the job."

  LENGTH        ######################## 100.0
                8 words, 37 chars, ~2.9s spoken (want 5-12 words)
  SPECIFICITY   ##################......  75.0
                1 concrete marker(s): half
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
Nobody tells you oil is half the job.
Hair is built from what you eat.
It's protected by what you put on it, and a bottle can't do both.
So we made both.
1 teaspoon of 8 plants and seeds, every morning.
Then an oil, infused with 5 of them, twice a week.
Every milligram is on the label.
Give it 30 days, because that's the fair test.
Save this for your next wash day.
Eat it. Oil it. Repeat. That's the whole job.
```

## Timed beat sheet (ig-reel beats.py, 165 words per minute)

```
BEAT SHEET  ·  84 words  ·  ~30.6s at 165 wpm  ·  target 28.0s
========================================================================
  0:00.0   2.9s  HOOK    Nobody tells you oil is half the job.
  0:02.9   2.5s          Hair is built from what you eat.
  0:05.5   5.1s          It's protected by what you put on it, and a bottle can't do both.
                         ^ 5.1s on one beat
  0:10.6   1.4s          So we made both.
  0:12.0   3.3s          1 teaspoon of 8 plants and seeds, every morning.
  0:15.3   4.0s  MID     Then an oil, infused with 5 of them, twice a week.
  0:19.3   2.2s          Every milligram is on the label.
  0:21.4   3.3s          Give it 30 days, because that's the fair test.
  0:24.7   2.5s          Save this for your next wash day.
  0:27.3   3.3s  CTA     Eat it. Oil it. Repeat. That's the whole job.
------------------------------------------------------------------------
  - Beat 1 has no number and no name in it. Hooks without something checkable are the ones that get scrolled.
  - Beat(s) 3 run past 4s. Either split the line or change what is on screen inside it. A static frame is where people leave.
  - Beats 1-3 have nothing concrete in them. Put a number, a name or a price in one of them.
  - Loops: the last beat repeats "job, oil" from the hook. Second watches are free reach.
  - Length is on target (30.5s against 28.0s).
```

## Human-voice check (ig-human detect.py)

```
AI DETECTION PANEL
==============================================================
  BURSTINESS    #######.................  31.0
                variation 0.37 across 10 sentences (want 0.55+)
  SPECIFICITY   ####################....  81.8
                4 concrete markers, 5.0 per 100 words (want 4+)
  SLOP DENSITY  ######################## 100.0
                0 stock terms, 0.0 per 100 words
  FINGERPRINT   ######################## 100.0
                0 invisible, 0 em dash, 0 curly quote, 0 ellipsis, 0 hard space
  VOICE         ######################..  91.2
                5.0 contractions, 6.2 personal pronouns per 100 words, 0 structural tell(s)
--------------------------------------------------------------
  HUMAN SCORE   ###############.........  60.9   REVIEW

  Weakest signal: BURSTINESS. Fix that first.
```

The scorer rewards uneven sentence lengths. These are short instructional lines, so the overall score is a heuristic only; read the script aloud and change anything that does not sound like you.

## On-screen cards (what the video shows)

| # | Time | Colour | Text |
| --- | --- | --- | --- |
| 1 | 0.0 to 2.9 s | forest | Oil is only half the job. |
| 2 | 2.9 to 5.5 s | cream | Built from what you eat. |
| 3 | 5.5 to 8.0 s | amla | Protected by what you apply. |
| 4 | 8.0 to 10.6 s | cream | One bottle can't do both. |
| 5 | 10.6 to 12.0 s | forest | So we made both. |
| 6 | 12.0 to 15.3 s | amla | 1 teaspoon. 8 plants. Every morning. |
| 7 | 15.3 to 17.5 s | cream | Plus an oil infused with 5. |
| 8 | 17.5 to 19.3 s | terracotta | Twice a week. |
| 9 | 19.3 to 21.4 s | amla | Every milligram on the label. |
| 10 | 21.4 to 23.0 s | cream | 30 Give it 30 days. |
| 11 | 23.0 to 24.7 s | cream | That's the fair test. |
| 12 | 24.7 to 27.3 s | terracotta | Save this for wash day. |
| 13 | 27.3 to 30.5 s | forest | Eat it. Oil it. Repeat. |

## Caption (ig-caption caption.py: READY)

```
Save this for your next wash day.

Hair is built from what you eat and protected by what you put on it. So the Keshvardhan hair care routine has two parts: 1 teaspoon (5 g) of Daily Root Powder every morning, and Root Ritual Oil for hair oiling 2 or 3 times a week.

8 plants and seeds in the jar, 5 of them infused into the oil, and every milligram printed on the label. No added sugar, no synthetic fragrance.

Give it 30 days and track what you notice. Results vary. The powder is a food and the oil is a cosmetic, so check with your doctor if you are pregnant, breastfeeding or on medication.

#haircareroutine #amla #hairoiling
```
