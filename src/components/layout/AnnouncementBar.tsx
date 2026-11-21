import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function AnnouncementBar() {
  const tel = siteConfig.supportPhone.replace(/\s/g, "");
  return (
    <div className="bg-forest text-[0.8rem] font-semibold tracking-wide text-cream">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-4 px-4 py-2 sm:px-6 md:justify-between lg:px-8">
        <p className="text-center">
          <span className="hidden sm:inline">Free shipping on orders above ₹999 · Free 30-day guide with every order</span>
          <span className="sm:hidden">Free shipping above ₹999 · Free 30-day guide</span>
        </p>
        <ul className="hidden items-center gap-5 md:flex" aria-label="Contact">
          <li>
            <a href={`tel:${tel}`} className="flex items-center gap-1.5 transition hover:text-gold">
              <Phone className="size-3.5" aria-hidden="true" /> {siteConfig.supportPhone}
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 transition hover:text-gold">
              <Mail className="size-3.5" aria-hidden="true" /> {siteConfig.email}
            </a>
          </li>
          <li>
            <Link href="/contact" className="rounded-full bg-cream/15 px-3 py-1 transition hover:bg-cream hover:text-forest">
              Contact us
            </Link>
          </li>
        </ul>
        <Link href="/contact" className="shrink-0 rounded-full bg-cream/15 px-3 py-1 transition hover:bg-cream hover:text-forest md:hidden">
          Contact us
        </Link>
      </div>
    </div>
  );
}
