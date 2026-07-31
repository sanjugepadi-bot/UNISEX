import { ArrowUpRight } from "lucide-react";
import { PROGRAMS } from "../data";
import { Reveal } from "./Reveal";

export function Programs() {
  return (
    <section id="programs" className="scroll-mt-24 bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
              Our Programs
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Train With Purpose
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            Five specialized programs, one goal — helping every member reach
            theirs.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program, idx) => (
            <Reveal key={program.title} delay={idx * 0.06} className="h-full">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-zinc-950 p-8 transition-colors duration-500 hover:bg-zinc-900">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-black text-white/[0.03] transition-colors duration-500 group-hover:text-red-600/10"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-600">
                    {program.tag}
                  </span>
                  <h3 className="mt-4 text-2xl font-bold text-white">{program.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                    {program.description}
                  </p>
                </div>
                <div className="relative mt-8 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-red-600 group-hover:bg-red-600 group-hover:shadow-[0_8px_20px_-6px_rgba(220,38,38,0.7)]">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
