"use server";

import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getDietPlanById, createDietPlan } from "@/services/dietPlans";

export async function regenerateDietPlanAction(formData: FormData): Promise<void> {
  const planId = formData.get("planId");
  const memberId = formData.get("memberId");

  if (typeof planId !== "string" || typeof memberId !== "string" || !planId || !memberId) {
    return;
  }

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    return;
  }

  const { data: existingPlan, error: existingError } = await getDietPlanById(
    planId,
    profile.gymId,
  );
  if (existingError || !existingPlan) {
    return;
  }

  const { data: newPlan, error } = await createDietPlan({
    gymId: profile.gymId,
    memberId: existingPlan.memberId,
    createdBy: profile.id,
    dietaryGoal: existingPlan.dietaryGoal,
    dietaryPreference: existingPlan.dietaryPreference,
    activityLevel: existingPlan.activityLevel,
    gender: existingPlan.gender,
    age: existingPlan.age,
    heightCm: existingPlan.heightCm,
    weightKg: existingPlan.weightKg,
    dailyCalorieTarget: existingPlan.dailyCalorieTarget ?? undefined,
    mealCount: existingPlan.mealCount,
    budgetPreference: existingPlan.budgetPreference ?? undefined,
    preferredCuisine: existingPlan.preferredCuisine ?? undefined,
    dislikedFoods: existingPlan.dislikedFoods ?? undefined,
    allergies: existingPlan.allergies ?? undefined,
    medicalConditions: existingPlan.medicalConditions ?? undefined,
    supplements: existingPlan.supplements ?? undefined,
  });

  if (error || !newPlan) {
    console.error("[regenerateDietPlanAction]", error);
    return;
  }

  redirect(`/diet-plans/${memberId}/${newPlan.id}`);
}
