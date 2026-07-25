import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getActivePlans } from "@/services/membershipPlans";
import { AddMemberForm } from "./AddMemberForm";
import { createMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Add member",
};

export default async function NewMemberPage() {
  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: plans } = await getActivePlans(profile.gymId);

  return <AddMemberForm action={createMemberAction} plans={plans ?? []} />;
}
