"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <Card
      title="Set a new password"
      description="Choose a new password for your account"
      className="max-w-[520px]"
    >
      <form action={formAction} className="flex flex-col gap-4">
        {state.formError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.formError}
          </p>
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

        <Button type="submit" fullWidth loading={isPending}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
