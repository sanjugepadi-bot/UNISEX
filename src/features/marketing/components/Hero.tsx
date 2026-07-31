"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ShieldCheck, Star, Users } from "lucide-react";
import heroImage from "@/assets/images/hero-studio.jpg";
import { BUSINESS_INFO, STATS } from "../data";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlowOrbs } from "./GlowOrbs";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Certified Coaches" },
  { icon: Users, label: "500+ Members Trained" },
  { icon: Star, label: `${BUSINESS_INFO.rating}★ Rated (${BUSINESS_INFO.reviewCount} Reviews)` },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Symmetrical premium fitness studio bathed in dramatic cinematic lighting"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-transparent mix-blend-color" />
      <div className="absolute inset-0 bg-red-950/10 mix-blend-multiply" />
      <div className="warrior-grain absolute inset-0 opacity-[0.06]" />

      <GlowOrbs variant="hero" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 lg:px-10"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-500 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          {BUSINESS_INFO.name} · {BUSINESS_INFO.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="max-w-3xl text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[1.02] tracking-tight text-white"
        >
          UNLEASH THE
          <br />
          <span className="warrior-gradient-text">WARRIOR</span> WITHIN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300"
        >
          Elite equipment. Certified coaches. A training environment built for
          people who refuse to settle for average. This is where strength is
          forged.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#membership"
            className="warrior-shimmer-sweep group relative overflow-hidden rounded-full bg-red-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_40px_-10px_rgba(220,38,38,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_16px_48px_-8px_rgba(220,38,38,0.85)]"
          >
            Book Free Trial
          </a>
          <a
            href="#programs"
            className="group relative overflow-hidden rounded-full border border-white/25 bg-white/5 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
          >
            Explore Programs
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-8"
        >
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-zinc-300">
              <badge.icon size={18} className="text-red-500" />
              <span className="text-xs font-medium uppercase tracking-wide">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-left">
              <div className="text-2xl font-black tabular-nums text-white sm:text-3xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wide text-zinc-400 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown size={22} />
      </motion.a>
    </section>
  );
}
