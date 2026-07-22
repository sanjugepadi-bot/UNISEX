"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <Card
      title="Create your account"
      description="Set up your gym in a few minutes"
      className="max-w-[520px]"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 underline">
            Log in
          </Link>
        </>
      }
    >
      <form action={formAction} className="flex flex-col gap-4">
        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
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

        <Button type="submit" fullWidth loading={isPending}>
          Create account
        </Button>
      </form>
    </Card>
  );
}
