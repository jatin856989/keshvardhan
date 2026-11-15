import Link from "next/link";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="#1F3D2B" />
      <path
        d="M32 10c-2 10-10 14-14 24 0 10 6 18 14 20 8-2 14-10 14-20-4-10-12-14-14-24z"
        fill="#7FA650"
      />
      <path d="M32 18c6 8 10 12 10 18 0 7-4 13-10 15 2-6 2-22 0-33z" fill="#C9A227" opacity="0.9" />
      <path d="M32 22v32" stroke="#F6F1E7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Keshvardhan home">
      <LogoMark />
      <span className={`font-display text-2xl tracking-tight ${light ? "text-cream" : "text-forest"}`}>
        Keshvardhan
      </span>
    </Link>
  );
}
