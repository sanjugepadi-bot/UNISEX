"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "../data";
import { Reveal } from "./Reveal";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            FAQ
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Common Questions
          </h2>
        </Reveal>

        <div className="mt-14 space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Reveal key={item.question} delay={idx * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white/[0.03] transition-colors duration-300 ${
                    isOpen ? "border-red-600/40 bg-white/[0.05]" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-base font-semibold transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-zinc-200"
                      }`}
                    >
                      {item.question}
                    </span>
                    <motion.span
                      animate={{
                        rotate: isOpen ? 45 : 0,
                        backgroundColor: isOpen ? "#dc2626" : "rgba(220,38,38,0.1)",
                        color: isOpen ? "#ffffff" : "#dc2626",
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mx-6 mb-5 border-l-2 border-red-600/50 pl-4 text-sm leading-relaxed text-zinc-400">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
