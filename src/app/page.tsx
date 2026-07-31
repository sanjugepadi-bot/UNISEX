import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { MarketingPage } from "@/features/marketing/MarketingPage";
import { BUSINESS_INFO } from "@/features/marketing/data";

const TITLE = `${BUSINESS_INFO.name} | Premium Strength & Fitness Studio in ${BUSINESS_INFO.locality}, ${BUSINESS_INFO.region}`;
const DESCRIPTION = `Elite equipment, certified coaches, and programs in strength training, weight loss, bodybuilding, CrossFit, and personal training at ${BUSINESS_INFO.name} in ${BUSINESS_INFO.locality}, ${BUSINESS_INFO.region}. Rated ${BUSINESS_INFO.rating}★. Book your free trial today.`;
const SHORT_DESCRIPTION = `Elite equipment, certified coaches, and programs built for people who refuse to settle for average. ${BUSINESS_INFO.name}, ${BUSINESS_INFO.locality}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: SHORT_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SHORT_DESCRIPTION,
  },
};

export default async function Home() {
  const { data: profile } = await getCurrentUserProfile();

  if (profile) {
    redirect(profile.gymId ? "/dashboard" : "/onboarding");
  }

  return <MarketingPage />;
}
