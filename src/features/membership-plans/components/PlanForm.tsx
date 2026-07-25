"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CircleAlert } from "lucide-react";
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

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

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
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <CreditCard className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {planId
              ? "Update this membership plan's details."
              : "Set up a new membership plan for your gym."}
          </p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        {planId && <input type="hidden" name="planId" value={planId} />}

        {state.formError && (
          <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
            <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            <p role="alert" className="text-sm text-danger">
              {state.formError}
            </p>
          </div>
        )}

        <Card>
          <div className="flex flex-col gap-4">
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
                <label htmlFor="durationUnit" className={fieldLabelClassName}>
                  Unit
                </label>
                <select
                  id="durationUnit"
                  name="durationUnit"
                  defaultValue="days"
                  className={selectClassName}
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

            <div className="border-t border-border pt-4">
              <Checkbox
                name="isActive"
                label="Active"
                defaultChecked={defaultValues?.isActive ?? true}
                error={state.fieldErrors.isActive}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="sm:w-auto"
            onClick={() => router.push("/plans")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="sm:w-auto"
            loading={isPending}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
