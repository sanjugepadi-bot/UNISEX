"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DIETARY_GOALS,
  DIETARY_PREFERENCES,
  ACTIVITY_LEVELS,
  BUDGET_PREFERENCES,
  type DietPlanInput,
} from "@/validators/dietPlan";
import type { Member } from "@/services/members";

export interface DietPlanFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof DietPlanInput, string>>;
  formError: string | null;
}

const emptyState: DietPlanFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

interface DietPlanFormProps {
  action: (prevState: DietPlanFormState, formData: FormData) => Promise<DietPlanFormState>;
  member: Member;
}

export function DietPlanForm({ action, member }: DietPlanFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Card title="Generate diet plan" className="max-w-[600px]">
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
          <label htmlFor="dietaryGoal" className="text-xs text-gray-600">
            Dietary goal
          </label>
          <select
            id="dietaryGoal"
            name="dietaryGoal"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {DIETARY_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {state.fieldErrors.dietaryGoal && (
            <p className="text-xs text-red-600">{state.fieldErrors.dietaryGoal}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dietaryPreference" className="text-xs text-gray-600">
            Dietary preference
          </label>
          <select
            id="dietaryPreference"
            name="dietaryPreference"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {DIETARY_PREFERENCES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
          {state.fieldErrors.dietaryPreference && (
            <p className="text-xs text-red-600">{state.fieldErrors.dietaryPreference}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="activityLevel" className="text-xs text-gray-600">
            Activity level
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {state.fieldErrors.activityLevel && (
            <p className="text-xs text-red-600">{state.fieldErrors.activityLevel}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Daily calorie target (optional)"
            name="dailyCalorieTarget"
            type="number"
            helperText="Leave blank to let AI suggest one"
            error={state.fieldErrors.dailyCalorieTarget}
          />
          <Input
            label="Meals per day"
            name="mealCount"
            type="number"
            min={1}
            max={8}
            defaultValue={4}
            error={state.fieldErrors.mealCount}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="budgetPreference" className="text-xs text-gray-600">
            Budget preference (optional)
          </label>
          <select
            id="budgetPreference"
            name="budgetPreference"
            defaultValue=""
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="">Not specified</option>
            {BUDGET_PREFERENCES.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Preferred cuisine (optional)"
          name="preferredCuisine"
          error={state.fieldErrors.preferredCuisine}
        />
        <Input
          label="Disliked foods (optional)"
          name="dislikedFoods"
          error={state.fieldErrors.dislikedFoods}
        />
        <Input label="Allergies (optional)" name="allergies" error={state.fieldErrors.allergies} />
        <Input
          label="Medical conditions (optional)"
          name="medicalConditions"
          error={state.fieldErrors.medicalConditions}
        />
        <Input
          label="Current supplements (optional)"
          name="supplements"
          error={state.fieldErrors.supplements}
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
