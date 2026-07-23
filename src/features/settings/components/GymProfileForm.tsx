"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <form action={formAction} className="flex flex-col gap-4">
      {state.formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.formError}
        </p>
      )}

      {state.success && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          Gym profile updated.
        </p>
      )}

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

      <div className="mt-2 flex justify-end border-t border-gray-200 pt-4">
        <Button type="submit" loading={isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
