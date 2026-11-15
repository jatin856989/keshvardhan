import type { ReactNode } from "react";

export function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        <div className="flex gap-10">{children}</div>
        <div className="flex gap-10">{children}</div>
      </div>
    </div>
  );
}
