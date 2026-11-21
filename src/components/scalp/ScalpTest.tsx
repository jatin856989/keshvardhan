"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";
import { WaitlistForm } from "@/components/home/WaitlistForm";
import { trackEvent } from "@/lib/analytics";
import { getProduct } from "@/lib/products";
import { computeResult, isComplete, profileCopy, questions, suggestProducts, type Answers } from "@/lib/scalp-test";

export function ScalpTest() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const reduce = useReducedMotion();
  const q = questions[step];

  function pick(optionId: string) {
    if (!started.current) {
      started.current = true;
      trackEvent("scalp_test_start");
    }
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    window.setTimeout(() => {
      if (step < questions.length - 1) setStep(step + 1);
      else if (isComplete(next)) {
        setDone(true);
        const r = computeResult(next);
        trackEvent("scalp_test_complete", { profile: r.profile });
      }
    }, reduce ? 0 : 220);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
    started.current = false;
  }

  if (done) return <ResultView answers={answers} onRestart={restart} />;

  const progress = Math.round((step / questions.length) * 100);
  return (
    <div className="card overflow-hidden">
      <div className="h-1.5 w-full bg-cream-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progress">
        <motion.div className="h-full bg-amla" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: reduce ? 0 : 0.35 }} />
      </div>
      <div className="p-6 sm:p-10">
        <p className="text-sm font-semibold text-stone" aria-live="polite">
          Question {step + 1} of {questions.length}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={q.id}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-display mt-3 text-balance text-2xl text-forest sm:text-3xl">{q.prompt}</h2>
            {q.help ? <p className="mt-2 text-sm text-stone">{q.help}</p> : null}
            <div role="radiogroup" aria-label={q.prompt} className="mt-6 grid gap-3">
              {q.options.map((o) => {
                const selected = answers[q.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => pick(o.id)}
                    className={`flex items-center justify-between gap-4 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition hover:-translate-y-0.5 hover:border-forest focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                      selected ? "border-forest bg-amla-100 text-forest" : "border-line bg-white text-ink"
                    }`}
                  >
                    <span>{o.label}</span>
                    <span
                      aria-hidden="true"
                      className={`grid size-6 shrink-0 place-items-center rounded-full border-2 ${selected ? "border-forest bg-forest text-cream" : "border-line"}`}
                    >
                      {selected ? <Check className="size-3.5" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest transition hover:text-terracotta disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </button>
          <p className="text-xs text-stone">Nothing is stored or sent. It runs in your browser.</p>
        </div>
      </div>
    </div>
  );
}

function Meter({ label, value, hint, good }: { label: string; value: number; hint: string; good: "high" | "low" }) {
  const reduce = useReducedMotion();
  const tone = good === "high" ? (value >= 60 ? "bg-amla" : value >= 35 ? "bg-gold" : "bg-terracotta") : value <= 35 ? "bg-amla" : value <= 65 ? "bg-gold" : "bg-terracotta";
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-forest">{label}</span>
        <span className="font-display text-lg text-forest">{value}</span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-cream-200" role="img" aria-label={`${label}: ${value} out of 100. ${hint}`}>
        <motion.div className={`h-full rounded-full ${tone}`} initial={{ width: reduce ? `${value}%` : 0 }} animate={{ width: `${value}%` }} transition={{ duration: reduce ? 0 : 0.8, ease: "easeOut" }} />
      </div>
      <p className="mt-1 text-xs text-stone">{hint}</p>
    </div>
  );
}

function ResultView({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const r = computeResult(answers);
  const copy = profileCopy[r.profile];
  const picks = suggestProducts(r)
    .map((s) => ({ ...s, product: getProduct(s.slug) }))
    .filter((s) => s.product);

  return (
    <div className="space-y-6" aria-live="polite">
      <div className={`card p-6 sm:p-10 ${r.flagged ? "border-terracotta" : ""}`}>
        <p className="eyebrow flex items-center gap-2">
          {r.flagged ? <ShieldAlert className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
          Your scalp check
        </p>
        <h2 className="font-display mt-3 text-balance text-3xl text-forest sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-stone">{copy.summary}</p>

        {!r.flagged ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Meter label="Scalp comfort" value={r.comfortScore} good="high" hint="How calm your scalp feels. Higher is calmer." />
            <Meter label="Care habits" value={r.careScore} good="high" hint="How steady your washing, oiling and eating are." />
            <Meter label="Styling stress" value={r.stressScore} good="low" hint="Heat and tight styles. Lower is gentler." />
          </div>
        ) : null}
      </div>

      <div className="card p-6 sm:p-10">
        <h3 className="font-display text-2xl text-forest">{r.flagged ? "What to do next" : "What we would try"}</h3>
        <ul className="mt-4 space-y-3">
          {r.tips.map((t) => (
            <li key={t} className="flex gap-3 leading-relaxed text-ink/90">
              <Check className="mt-1 size-4 shrink-0 text-amla" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {picks.length ? (
        <div className="card p-6 sm:p-10">
          <h3 className="font-display text-2xl text-forest">A routine that fits your answers</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {picks.map(({ slug, reason, product }) => (
              <Link key={slug} href={`/products/${slug}`} className="group rounded-2xl border border-line bg-cream-50 p-5 transition hover:-translate-y-0.5 hover:border-forest">
                <p className="font-display text-xl text-forest">{product!.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">{reason}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
                  See the product <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone">Daily Root Powder is a food and Root Ritual Oil is a cosmetic. Neither is a medicine. Check with your doctor first if you are pregnant, on medication or have allergies.</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-line bg-cream-50 p-5 text-sm leading-relaxed text-stone">
        <strong className="text-forest">This is a habit check, not a medical test.</strong> It cannot diagnose a scalp or hair condition. If you have persistent itching, redness, scaling, sores, sudden shedding or bare patches, please see a dermatologist.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onRestart} className="btn btn-ghost">
          <RotateCcw className="size-4" aria-hidden="true" /> Retake the check
        </button>
        <div className="max-w-md">
          <p className="text-sm font-semibold text-forest">Get launch offers and updates</p>
          <WaitlistForm source="scalp-test" compact={false} />
        </div>
      </div>
    </div>
  );
}
