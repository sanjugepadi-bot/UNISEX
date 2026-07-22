"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import type { MembershipPlanInput } from "@/validators/membershipPlan";
import type { MembershipPlan } from "@/services/membershipPlans";

export interface PlanFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof MembershipPlanInput, string>>;
  formError: string | null;
}

const emptyState: PlanFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

interface PlanFormProps {
  action: (prevState: PlanFormState, formData: FormData) => Promise<PlanFormState>;
  defaultValues?: Partial<MembershipPlan>;
  planId?: string;
  submitLabel?: string;
  title?: string;
}

export function PlanForm({
  action,
  defaultValues,
  planId,
  submitLabel = "Save plan",
  title = "Add plan",
}: PlanFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.push("/plans");
    }
  }, [state.success, router]);

  return (
    <Card title={title} className="max-w-[520px]">
      <form action={formAction} className="flex flex-col gap-4">
        {planId && <input type="hidden" name="planId" value={planId} />}

        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
        )}

        <Input
          label="Plan name"
          name="planName"
          defaultValue={defaultValues?.planName}
          error={state.fieldErrors.planName}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Duration"
            name="durationValue"
            type="number"
            defaultValue={defaultValues?.durationDays}
            error={state.fieldErrors.durationValue}
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="durationUnit" className="text-xs text-gray-600">
              Unit
            </label>
            <select
              id="durationUnit"
              name="durationUnit"
              defaultValue="days"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        <Input
          label="Price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={defaultValues?.price}
          error={state.fieldErrors.price}
          required
        />

        <Input
          label="Description (optional)"
          name="description"
          defaultValue={defaultValues?.description ?? undefined}
          error={state.fieldErrors.description}
        />

        <Checkbox
          name="isActive"
          label="Active"
          defaultChecked={defaultValues?.isActive ?? true}
          error={state.fieldErrors.isActive}
        />

        <div className="mt-2 flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
