"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal without hiding content from anyone who cannot run JS.
 *
 * Server HTML renders fully visible. CSS hides `.reveal` elements only inside
 * `@media (scripting: enabled)`, until this hook marks them `in`. Crawlers,
 * no-JS users and older browsers always get visible content; everyone else
 * gets the animation, and nothing is mutated on <html> before hydration.
 */
function useInViewOnce<T extends HTMLElement>(margin = "0px 0px -5% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    // If the user already scrolled before hydration finished, show everything
    // up to the current viewport immediately instead of animating it late.
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || (window.scrollY > 0 && rect.top < window.innerHeight)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0 },
    );
    io.observe(el);
    // Fail-safe: nothing stays hidden for long even if an observation is missed
    // (fast programmatic scrolling, print, screenshots, unusual scroll containers).
    const fallback = window.setTimeout(() => setInView(true), 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [margin, inView]);
  return { ref, inView };
}

type Tag = "div" | "section" | "li" | "article" | "span" | "ul" | "ol";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: Tag;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const Comp = as as "div";
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Comp>
  );
}

export function Stagger({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const Comp = as as "div";
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={`stagger ${inView ? "in" : ""} ${className}`}>
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const Comp = as as "div";
  return <Comp className={`stagger-item ${className}`}>{children}</Comp>;
}
