"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { requestPasswordResetAction, type ForgotPasswordFormState } from "./actions";

const initialState: ForgotPasswordFormState = {
  submitted: false,
  fieldErrors: {},
  formError: null,
};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  if (state.submitted) {
    return (
      <Card
        title="Check your email"
        description="If an account exists for that email address, we've sent a link to reset your password."
        className="max-w-[520px]"
        footer={
          <Link href="/login" className="text-gray-900 underline">
            Back to login
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          The link will expire after a short time. If it doesn&apos;t arrive within a few
          minutes, check your spam folder or try again.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link"
      className="max-w-[520px]"
      footer={
        <>
          Remembered your password?{" "}
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
          label="Email"
          name="email"
          type="email"
          placeholder="name@gym.com"
          autoComplete="email"
          error={state.fieldErrors.email}
          required
        />

        <Button type="submit" fullWidth loading={isPending}>
          Send reset link
        </Button>
      </form>
    </Card>
  );
}
