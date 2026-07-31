import { Check } from "lucide-react";
import { MEMBERSHIP_PLANS } from "../data";
import { Reveal } from "./Reveal";

export function MembershipPlans() {
  return (
    <section
      id="membership"
      className="relative scroll-mt-24 overflow-hidden bg-black py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-red-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Membership
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Simple, transparent pricing. No lock-in contracts, no hidden fees.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          {MEMBERSHIP_PLANS.map((plan, idx) => (
            <Reveal key={plan.name} delay={idx * 0.1} className="h-full">
              <div
                className={`group relative flex h-full flex-col rounded-2xl p-8 transition-all duration-500 ${
                  plan.featured
                    ? "border border-red-600/60 bg-gradient-to-b from-red-600/[0.12] to-transparent shadow-[0_32px_80px_-20px_rgba(220,38,38,0.45)] hover:shadow-[0_40px_96px_-16px_rgba(220,38,38,0.6)] lg:scale-[1.06] lg:hover:scale-[1.075]"
                    : "border border-white/10 bg-white/[0.03] hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-red-500/30 via-transparent to-transparent opacity-60" />
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_-4px_rgba(220,38,38,0.8)]">
                      Most Popular
                    </span>
                  </>
                )}

                <h3 className="relative text-xl font-bold text-white">{plan.name}</h3>
                <p className="relative mt-2 text-sm text-zinc-400">{plan.description}</p>

                <div className="relative mt-6 flex items-baseline gap-1">
                  <span className="text-lg font-semibold text-zinc-400">₹</span>
                  <span className="text-4xl font-black tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-400">{plan.period}</span>
                </div>

                <ul className="relative mt-8 flex-1 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/15 text-red-500 ring-1 ring-red-600/30">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`warrior-shimmer-sweep relative mt-8 overflow-hidden rounded-full px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
                    plan.featured
                      ? "bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_16px_40px_-10px_rgba(220,38,38,0.85)]"
                      : "border border-white/20 text-white hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5"
                  }`}
                >
                  Get Started
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
