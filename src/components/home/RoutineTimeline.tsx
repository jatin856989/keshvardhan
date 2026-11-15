"use client";

import { motion, useReducedMotion } from "motion/react";

const weeks = [
  { week: "Week 1", title: "Build the habit", body: "Fix a moment for the powder, do the first oiling on day 2, take your day-1 photo." },
  { week: "Week 2", title: "Calmer scalp", body: "Less itch and flaking is usually the first thing people notice." },
  { week: "Week 3", title: "Fewer strands in the brush", body: "Shedding settles. The tracker makes it visible." },
  { week: "Week 4", title: "Softer texture, new baby hairs", body: "Fine new growth at the hairline and hair that feels different to the touch." },
];

export function RoutineTimeline() {
  const reduce = useReducedMotion();
  return (
    <ol className="relative mt-14 grid gap-8 md:grid-cols-4">
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-5 hidden h-0.5 w-full origin-left bg-line md:block"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {weeks.map((w, i) => (
        <motion.li
          key={w.week}
          className="relative"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="relative z-10 grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-cream">
            {i + 1}
            <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-amla/40" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">{w.week}</p>
          <h3 className="font-display mt-1 text-2xl text-forest">{w.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone">{w.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
