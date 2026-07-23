import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getWorkoutPlanById } from "@/services/workoutPlans";
import { RegenerateButton } from "./RegenerateButton";

export const metadata: Metadata = {
  title: "Workout Plan",
};

interface WorkoutPlanDetailPageProps {
  params: Promise<{ memberId: string; planId: string }>;
}

export default async function WorkoutPlanDetailPage({ params }: WorkoutPlanDetailPageProps) {
  const { memberId, planId } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: plan } = await getWorkoutPlanById(planId, profile.gymId);
  if (!plan || plan.memberId !== memberId) {
    notFound();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{plan.fitnessGoal}</h1>
          <p className="text-sm text-gray-500">
            Generated {new Date(plan.createdAt).toLocaleString()}
          </p>
        </div>
        <RegenerateButton planId={plan.id} memberId={memberId} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-700">{plan.planContent.summary}</p>

        <div className="mt-4 flex flex-col gap-4">
          {plan.planContent.days.map((day) => (
            <div key={day.day}>
              <p className="text-sm font-medium text-gray-900">
                {day.day} — {day.focus}
              </p>
              <ul className="mt-1 flex flex-col gap-1">
                {day.exercises.map((exercise) => (
                  <li key={exercise.name} className="text-sm text-gray-600">
                    {exercise.name} — {exercise.sets} sets × {exercise.reps}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {plan.planContent.notes.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-400">NOTES</p>
            <ul className="mt-1 flex flex-col gap-1">
              {plan.planContent.notes.map((note, index) => (
                <li key={index} className="text-xs text-gray-600">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Generated from: {plan.gender ?? "—"}, {plan.age ?? "—"} yrs, {plan.heightCm ?? "—"} cm,{" "}
        {plan.weightKg ?? "—"} kg, {plan.experienceLevel}, {plan.workoutDaysPerWeek} days/week,{" "}
        {plan.workoutDurationMinutes} min sessions
        {plan.availableEquipment.length > 0 &&
          `, equipment: ${plan.availableEquipment.join(", ")}`}
        {plan.medicalConditions && `. Medical notes: ${plan.medicalConditions}`}
      </div>
    </div>
  );
}
