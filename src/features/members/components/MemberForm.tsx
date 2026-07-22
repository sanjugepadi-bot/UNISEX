"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MemberInput } from "@/validators/member";
import type { Member } from "@/services/members";

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
  submitLabel?: string;
  title?: string;
}

export function MemberForm({
  action,
  defaultValues,
  memberId,
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
    <Card title={title} className="max-w-[600px]">
      <form action={formAction} className="flex flex-col gap-4">
        {memberId && <input type="hidden" name="memberId" value={memberId} />}

        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
        )}

        <p className="text-xs font-medium text-gray-400">PERSONAL DETAILS</p>
        <div className="grid grid-cols-2 gap-4">
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
            <label htmlFor="gender" className="text-xs text-gray-600">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue={defaultValues?.gender ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
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

        <p className="mt-2 text-xs font-medium text-gray-400">MEMBERSHIP</p>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start date"
            name="membershipStartDate"
            type="date"
            defaultValue={defaultValues?.membershipStartDate ?? undefined}
            error={state.fieldErrors.membershipStartDate}
            required
          />
          <Input
            label="End date"
            name="membershipEndDate"
            type="date"
            defaultValue={defaultValues?.membershipEndDate ?? undefined}
            error={state.fieldErrors.membershipEndDate}
            required
          />
        </div>

        <p className="mt-2 text-xs font-medium text-gray-400">EMERGENCY CONTACT</p>
        <div className="grid grid-cols-2 gap-4">
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

        <div className="mt-2 flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button type="submit" loading={isPending}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
