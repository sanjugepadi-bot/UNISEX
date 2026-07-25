"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { resetPasswordAction, type ResetPasswordFormState } from "./actions";

const initialState: ResetPasswordFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/login");
    }
  }, [state.success, router]);

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-foreground">Set a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a new password for your account
        </p>
      </div>

      <Card>
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
            label="New password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={state.fieldErrors.password}
            required
          />

          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={state.fieldErrors.confirmPassword}
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}
