import { STATS } from "../data";
import { Reveal } from "./Reveal";
import { AnimatedCounter } from "./AnimatedCounter";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-700 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.3),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-5 px-6 lg:grid-cols-4 lg:px-10">
        {STATS.map((stat, idx) => (
          <Reveal key={stat.label} delay={idx * 0.08}>
            <div className="group rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 sm:p-8">
              <div className="text-4xl font-black tabular-nums text-white sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-red-100 sm:text-sm">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
