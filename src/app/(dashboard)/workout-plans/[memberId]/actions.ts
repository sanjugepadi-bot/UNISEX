"use server";

import { revalidatePath } from "next/cache";
import { workoutPlanSchema, type WorkoutPlanInput } from "@/validators/workoutPlan";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById } from "@/services/members";
import { createWorkoutPlan } from "@/services/workoutPlans";
import { checkAiRateLimit } from "@/lib/aiRateLimit";
import type { WorkoutPlanFormState } from "@/features/workout-planner/components/WorkoutPlanForm";

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

export async function generateWorkoutPlanAction(
  _prevState: WorkoutPlanFormState,
  formData: FormData,
): Promise<WorkoutPlanFormState> {
  const raw = {
    memberId: formData.get("memberId"),
    fitnessGoal: formData.get("fitnessGoal"),
    experienceLevel: formData.get("experienceLevel"),
    workoutDaysPerWeek: formData.get("workoutDaysPerWeek"),
    workoutDurationMinutes: formData.get("workoutDurationMinutes"),
    availableEquipment: formData.getAll("availableEquipment"),
    medicalConditions: formData.get("medicalConditions"),
  };

  const parsed = workoutPlanSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: WorkoutPlanFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof WorkoutPlanInput | undefined;
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
      formError: "You must belong to a gym to generate workout plans.",
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

  const { error } = await createWorkoutPlan({
    gymId: profile.gymId,
    memberId: member.id,
    createdBy: profile.id,
    fitnessGoal: parsed.data.fitnessGoal,
    gender: member.gender,
    age: calculateAge(member.dateOfBirth),
    heightCm: member.height,
    weightKg: member.weight,
    experienceLevel: parsed.data.experienceLevel,
    workoutDaysPerWeek: parsed.data.workoutDaysPerWeek,
    workoutDurationMinutes: parsed.data.workoutDurationMinutes,
    availableEquipment: parsed.data.availableEquipment,
    medicalConditions: parsed.data.medicalConditions,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath(`/workout-plans/${member.id}`);
  return { success: true, fieldErrors: {}, formError: null };
}
