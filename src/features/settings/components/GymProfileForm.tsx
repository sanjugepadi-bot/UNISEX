"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { GymSettingsInput } from "@/validators/gymSettings";
import type { Gym } from "@/services/gyms";

export interface GymSettingsFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof GymSettingsInput, string>>;
  formError: string | null;
}

const emptyState: GymSettingsFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

interface GymProfileFormProps {
  action: (prevState: GymSettingsFormState, formData: FormData) => Promise<GymSettingsFormState>;
  gym: Gym;
}

export function GymProfileForm({ action, gym }: GymProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, emptyState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.formError && (
        <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
          <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <p role="alert" className="text-sm text-danger">
            {state.formError}
          </p>
        </div>
      )}

      {state.success && (
        <div className="flex items-center gap-3 rounded-surface border border-border bg-success-bg px-4 py-3">
          <CircleCheck className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <p role="status" className="text-sm text-success">
            Gym profile updated.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Gym name"
          name="gymName"
          defaultValue={gym.gymName}
          error={state.fieldErrors.gymName}
          required
        />
        <Input
          label="Gym phone"
          name="gymPhone"
          type="tel"
          defaultValue={gym.gymPhone ?? undefined}
          error={state.fieldErrors.gymPhone}
        />
        <Input
          label="Gym email"
          name="gymEmail"
          type="email"
          defaultValue={gym.gymEmail ?? undefined}
          error={state.fieldErrors.gymEmail}
        />
        <Input
          label="Address"
          name="address"
          defaultValue={gym.address ?? undefined}
          error={state.fieldErrors.address}
        />
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit" variant="primary" loading={isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
