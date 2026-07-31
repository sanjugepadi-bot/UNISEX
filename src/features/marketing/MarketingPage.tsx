import { MotionConfig } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Programs } from "./components/Programs";
import { Trainers } from "./components/Trainers";
import { MembershipPlans } from "./components/MembershipPlans";
import { Stats } from "./components/Stats";
import { Testimonials } from "./components/Testimonials";
import { Gallery } from "./components/Gallery";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { Preloader } from "./components/Preloader";
import { BackToTop } from "./components/BackToTop";
import { Divider } from "./components/Divider";
import { StickyContactButtons } from "./components/StickyContactButtons";
import { BUSINESS_INFO } from "./data";

const GYM_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: BUSINESS_INFO.name,
  description:
    "Premium strength and fitness studio in Jonai, Assam offering strength training, weight loss, bodybuilding, CrossFit, and personal training programs.",
  image: "/opengraph-image",
  telephone: BUSINESS_INFO.phoneTel,
  priceRange: "₹₹",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${BUSINESS_INFO.addressLine1}, ${BUSINESS_INFO.addressLine2}`,
    addressLocality: BUSINESS_INFO.locality,
    addressRegion: BUSINESS_INFO.region,
    postalCode: BUSINESS_INFO.postalCode,
    addressCountry: BUSINESS_INFO.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS_INFO.latitude,
    longitude: BUSINESS_INFO.longitude,
  },
  hasMap: BUSINESS_INFO.directionsUrl,
  sameAs: [BUSINESS_INFO.instagramUrl],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: BUSINESS_INFO.rating,
    reviewCount: BUSINESS_INFO.reviewCount,
  },
  openingHoursSpecification: BUSINESS_INFO.hoursSpecification.map((spec) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: spec.days,
    opens: spec.opens,
    closes: spec.closes,
  })),
};

export function MarketingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="warrior-scope overflow-x-hidden bg-black text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GYM_SCHEMA) }}
        />
        <Preloader />
        <ScrollProgressBar />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">
          <Hero />
          <About />
          <Divider />
          <WhyChooseUs />
          <Programs />
          <Divider />
          <Trainers />
          <MembershipPlans />
          <Stats />
          <Testimonials />
          <Divider />
          <Gallery />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <StickyContactButtons />
      </div>
    </MotionConfig>
  );
}
