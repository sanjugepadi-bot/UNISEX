import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { Target, StickyNote, Info } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getWorkoutPlanById } from "@/services/workoutPlans";
import { Card } from "@/components/ui/Card";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-h2 font-semibold text-foreground">{plan.fitnessGoal}</h1>
            <p className="text-sm text-muted-foreground">
              Generated {new Date(plan.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <RegenerateButton planId={plan.id} memberId={memberId} />
      </div>

      <Card title="Summary">
        <p className="text-sm text-foreground">{plan.planContent.summary}</p>
      </Card>

      <div className="flex flex-col gap-4">
        {plan.planContent.days.map((day) => (
          <Card key={day.day} title={`${day.day} — ${day.focus}`}>
            <ul className="flex flex-col gap-2">
              {day.exercises.map((exercise) => (
                <li
                  key={exercise.name}
                  className="flex items-center justify-between border-t border-border pt-2 text-sm first:border-t-0 first:pt-0"
                >
                  <span className="text-foreground">{exercise.name}</span>
                  <span className="text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {plan.planContent.notes.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Notes
            </p>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {plan.planContent.notes.map((note, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex items-start gap-3 rounded-surface border border-border bg-background px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">
          Generated from: {plan.gender ?? "—"}, {plan.age ?? "—"} yrs, {plan.heightCm ?? "—"} cm,{" "}
          {plan.weightKg ?? "—"} kg, {plan.experienceLevel}, {plan.workoutDaysPerWeek} days/week,{" "}
          {plan.workoutDurationMinutes} min sessions
          {plan.availableEquipment.length > 0 &&
            `, equipment: ${plan.availableEquipment.join(", ")}`}
          {plan.medicalConditions && `. Medical notes: ${plan.medicalConditions}`}
        </p>
      </div>
    </div>
  );
}
