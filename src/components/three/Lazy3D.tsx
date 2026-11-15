"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
const ProductViewerScene = dynamic(() => import("./ProductViewerScene"), { ssr: false });

/**
 * Decides whether to load WebGL at all. The 3D bundle is only requested when
 * the container is near the viewport, the user has not asked for reduced
 * motion, and the device looks capable. Otherwise the static image stays,
 * so the page is never blank and the LCP element is always a real image.
 */
function useShould3D(ref: React.RefObject<HTMLElement | null>) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = (navigator.hardwareConcurrency ?? 4) <= 2;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || lowEnd || saveData) return;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return;
    // Start WebGL only once the main thread is idle, so hydration and
    // interactivity are never delayed by the render loop on slower devices.
    let idleHandle: number | undefined;
    let cancelled = false;
    const whenIdle = (cb: () => void) => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (ric) idleHandle = ric(cb, { timeout: 2500 });
      else idleHandle = window.setTimeout(cb, 600);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          whenIdle(() => {
            if (!cancelled) setReady(true);
          });
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (idleHandle !== undefined) {
        const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
        if (cic) cic(idleHandle);
        else window.clearTimeout(idleHandle);
      }
    };
  }, [ref]);
  return ready;
}

export function HeroVisual({ fallback }: { fallback: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const show3D = useShould3D(ref);
  return (
    <div ref={ref} className="relative aspect-square w-full max-w-[640px]">
      <div className={`absolute inset-0 transition-opacity duration-700 ${show3D ? "opacity-0" : "opacity-100"}`}>
        {fallback}
      </div>
      {show3D ? (
        <div className="absolute inset-0 animate-[fadeIn_0.8s_ease]">
          <HeroScene />
        </div>
      ) : null}
    </div>
  );
}

export function ProductViewer({
  kind,
  image,
}: {
  kind: "powder" | "oil" | "bundle";
  image: { src: string; alt: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const show3D = useShould3D(ref);
  // The user's explicit choice wins; otherwise default to 3D once it is available.
  const [userMode, setMode] = useState<"photo" | "3d" | null>(null);
  const mode: "photo" | "3d" = userMode ?? (show3D ? "3d" : "photo");
  return (
    <div ref={ref} className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-50">
      <Image
        src={image.src}
        alt={image.alt}
        width={1200}
        height={1200}
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={`h-full w-full object-cover transition-opacity duration-500 ${mode === "3d" ? "opacity-0" : "opacity-100"}`}
      />
      {show3D && mode === "3d" ? (
        <div className="absolute inset-0">
          <ProductViewerScene kind={kind} />
        </div>
      ) : null}
      {show3D ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/85 p-1 text-xs font-semibold shadow-soft backdrop-blur">
          <button
            type="button"
            onClick={() => setMode("photo")}
            aria-pressed={mode === "photo"}
            className={`rounded-full px-3 py-1.5 ${mode === "photo" ? "bg-forest text-cream" : "text-forest"}`}
          >
            Photo
          </button>
          <button
            type="button"
            onClick={() => setMode("3d")}
            aria-pressed={mode === "3d"}
            className={`rounded-full px-3 py-1.5 ${mode === "3d" ? "bg-forest text-cream" : "text-forest"}`}
          >
            3D view
          </button>
        </div>
      ) : null}
      {show3D && mode === "3d" ? (
        <p className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[0.7rem] font-semibold text-stone backdrop-blur">
          Drag to rotate
        </p>
      ) : null}
    </div>
  );
}
