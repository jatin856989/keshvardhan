import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Container } from "./Container";

export function PageIntro({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <Container className="pt-10 lg:pt-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display mt-3 text-balance text-4xl text-forest sm:text-5xl lg:text-6xl">{title}</h1>
        {lead ? <p className="mt-5 text-lg leading-relaxed text-stone">{lead}</p> : null}
        {children}
      </div>
    </Container>
  );
}
