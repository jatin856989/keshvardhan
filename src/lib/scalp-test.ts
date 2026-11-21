/**
 * Scalp check: a habit-and-comfort self-assessment, not a medical test.
 *
 * Pure data and scoring so it can be unit-tested and reused. Copy follows the
 * advertising rules in docs/: no diagnosis, no treatment, no growth or hair-fall
 * claims. Anything that looks like a possible skin or shedding problem routes to
 * "see a professional" instead of to a product.
 */

export type ProfileId = "balanced" | "dry" | "oily" | "combination" | "sensitive" | "see-professional";

export interface Option {
  id: string;
  label: string;
  /** Points toward a dry-feeling scalp. */
  dry?: number;
  /** Points toward an oily-feeling scalp. */
  oily?: number;
  /** Points toward an irritated or sensitive feeling. */
  irritation?: number;
  /** Care-habit points, 0 (little) to 3 (consistent). */
  care?: number;
  /** Styling-stress points, 0 (none) to 3 (daily). */
  stress?: number;
  /** Answers that suggest talking to a doctor or dermatologist before anything else. */
  flag?: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  help?: string;
  options: Option[];
}

export const questions: Question[] = [
  {
    id: "feel",
    prompt: "A day or two after washing, how does your scalp feel by evening?",
    help: "Think about a normal week, not a one-off.",
    options: [
      { id: "tight", label: "Dry or tight", dry: 2 },
      { id: "fine", label: "Comfortable, nothing to notice" },
      { id: "greasy", label: "Greasy at the roots, hair looks limp", oily: 2 },
      { id: "mixed", label: "Oily at the roots, dry at the ends", oily: 1, dry: 1 },
    ],
  },
  {
    id: "itch",
    prompt: "How often does your scalp itch?",
    options: [
      { id: "never", label: "Almost never" },
      { id: "sometimes", label: "Now and then", irritation: 1 },
      { id: "most", label: "Most days", irritation: 2 },
      { id: "constant", label: "Constantly, or with redness, sores or burning", irritation: 3, flag: true },
    ],
  },
  {
    id: "flakes",
    prompt: "Do you see flakes on your scalp or shoulders?",
    options: [
      { id: "none", label: "No" },
      { id: "dry", label: "A few small, dry flakes", dry: 1, irritation: 1 },
      { id: "oily", label: "Larger, yellowish or greasy flakes", oily: 1, irritation: 1 },
      { id: "patches", label: "Thick patches, scaling or painful areas", irritation: 2, flag: true },
    ],
  },
  {
    id: "shedding",
    prompt: "Have you noticed a change in how much hair you shed?",
    help: "Losing 50 to 100 strands a day is normal for most people.",
    options: [
      { id: "same", label: "No change" },
      { id: "more", label: "A bit more than usual lately" },
      { id: "sudden", label: "Sudden shedding, or bare patches", flag: true },
    ],
  },
  {
    id: "wash",
    prompt: "How often do you wash your hair?",
    options: [
      { id: "daily", label: "Every day", care: 1 },
      { id: "alt", label: "Every second day", care: 3 },
      { id: "twice", label: "Two to three times a week", care: 3 },
      { id: "rare", label: "Once a week or less", care: 1 },
    ],
  },
  {
    id: "oil",
    prompt: "How often do you oil or massage your scalp?",
    options: [
      { id: "never", label: "Never", care: 0 },
      { id: "rare", label: "Once in a while", care: 1 },
      { id: "weekly", label: "About once a week", care: 2 },
      { id: "often", label: "Two to three times a week", care: 3 },
    ],
  },
  {
    id: "heat",
    prompt: "How often do you use heat on your hair (dryers, straighteners, curlers)?",
    options: [
      { id: "none", label: "Rarely or never", stress: 0 },
      { id: "monthly", label: "A few times a month", stress: 1 },
      { id: "weekly", label: "A few times a week", stress: 2 },
      { id: "daily", label: "Almost every day", stress: 3 },
    ],
  },
  {
    id: "tight",
    prompt: "How often is your hair pulled back tightly (ponytails, buns, braids, helmets)?",
    options: [
      { id: "rare", label: "Rarely", stress: 0 },
      { id: "some", label: "Some days", stress: 1 },
      { id: "most", label: "Most days", stress: 2 },
      { id: "daily", label: "Every day, tightly", stress: 3 },
    ],
  },
  {
    id: "plate",
    prompt: "How would you describe your eating, water and sleep this month?",
    help: "Protein, greens, nuts and seeds, enough water, and about seven hours of sleep.",
    options: [
      { id: "good", label: "Mostly steady", care: 3 },
      { id: "mixed", label: "A mix of good and rushed days", care: 2 },
      { id: "poor", label: "Skipped meals, little sleep, lots of takeaway", care: 0 },
    ],
  },
];

