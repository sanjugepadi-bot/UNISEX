"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircleAlert, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loginAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
    }
  }, [state.success, router]);

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-6">
      <div className="text-center">
        <h1 className="text-h2 font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your gym dashboard</p>
      </div>

      <Card
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
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

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={state.fieldErrors.password}
            required
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            Log in
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
