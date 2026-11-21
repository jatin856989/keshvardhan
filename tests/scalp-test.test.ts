import { describe, expect, it } from "vitest";
import { computeResult, isComplete, questions, suggestProducts, type Answers } from "@/lib/scalp-test";

function answersWith(over: Answers = {}): Answers {
  const base: Answers = {};
  for (const q of questions) base[q.id] = q.options[0].id;
  return { ...base, ...over };
}

describe("scalp check", () => {
  it("needs every question answered", () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete(answersWith())).toBe(true);
  });

  it("describes a calm scalp as balanced", () => {
    const r = computeResult(answersWith({ feel: "fine", itch: "never", flakes: "none", shedding: "same" }));
    expect(r.profile).toBe("balanced");
    expect(r.flagged).toBe(false);
  });

  it("detects dry and oily tendencies", () => {
    expect(computeResult(answersWith({ feel: "tight", flakes: "dry", itch: "never" })).profile).toBe("dry");
    expect(computeResult(answersWith({ feel: "greasy", flakes: "oily", itch: "never" })).profile).toBe("oily");
    expect(computeResult(answersWith({ feel: "mixed", itch: "never", flakes: "none" })).profile).toBe("combination");
  });

  it("routes worrying answers to a professional and never suggests products", () => {
    for (const over of [{ itch: "constant" }, { flakes: "patches" }, { shedding: "sudden" }] as Answers[]) {
      const r = computeResult(answersWith(over));
      expect(r.profile).toBe("see-professional");
      expect(r.flagged).toBe(true);
      expect(suggestProducts(r)).toEqual([]);
    }
  });

  it("scores habits within 0 to 100", () => {
    const best = computeResult(answersWith({ wash: "alt", oil: "often", plate: "good", heat: "none", tight: "rare" }));
    const worst = computeResult(answersWith({ wash: "daily", oil: "never", plate: "poor", heat: "daily", tight: "daily" }));
    for (const r of [best, worst]) {
      expect(r.careScore).toBeGreaterThanOrEqual(0);
      expect(r.careScore).toBeLessThanOrEqual(100);
      expect(r.stressScore).toBeGreaterThanOrEqual(0);
      expect(r.stressScore).toBeLessThanOrEqual(100);
    }
    expect(best.careScore).toBeGreaterThan(worst.careScore);
    expect(best.stressScore).toBeLessThan(worst.stressScore);
  });

  it("never makes outcome or medical claims in tips", () => {
    const banned = /\b(cure|treat|regrow|growth|stop hair fall|miracle|guarantee|clinically proven|detox)\b/i;
    for (const q of questions) {
      for (const o of q.options) {
        const r = computeResult(answersWith({ [q.id]: o.id }));
        for (const tip of r.tips) expect(tip).not.toMatch(banned);
      }
    }
  });
});
