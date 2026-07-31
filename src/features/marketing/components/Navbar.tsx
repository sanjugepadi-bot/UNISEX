"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BUSINESS_INFO, NAV_LINKS } from "../data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const background = useTransform(
    scrollY,
    [0, 160],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.82)"],
  );
  const blur = useTransform(scrollY, [0, 160], [0, 14]);
  const backdropFilter = useTransform(blur, (v) => `blur(${v}px)`);
  const borderOpacity = useTransform(scrollY, [0, 160], [0, 1]);
  const borderColor = useTransform(borderOpacity, (v) => `rgba(255,255,255,${v * 0.08})`);

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      style={{ backgroundColor: background, backdropFilter, borderBottomColor: borderColor }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-shadow duration-500 ${
        scrolled ? "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)]" : "shadow-none"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="#home"
          className="group flex items-baseline gap-1 text-white transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="text-xl font-black tracking-tight">{BUSINESS_INFO.shortName.primary}</span>
          <span className="relative text-xl font-black tracking-tight text-red-600">
            {BUSINESS_INFO.shortName.secondary}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium tracking-wide text-zinc-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-red-600 transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href="#membership"
            className="warrior-shimmer-sweep relative overflow-hidden rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_8px_28px_-6px_rgba(220,38,38,0.75)]"
          >
            Book Trial
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="relative z-10 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <X size={26} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <Menu size={26} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-6 pt-4">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#membership"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: NAV_LINKS.length * 0.04 }}
                className="mt-2 rounded-full bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white"
              >
                Book Trial
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
