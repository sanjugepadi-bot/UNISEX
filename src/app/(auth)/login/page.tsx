import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your gym dashboard",
};

export default async function LoginPage() {
  const { data: profile } = await getCurrentUserProfile();

  if (profile) {
    redirect(profile.gymId ? "/dashboard" : "/onboarding");
  }

  return <LoginForm />;
}
