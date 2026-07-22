import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getPlanById } from "@/services/membershipPlans";
import { PlanForm } from "@/features/membership-plans/components/PlanForm";
import { updatePlanAction } from "./actions";

export const metadata: Metadata = {
  title: "Edit plan",
};

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: plan } = await getPlanById(id, profile.gymId);
  if (!plan) {
    notFound();
  }

  return (
    <PlanForm
      action={updatePlanAction}
      defaultValues={plan}
      planId={plan.id}
      submitLabel="Save changes"
      title="Edit plan"
    />
  );
}
