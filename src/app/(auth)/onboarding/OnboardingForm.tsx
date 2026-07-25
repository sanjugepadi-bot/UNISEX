"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, ShieldCheck } from "lucide-react";
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
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-foreground">Welcome to AI Gym SaaS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;re almost set up — let&apos;s add your gym.
        </p>
      </div>

      <Card
        title="Tell us about your gym"
        description="This sets up your gym profile and first branch"
      >
        <form action={formAction} className="flex flex-col gap-4">
          {state.formError && (
            <div className="flex items-center gap-3 rounded-surface border border-border bg-danger-bg px-4 py-3">
              <CircleAlert className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <p role="alert" className="text-sm text-danger">
                {state.formError}
              </p>
            </div>
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

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            Continue
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Your data is encrypted and securely stored.
          </p>
        </form>
      </Card>
    </div>
  );
}
