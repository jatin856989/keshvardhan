import Link from "next/link";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./SocialIcons";
import { footerLinks, siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { WaitlistForm } from "@/components/home/WaitlistForm";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest text-cream">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
              {siteConfig.tagline}. An inside-out hair routine made in India from plants Indian
              households have trusted for generations.
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold">Get launch offers and updates</p>
              <WaitlistForm source="footer" compact />
            </div>
          </div>
          <FooterColumn title="Shop" links={footerLinks.shop} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Help" links={footerLinks.legal} />
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t border-cream/15 pt-8 text-sm text-cream/70 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {siteConfig.legalName}. All rights reserved.
            </p>
            <p>
              {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} ·{" "}
              <a href={`mailto:${siteConfig.email}`} className="hover:text-cream hover:underline">
                {siteConfig.email}
              </a>
              {siteConfig.gstin ? ` · GSTIN ${siteConfig.gstin}` : null}
              {siteConfig.fssaiLicense ? ` · FSSAI Lic. ${siteConfig.fssaiLicense}` : null}
            </p>
          </div>
          <ul className="flex items-center gap-3">
            <li>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Keshvardhan on Instagram" className="grid size-10 place-items-center rounded-full border border-cream/20 transition hover:bg-cream hover:text-forest">
                <InstagramIcon className="size-4" />
              </a>
            </li>
            <li>
              <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Keshvardhan on YouTube" className="grid size-10 place-items-center rounded-full border border-cream/20 transition hover:bg-cream hover:text-forest">
                <YoutubeIcon className="size-4" />
              </a>
            </li>
            <li>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Keshvardhan on Facebook" className="grid size-10 place-items-center rounded-full border border-cream/20 transition hover:bg-cream hover:text-forest">
                <FacebookIcon className="size-4" />
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-cream/50">
          Daily Root Powder is a food product and Root Ritual Oil is a cosmetic. Neither is intended to
          diagnose, treat, cure or prevent any disease. Results vary. Consult a doctor if you are pregnant,
          breastfeeding or on medication.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-cream/60">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-cream/85 transition hover:text-cream hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
