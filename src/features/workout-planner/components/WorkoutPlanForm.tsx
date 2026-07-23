"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export function WorkoutPlanForm({ action, member }: WorkoutPlanFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Card title="Generate workout plan" className="max-w-[600px]">
      <div className="mb-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
        Using {member.fullName}&apos;s profile: {member.gender ?? "gender not set"},{" "}
        {member.dateOfBirth ? "DOB on file" : "DOB not set"}, {member.height ?? "—"} cm,{" "}
        {member.weight ?? "—"} kg.
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="memberId" value={member.id} />

        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="fitnessGoal" className="text-xs text-gray-600">
            Fitness goal
          </label>
          <select
            id="fitnessGoal"
            name="fitnessGoal"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {FITNESS_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {state.fieldErrors.fitnessGoal && (
            <p className="text-xs text-red-600">{state.fieldErrors.fitnessGoal}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="experienceLevel" className="text-xs text-gray-600">
            Experience level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {state.fieldErrors.experienceLevel && (
            <p className="text-xs text-red-600">{state.fieldErrors.experienceLevel}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-600">Available equipment</p>
          <div className="grid grid-cols-2 gap-2">
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

        <Input
          label="Medical conditions (optional)"
          name="medicalConditions"
          error={state.fieldErrors.medicalConditions}
        />

        <div className="mt-2 flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button type="submit" loading={isPending}>
            Generate plan
          </Button>
        </div>
      </form>
    </Card>
  );
}
