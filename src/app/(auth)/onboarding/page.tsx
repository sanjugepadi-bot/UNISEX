import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Set up your gym",
  description: "Create your gym profile to get started",
};

export default async function OnboardingPage() {
  const { data: profile, error } = await getCurrentUserProfile();

  if (error || !profile) {
    redirect("/login");
  }

  if (profile.gymId) {
    redirect("/dashboard");
  }

  return <OnboardingForm />;
}
