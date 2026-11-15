"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * Accessible FAQ accordion. All answers are in the server HTML (hidden via
 * CSS when closed) so search engines can read them.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-forest transition hover:bg-cream-50"
              >
                <span>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-forest"
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-[0.98rem] leading-relaxed text-stone">{item.answer}</p>
                </motion.div>
              ) : (
                <p id={panelId} className="sr-only" aria-labelledby={buttonId}>
                  {item.answer}
                </p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