export interface Answers {
  [questionId: string]: string;
}

export interface Result {
  profile: ProfileId;
  flagged: boolean;
  /** 0 to 100: how consistent your care habits are. Higher is steadier. */
  careScore: number;
  /** 0 to 100: how much styling stress your hair takes. Lower is gentler. */
  stressScore: number;
  /** 0 to 100: how comfortable your scalp feels. Higher is calmer. */
  comfortScore: number;
  tips: string[];
}

function sum(answers: Answers, key: "dry" | "oily" | "irritation" | "care" | "stress"): number {
  let total = 0;
  for (const q of questions) {
    const picked = q.options.find((o) => o.id === answers[q.id]);
    total += picked?.[key] ?? 0;
  }
  return total;
}

function maxFor(key: "care" | "stress" | "irritation"): number {
  return questions.reduce((acc, q) => acc + Math.max(0, ...q.options.map((o) => o[key] ?? 0)), 0);
}

export function isComplete(answers: Answers): boolean {
  return questions.every((q) => q.options.some((o) => o.id === answers[q.id]));
}

export function computeResult(answers: Answers): Result {
  const flagged = questions.some((q) => q.options.find((o) => o.id === answers[q.id])?.flag === true);
  const dry = sum(answers, "dry");
  const oily = sum(answers, "oily");
  const irritation = sum(answers, "irritation");
  const care = sum(answers, "care");
  const stress = sum(answers, "stress");

  const careScore = Math.round((care / maxFor("care")) * 100);
  const stressScore = Math.round((stress / maxFor("stress")) * 100);
  const comfortScore = Math.round(100 - (irritation / maxFor("irritation")) * 70 - Math.min(30, Math.abs(dry - oily) * 8));

  let profile: ProfileId;
  if (flagged) profile = "see-professional";
  else if (irritation >= 4) profile = "sensitive";
  else if (dry >= 2 && oily >= 2) profile = "combination";
  else if (dry - oily >= 2) profile = "dry";
  else if (oily - dry >= 2) profile = "oily";
  else if (dry >= 1 && oily >= 1) profile = "combination";
  else profile = "balanced";

  const tips = profile === "see-professional" ? professionalTips() : [...profileTips[profile], ...habitTips(answers)].slice(0, 6);
  return { profile, flagged, careScore, stressScore, comfortScore: Math.max(0, Math.min(100, comfortScore)), tips };
}

function professionalTips(): string[] {
  return [
    "Persistent itching, burning, thick scaling, sores, sudden shedding or bare patches are worth showing a dermatologist before you change your routine.",
    "Bring a note of when it started, what you use on your hair, any new medicines and your recent diet. Photos taken on different days help.",
    "Skip new products on the affected skin until you have been seen. Gentle washing with a fragrance-free shampoo is usually fine in the meantime; ask your doctor.",
  ];
}

