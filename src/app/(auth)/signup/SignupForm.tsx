"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleAlert, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signupAction, type SignupFormState } from "./actions";

const initialState: SignupFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/onboarding");
    }
  }, [state.success, router]);

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-foreground">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Set up your gym in a few minutes</p>
      </div>

      <Card
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </>
        }
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
            label="Full name"
            name="fullName"
            placeholder="Your name"
            autoComplete="name"
            error={state.fieldErrors.fullName}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="name@gym.com"
            autoComplete="email"
            error={state.fieldErrors.email}
            required
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            error={state.fieldErrors.phone}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            autoComplete="new-password"
            error={state.fieldErrors.password}
            required
          />

          <Checkbox
            name="agreeToTerms"
            label="I agree to the Terms of Service and Privacy Policy"
            error={state.fieldErrors.agreeToTerms}
          />

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            Create account
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
