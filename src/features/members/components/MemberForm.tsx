"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MemberInput } from "@/validators/member";
import type { Member } from "@/services/members";
import type { MembershipPlan } from "@/services/membershipPlans";

export interface MemberFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof MemberInput, string>>;
  formError: string | null;
}

const emptyState: MemberFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

interface MemberFormProps {
  action: (prevState: MemberFormState, formData: FormData) => Promise<MemberFormState>;
  defaultValues?: Partial<Member>;
  memberId?: string;
  plans: MembershipPlan[];
  submitLabel?: string;
  title?: string;
}

const selectClassName =
  "w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20";
const fieldLabelClassName = "text-xs font-medium text-muted-foreground";

export function MemberForm({
  action,
  defaultValues,
  memberId,
  plans,
  submitLabel = "Save member",
  title = "Add member",
}: MemberFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.push("/members");
    }
  }, [state.success, router]);

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Pencil className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Update this member&apos;s details and membership.
          </p>
          {defaultValues?.fullName && (
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {defaultValues.fullName}
            </p>
          )}
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        {memberId && <input type="hidden" name="memberId" value={memberId} />}

        {state.formError && (
          <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
            <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            <p role="alert" className="text-sm text-danger">
              {state.formError}
            </p>
          </div>
        )}

        <Card title="Member Information" description="Basic details about the member.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              name="fullName"
              defaultValue={defaultValues?.fullName}
              error={state.fieldErrors.fullName}
              required
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              defaultValue={defaultValues?.phone}
              error={state.fieldErrors.phone}
              required
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="gender" className={fieldLabelClassName}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={defaultValues?.gender ?? ""}
                className={selectClassName}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              defaultValue={defaultValues?.dateOfBirth ?? undefined}
              error={state.fieldErrors.dateOfBirth}
            />
            <Input
              label="Height (cm)"
              name="height"
              type="number"
              defaultValue={defaultValues?.height ?? undefined}
              error={state.fieldErrors.height}
            />
            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              defaultValue={defaultValues?.weight ?? undefined}
              error={state.fieldErrors.weight}
            />
          </div>
        </Card>

        <Card title="Membership" description="Choose a plan and start date for this member.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="planId" className={fieldLabelClassName}>
                Plan
              </label>
              <select
                id="planId"
                name="planId"
                defaultValue={defaultValues?.planId ?? ""}
                className={selectClassName}
              >
                <option value="">No plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.planName} ({plan.durationDays} days)
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Start date"
              name="membershipStartDate"
              type="date"
              defaultValue={defaultValues?.membershipStartDate ?? undefined}
              error={state.fieldErrors.membershipStartDate}
              required
            />
          </div>
          {defaultValues?.membershipEndDate && (
            <div className="mt-4 rounded-control border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground">
              Current expiry: {defaultValues.membershipEndDate}. Expiry only recalculates if you
              change the plan or start date.
            </div>
          )}
        </Card>

        <Card title="Emergency Contact" description="Optional contact in case of an emergency.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Contact name"
              name="emergencyContactName"
              defaultValue={defaultValues?.emergencyContactName ?? undefined}
              error={state.fieldErrors.emergencyContactName}
            />
            <Input
              label="Contact phone"
              name="emergencyContactPhone"
              type="tel"
              defaultValue={defaultValues?.emergencyContactPhone ?? undefined}
              error={state.fieldErrors.emergencyContactPhone}
            />
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="sm:w-auto"
            onClick={() => router.push("/members")}
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
