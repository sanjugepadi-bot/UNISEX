"use server";

import { revalidatePath } from "next/cache";
import { dietPlanSchema, type DietPlanInput } from "@/validators/dietPlan";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById } from "@/services/members";
import { createDietPlan } from "@/services/dietPlans";
import { checkAiRateLimit } from "@/lib/aiRateLimit";
import type { DietPlanFormState } from "@/features/diet-planner/components/DietPlanForm";

function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dob.getUTCDate())) {
    age -= 1;
  }
  return age;
}

export async function generateDietPlanAction(
  _prevState: DietPlanFormState,
  formData: FormData,
): Promise<DietPlanFormState> {
  const raw = {
    memberId: formData.get("memberId"),
    dietaryGoal: formData.get("dietaryGoal"),
    dietaryPreference: formData.get("dietaryPreference"),
    activityLevel: formData.get("activityLevel"),
    dailyCalorieTarget: formData.get("dailyCalorieTarget"),
    mealCount: formData.get("mealCount"),
    budgetPreference: formData.get("budgetPreference"),
    preferredCuisine: formData.get("preferredCuisine"),
    dislikedFoods: formData.get("dislikedFoods"),
    allergies: formData.get("allergies"),
    medicalConditions: formData.get("medicalConditions"),
    supplements: formData.get("supplements"),
  };

  const parsed = dietPlanSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: DietPlanFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof DietPlanInput | undefined;
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
      formError: "You must belong to a gym to generate diet plans.",
    };
  }

  const rateLimitResult = await checkAiRateLimit(profile.gymId);
  if (!rateLimitResult.allowed) {
    return { success: false, fieldErrors: {}, formError: rateLimitResult.error };
  }

  const { data: member, error: memberError } = await getMemberById(
    parsed.data.memberId,
    profile.gymId,
  );
  if (memberError || !member) {
    return { success: false, fieldErrors: {}, formError: "Member not found." };
  }

  const { error } = await createDietPlan({
    gymId: profile.gymId,
    memberId: member.id,
    createdBy: profile.id,
    dietaryGoal: parsed.data.dietaryGoal,
    dietaryPreference: parsed.data.dietaryPreference,
    activityLevel: parsed.data.activityLevel,
    gender: member.gender,
    age: calculateAge(member.dateOfBirth),
    heightCm: member.height,
    weightKg: member.weight,
    dailyCalorieTarget: parsed.data.dailyCalorieTarget,
    mealCount: parsed.data.mealCount,
    budgetPreference: parsed.data.budgetPreference,
    preferredCuisine: parsed.data.preferredCuisine,
    dislikedFoods: parsed.data.dislikedFoods,
    allergies: parsed.data.allergies,
    medicalConditions: parsed.data.medicalConditions,
    supplements: parsed.data.supplements,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath(`/diet-plans/${member.id}`);
  return { success: true, fieldErrors: {}, formError: null };
}
