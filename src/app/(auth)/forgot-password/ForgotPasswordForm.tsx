"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert, MailCheck } from "lucide-react";
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
      <div className="flex w-full max-w-[440px] flex-col gap-6">
        <Card>
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-h3 font-semibold text-foreground">Check your email</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                If an account exists for that email address, we&apos;ve sent a link to reset your
                password.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              The link will expire after a short time. If it doesn&apos;t arrive within a few
              minutes, check your spam folder or try again.
            </p>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-foreground">Forgot your password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <Card
        footer={
          <>
            Remembered your password?{" "}
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
            label="Email"
            name="email"
            type="email"
            placeholder="name@gym.com"
            autoComplete="email"
            error={state.fieldErrors.email}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            Send reset link
          </Button>
        </form>
      </Card>
    </div>
  );
}
