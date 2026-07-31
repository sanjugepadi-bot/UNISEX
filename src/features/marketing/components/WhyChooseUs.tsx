import { BUSINESS_INFO, WHY_CHOOSE_US } from "../data";
import { Reveal } from "./Reveal";
import { GlowOrbs } from "./GlowOrbs";

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 lg:py-32">
      <GlowOrbs variant="section" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Built Different.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Everything about {BUSINESS_INFO.name} is engineered around one goal:
            getting you measurable results, faster.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.08} className="h-full">
              <div className="group relative h-full rounded-2xl bg-gradient-to-b from-white/10 to-transparent p-px transition-all duration-500 hover:from-red-600/60 hover:to-transparent">
                <div className="relative h-full overflow-hidden rounded-2xl bg-zinc-950 p-8 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:bg-zinc-900/80">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-600/0 blur-2xl transition-all duration-500 group-hover:bg-red-600/20" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-600 ring-1 ring-red-600/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_8px_24px_-6px_rgba(220,38,38,0.7)]">
                    <item.icon size={22} />
                  </div>
                  <h3 className="relative mt-6 text-lg font-bold text-white">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
