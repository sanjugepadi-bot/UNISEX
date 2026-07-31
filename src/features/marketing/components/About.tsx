import Image from "next/image";
import trainingImage from "@/assets/images/about-athlete.jpg";
import { ABOUT_HIGHLIGHTS, BUSINESS_INFO } from "../data";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 bg-black py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal direction="left">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-red-600/20 via-transparent to-transparent blur-2xl" />
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
              <Image
                src={trainingImage}
                alt="Focused athlete training with intense discipline and strength"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-red-950/10 mix-blend-multiply" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

            <div className="absolute -bottom-6 -right-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/80 p-5 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:-right-8 sm:p-6">
              <div className="text-3xl font-black text-red-600 sm:text-4xl">8+</div>
              <div className="max-w-[7rem] text-xs font-medium uppercase leading-snug tracking-wide text-zinc-300">
                Years Forging Strength
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-red-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
              About {BUSINESS_INFO.name}
            </span>
          </div>
          <h2 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
            Not a gym.
            <br />A training ground.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400">
            {BUSINESS_INFO.name} was built for people in {BUSINESS_INFO.locality} chasing
            real results — not just a membership card. Every rack, machine, and coach on
            our floor exists for one purpose: to help you become stronger than you were
            yesterday.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ABOUT_HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-4 rounded-xl p-3 -m-3 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 ring-1 ring-red-600/20 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:ring-red-600">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
