"use server";

import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getWorkoutPlanById, createWorkoutPlan } from "@/services/workoutPlans";

export async function regenerateWorkoutPlanAction(formData: FormData): Promise<void> {
  const planId = formData.get("planId");
  const memberId = formData.get("memberId");

  if (typeof planId !== "string" || typeof memberId !== "string" || !planId || !memberId) {
    return;
  }

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    return;
  }

  const { data: existingPlan, error: existingError } = await getWorkoutPlanById(
    planId,
    profile.gymId,
  );
  if (existingError || !existingPlan) {
    return;
  }

  const { data: newPlan, error } = await createWorkoutPlan({
    gymId: profile.gymId,
    memberId: existingPlan.memberId,
    createdBy: profile.id,
    fitnessGoal: existingPlan.fitnessGoal,
    gender: existingPlan.gender,
    age: existingPlan.age,
    heightCm: existingPlan.heightCm,
    weightKg: existingPlan.weightKg,
    experienceLevel: existingPlan.experienceLevel,
    workoutDaysPerWeek: existingPlan.workoutDaysPerWeek,
    workoutDurationMinutes: existingPlan.workoutDurationMinutes,
    availableEquipment: existingPlan.availableEquipment,
    medicalConditions: existingPlan.medicalConditions ?? undefined,
  });

  if (error || !newPlan) {
    console.error("[regenerateWorkoutPlanAction]", error);
    return;
  }

  redirect(`/workout-plans/${memberId}/${newPlan.id}`);
}
