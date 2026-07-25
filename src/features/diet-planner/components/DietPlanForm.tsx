"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
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

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const sectionLabelClassName = "text-caption font-semibold uppercase tracking-wide text-muted-foreground";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

export function DietPlanForm({ action, member }: DietPlanFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Card title="Generate diet plan" description="Create an AI-powered diet plan for this member.">
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
          <p className={sectionLabelClassName}>Goal &amp; preferences</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="dietaryGoal" className={fieldLabelClassName}>
                Dietary goal
              </label>
              <select id="dietaryGoal" name="dietaryGoal" className={selectClassName}>
                {DIETARY_GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
              {state.fieldErrors.dietaryGoal && (
                <p className="text-xs text-danger">{state.fieldErrors.dietaryGoal}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="dietaryPreference" className={fieldLabelClassName}>
                Dietary preference
              </label>
              <select id="dietaryPreference" name="dietaryPreference" className={selectClassName}>
                {DIETARY_PREFERENCES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
              {state.fieldErrors.dietaryPreference && (
                <p className="text-xs text-danger">{state.fieldErrors.dietaryPreference}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="activityLevel" className={fieldLabelClassName}>
                Activity level
              </label>
              <select id="activityLevel" name="activityLevel" className={selectClassName}>
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {state.fieldErrors.activityLevel && (
                <p className="text-xs text-danger">{state.fieldErrors.activityLevel}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Nutrition targets</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <div className="flex flex-col gap-1">
              <label htmlFor="budgetPreference" className={fieldLabelClassName}>
                Budget preference (optional)
              </label>
              <select
                id="budgetPreference"
                name="budgetPreference"
                defaultValue=""
                className={selectClassName}
              >
                <option value="">Not specified</option>
                {BUDGET_PREFERENCES.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={sectionLabelClassName}>Dietary notes</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Input
              label="Allergies (optional)"
              name="allergies"
              error={state.fieldErrors.allergies}
            />
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
          </div>
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
