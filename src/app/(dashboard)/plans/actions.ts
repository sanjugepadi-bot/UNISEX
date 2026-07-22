"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/services/profiles";
import { deletePlan } from "@/services/membershipPlans";

export async function deletePlanAction(formData: FormData): Promise<void> {
  const planId = formData.get("planId");

  if (typeof planId !== "string" || !planId) {
    return;
  }

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    return;
  }

  const { error } = await deletePlan(planId, profile.gymId);
  if (error) {
    console.error("[deletePlanAction]", error);
  }

  revalidatePath("/plans");
}
