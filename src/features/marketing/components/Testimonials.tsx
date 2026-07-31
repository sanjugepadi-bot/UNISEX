import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section className="bg-zinc-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Real Results, Real Words
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, idx) => (
            <Reveal key={testimonial.name} delay={idx * 0.1} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-white/10 to-transparent p-px transition-all duration-500 hover:from-red-600/50">
                <div className="relative flex h-full flex-col rounded-2xl bg-zinc-950 p-8 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:bg-zinc-900/80">
                  <Quote
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 text-white/[0.04]"
                    size={110}
                    strokeWidth={1}
                  />

                  <div className="relative flex gap-0.5 text-red-500">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star key={starIdx} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>

                  <p className="relative mt-5 flex-1 text-sm leading-relaxed text-zinc-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="relative mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-xs font-bold text-white">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-zinc-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
