"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FITNESS_GOALS,
  EXPERIENCE_LEVELS,
  EQUIPMENT_OPTIONS,
  type WorkoutPlanInput,
} from "@/validators/workoutPlan";
import type { Member } from "@/services/members";

export interface WorkoutPlanFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof WorkoutPlanInput, string>>;
  formError: string | null;
}

const emptyState: WorkoutPlanFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

interface WorkoutPlanFormProps {
  action: (prevState: WorkoutPlanFormState, formData: FormData) => Promise<WorkoutPlanFormState>;
  member: Member;
}

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const sectionLabelClassName = "text-caption font-semibold uppercase tracking-wide text-muted-foreground";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

export function WorkoutPlanForm({ action, member }: WorkoutPlanFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Card title="Generate workout plan" description="Create an AI-powered plan for this member.">
      <div className="mb-5 rounded-control border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground">
        Using {member.fullName}&apos;s profile: {member.gender ?? "gender not set"},{" "}
        {member.dateOfBirth ? "DOB on file" : "DOB not set"}, {member.height ?? "—"} cm,{" "}
        {member.weight ?? "—"} kg.
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="memberId" value={member.id} />

        {state.formError && (
          <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
            <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            <p role="alert" className="text-sm text-danger">
              {state.formError}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Goal &amp; experience</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="fitnessGoal" className={fieldLabelClassName}>
                Fitness goal
              </label>
              <select id="fitnessGoal" name="fitnessGoal" className={selectClassName}>
                {FITNESS_GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
              {state.fieldErrors.fitnessGoal && (
                <p className="text-xs text-danger">{state.fieldErrors.fitnessGoal}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="experienceLevel" className={fieldLabelClassName}>
                Experience level
              </label>
              <select id="experienceLevel" name="experienceLevel" className={selectClassName}>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {state.fieldErrors.experienceLevel && (
                <p className="text-xs text-danger">{state.fieldErrors.experienceLevel}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Schedule</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Workout days per week"
              name="workoutDaysPerWeek"
              type="number"
              min={1}
              max={7}
              defaultValue={3}
              error={state.fieldErrors.workoutDaysPerWeek}
              required
            />
            <Input
              label="Session duration (minutes)"
              name="workoutDurationMinutes"
              type="number"
              defaultValue={45}
              error={state.fieldErrors.workoutDurationMinutes}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Available equipment</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EQUIPMENT_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                id={`equipment-${option}`}
                name="availableEquipment"
                value={option}
                label={option}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Additional notes</p>
          <Input
            label="Medical conditions (optional)"
            name="medicalConditions"
            error={state.fieldErrors.medicalConditions}
          />
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button type="submit" variant="primary" loading={isPending}>
            Generate plan
          </Button>
        </div>
      </form>
    </Card>
  );
}
