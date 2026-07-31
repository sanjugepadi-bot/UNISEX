import { TRAINERS } from "../data";
import { Reveal } from "./Reveal";

export function Trainers() {
  return (
    <section
      id="trainers"
      className="relative scroll-mt-24 overflow-hidden bg-zinc-950 py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Our Trainers
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Coached By The Best
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((trainer, idx) => (
            <Reveal key={trainer.name} delay={idx * 0.08} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-red-600/40 hover:bg-white/[0.06] hover:shadow-[0_28px_60px_-20px_rgba(220,38,38,0.35)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-2xl font-black text-white ring-4 ring-white/5 transition-all duration-500 group-hover:scale-105 group-hover:ring-red-600/40 group-hover:shadow-[0_0_36px_-4px_rgba(220,38,38,0.8)]">
                  {trainer.initials}
                </div>
                <h3 className="relative mt-6 text-lg font-bold text-white">{trainer.name}</h3>
                <p className="relative mt-1 text-sm font-medium text-red-600">{trainer.role}</p>
                <p className="relative mt-3 text-sm leading-relaxed text-zinc-400">
                  {trainer.specialty}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
