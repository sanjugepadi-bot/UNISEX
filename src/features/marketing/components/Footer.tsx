import Link from "next/link";
import { BUSINESS_INFO, NAV_LINKS } from "../data";

const SOCIAL_LINKS = [{ label: "Instagram", initials: "IG", href: BUSINESS_INFO.instagramUrl }];

export function Footer() {
  return (
    <footer className="relative bg-black py-14">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <Link
              href="#home"
              className="group flex items-baseline justify-center gap-1 transition-transform duration-300 hover:scale-[1.03] sm:justify-start"
            >
              <span className="text-xl font-black tracking-tight text-white">
                {BUSINESS_INFO.shortName.primary}
              </span>
              <span className="text-xl font-black tracking-tight text-red-600">
                {BUSINESS_INFO.shortName.secondary}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              A premium strength &amp; fitness studio in {BUSINESS_INFO.locality},{" "}
              {BUSINESS_INFO.region} — built for people who refuse to settle for average.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              {BUSINESS_INFO.addressLine1}
              <br />
              {BUSINESS_INFO.addressLine2}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-6 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xs font-semibold text-zinc-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600/50 hover:text-red-500 hover:shadow-[0_8px_20px_-8px_rgba(220,38,38,0.6)]"
              >
                {social.initials}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
