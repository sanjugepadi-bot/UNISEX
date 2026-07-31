import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";
import { BUSINESS_INFO } from "../data";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-black py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.06] blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Contact
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Start Your Journey
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            Drop by, call, or message us on WhatsApp — our team will help you
            pick the right plan and book your free trial.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal direction="left" className="space-y-5">
            <a
              href={`tel:${BUSINESS_INFO.phoneTel}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_8px_24px_-6px_rgba(220,38,38,0.7)]">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Call Us</p>
                <p className="text-sm text-zinc-400">{BUSINESS_INFO.phoneDisplay}</p>
              </div>
            </a>

            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_8px_24px_-6px_rgba(220,38,38,0.7)]">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp</p>
                <p className="text-sm text-zinc-400">Chat with our team</p>
              </div>
            </a>

            <a
              href={BUSINESS_INFO.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-600/40 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-[0_8px_24px_-6px_rgba(220,38,38,0.7)]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Location</p>
                <p className="text-sm text-zinc-400">{BUSINESS_INFO.addressLine1}</p>
                <p className="text-sm text-zinc-400">{BUSINESS_INFO.addressLine2}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Hours</p>
                <p className="text-sm text-zinc-400">{BUSINESS_INFO.hoursNote}</p>
              </div>
            </div>

            <a
              href={BUSINESS_INFO.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="warrior-shimmer-sweep relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_16px_40px_-10px_rgba(220,38,38,0.85)]"
            >
              <Navigation size={16} />
              Get Directions
            </a>
          </Reveal>

          <Reveal direction="right">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title={`Google Map showing the location of ${BUSINESS_INFO.name}`}
                src={BUSINESS_INFO.mapEmbedUrl}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
