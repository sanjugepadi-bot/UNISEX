import Image from "next/image";
import heroImage from "@/assets/images/warrior-hero.jpg";
import trainingImage from "@/assets/images/warrior-training.jpg";
import cardioImage from "@/assets/images/warrior-cardio.jpg";
import { BUSINESS_INFO } from "../data";
import { Reveal } from "./Reveal";

const GALLERY_ITEMS = [
  {
    image: heroImage,
    alt: `Suspension training rig at ${BUSINESS_INFO.name}`,
    caption: "The Rig",
    className: "lg:row-span-2",
  },
  {
    image: trainingImage,
    alt: "Functional trainer station in the main gym floor",
    caption: "The Floor",
  },
  {
    image: cardioImage,
    alt: "Cardio corner with treadmill, bike, and elliptical",
    caption: "The Cardio Zone",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600">
            Gallery
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Inside {BUSINESS_INFO.name}
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-2">
          {GALLERY_ITEMS.map((item, idx) => (
            <Reveal
              key={item.alt}
              delay={idx * 0.08}
              className={`relative h-full min-h-[280px] overflow-hidden rounded-2xl ${item.className ?? ""}`}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_-16px_rgba(0,0,0,0.7)]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition-all duration-300 group-hover:ring-red-600/40" />

                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white">
                    <span className="h-px w-6 bg-red-600" />
                    {item.caption}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