const profileTips: Record<Exclude<ProfileId, "see-professional">, string[]> = {
  balanced: [
    "Your scalp feels settled, so the goal is consistency. Keep washing on a rhythm that suits you and avoid piling on products.",
    "A light weekly scalp massage is an easy habit to keep, and a pleasant one.",
  ],
  dry: [
    "Dry-feeling scalps often like a warm oil massage before washing. Two to three times a week, left on for an hour or overnight, is a good starting rhythm.",
    "Wash with lukewarm rather than hot water, and use a gentle, fragrance-free shampoo.",
    "Drink water through the day; a dry-feeling scalp is a good reason to look at hydration and the plate, not only the bottle.",
  ],
  oily: [
    "Oily-feeling scalps usually do best with a light touch: oil the scalp, not the lengths, for an hour before washing, then shampoo once thoroughly.",
    "Avoid scrubbing hard or washing more than once in a session. That can make the scalp feel greasier, not cleaner.",
    "Keep hands, pillowcases and brushes clean; they carry oil back to the roots.",
  ],
  combination: [
    "Roots that feel oily and ends that feel dry want different care: massage a little oil into the scalp only, and keep conditioner on the lengths.",
    "Wash every second or third day and rinse well. Let the scalp, not the calendar, decide.",
  ],
  sensitive: [
    "Your scalp sounds easily irritated. Keep the routine simple, fragrance-free, and change one thing at a time so you can tell what helps.",
    "Do a patch test before any new oil: a dab on the inner forearm, left for 24 hours. Root Ritual Oil contains rosemary essential oil, so skip it if you react to essential oils.",
    "If itching or flaking continues for more than two to three weeks, see a dermatologist.",
  ],
};

function habitTips(answers: Answers): string[] {
  const out: string[] = [];
  if (answers.heat === "weekly" || answers.heat === "daily") out.push("Heat is your biggest styling stress. Use the lowest setting, add a heat protectant and give your hair heat-free days.");
  if (answers.tight === "most" || answers.tight === "daily") out.push("Tight styles pull on the roots. Loosen them, swap between styles and avoid sleeping in a tight tie.");
  if (answers.oil === "never") out.push("You have not started scalp care yet. Begin with once a week and build up; the five-minute massage matters as much as the oil.");
  if (answers.wash === "daily") out.push("Daily washing can strip a scalp that is already dry. Try alternate days if your scalp allows it.");
  if (answers.wash === "rare") out.push("Washing once a week or less lets oil and product build up. Aim for two to three washes a week.");
  if (answers.plate === "poor") out.push("Hair is built from what you eat. Protein, iron-rich foods, nuts and seeds and enough sleep come first. If you suspect a deficiency, ask a doctor to test rather than guessing.");
  return out;
}

export const profileCopy: Record<ProfileId, { title: string; summary: string }> = {
  balanced: { title: "A balanced-feeling scalp", summary: "Your answers describe a scalp that feels comfortable. Keep the habits that work and keep it steady." },
  dry: { title: "A dry-leaning scalp", summary: "Your scalp tends to feel tight or dry. Gentle washing and a regular warm oil massage are the usual place to start." },
  oily: { title: "An oily-leaning scalp", summary: "Your roots tend to get greasy. A light, scalp-only oiling before washing and a thorough rinse usually suit this type." },
  combination: { title: "A combination scalp", summary: "Your roots lean oily while the lengths feel dry. Treat the scalp and the ends separately." },
  sensitive: { title: "A sensitive-feeling scalp", summary: "Your scalp seems easily irritated. Keep things simple, patch test anything new, and see a dermatologist if it persists." },
  "see-professional": { title: "Please see a doctor first", summary: "Some of your answers describe symptoms that a dermatologist should look at before you change your routine." },
};

export type RoutineSuggestion = { slug: "routine-bundle" | "daily-root-powder" | "root-ritual-oil"; reason: string };

/** Product pointers. Never offered when the result says to see a professional. */
export function suggestProducts(result: Result): RoutineSuggestion[] {
  if (result.flagged) return [];
  const list: RoutineSuggestion[] = [];
  if (result.profile === "sensitive") {
    list.push({ slug: "daily-root-powder", reason: "A food-grade daily powder is a gentle way to start the plate half of the routine. Patch test the oil separately before using it." });
    return list;
  }
  list.push({ slug: "routine-bundle", reason: "Both halves together: the powder for the plate and the oil for the scalp, with the 30-day guide." });
  list.push({ slug: "root-ritual-oil", reason: "A herbal scalp oil in cold-pressed coconut and black sesame for a weekly warm massage." });
  return list;
}
