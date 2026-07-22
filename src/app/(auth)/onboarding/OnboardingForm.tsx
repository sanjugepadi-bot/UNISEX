"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { onboardingAction, type OnboardingFormState } from "./actions";

const initialState: OnboardingFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function OnboardingForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(onboardingAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <Card className="max-w-[520px]">
      <div className="mb-6">
        <h1 className="text-base font-medium text-gray-900">Tell us about your gym</h1>
        <p className="mt-1 text-sm text-gray-600">
          This sets up your gym profile and first branch
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
        )}

        <Input
          label="Gym name"
          name="gymName"
          placeholder="e.g. PowerHouse Fitness"
          autoComplete="organization"
          error={state.fieldErrors.gymName}
          required
        />

        <Input
          label="Gym phone"
          name="gymPhone"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          error={state.fieldErrors.gymPhone}
        />

        <Input
          label="Gym email"
          name="gymEmail"
          type="email"
          placeholder="contact@gym.com"
          autoComplete="email"
          error={state.fieldErrors.gymEmail}
        />

        <Input
          label="Branch address"
          name="address"
          placeholder="Street, city, state"
          autoComplete="street-address"
          error={state.fieldErrors.address}
        />

        <Button type="submit" fullWidth loading={isPending}>
          Continue
        </Button>
      </form>
    </Card>
  );
}
