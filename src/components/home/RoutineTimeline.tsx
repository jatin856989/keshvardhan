"use client";

import { motion, useReducedMotion } from "motion/react";

const weeks = [
  { week: "Week 1", title: "Build the habit", body: "Fix a moment for the powder, do the first oiling on day 2, take your day-1 photo." },
  { week: "Week 2", title: "Check in on your scalp", body: "Rate how it feels from 1 to 5 each Sunday and write one line about it." },
  { week: "Week 3", title: "Count the brush", body: "After 20 strokes, count the strands. Same brush, same time, every Sunday." },
  { week: "Week 4", title: "Compare day 1 and day 28", body: "Put your day-1 photo next to today's and look at your parting and texture." },
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
