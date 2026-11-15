import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-stone ${className}`}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-semibold text-forest">
                  {c.name}
                </span>
              ) : (
                <Link href={c.href} className="hover:text-forest hover:underline">
                  {c.name}
                </Link>
              )}
              {!last ? <ChevronRight className="size-3.5 text-line" aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
