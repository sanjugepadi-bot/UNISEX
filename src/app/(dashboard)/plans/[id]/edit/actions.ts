"use server";

import { revalidatePath } from "next/cache";
import { membershipPlanSchema, type MembershipPlanInput } from "@/validators/membershipPlan";
import { getCurrentUserProfile } from "@/services/profiles";
import { updatePlan } from "@/services/membershipPlans";
import type { PlanFormState } from "@/features/membership-plans/components/PlanForm";

export async function updatePlanAction(
  _prevState: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const planId = formData.get("planId");

  if (typeof planId !== "string" || !planId) {
    return { success: false, fieldErrors: {}, formError: "Missing plan reference." };
  }

  const raw = {
    planName: formData.get("planName"),
    durationValue: formData.get("durationValue"),
    durationUnit: formData.get("durationUnit"),
    price: formData.get("price"),
    description: formData.get("description"),
    isActive: formData.get("isActive") === "on",
  };

  const parsed = membershipPlanSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: PlanFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof MembershipPlanInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { data: profile, error: profileError } = await getCurrentUserProfile();

  if (profileError || !profile?.gymId) {
    return {
      success: false,
      fieldErrors: {},
      formError: "You must belong to a gym to manage plans.",
    };
  }

  if (profile.role !== "owner") {
    return { success: false, fieldErrors: {}, formError: "Only the gym owner can edit plans." };
  }

  const durationDays =
    parsed.data.durationUnit === "months"
      ? parsed.data.durationValue * 30
      : parsed.data.durationValue;

  const { error } = await updatePlan({
    id: planId,
    gymId: profile.gymId,
    planName: parsed.data.planName,
    durationDays,
    price: parsed.data.price,
    description: parsed.data.description,
    isActive: parsed.data.isActive,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath("/plans");
  return { success: true, fieldErrors: {}, formError: null };
}
