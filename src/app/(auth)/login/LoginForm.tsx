"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <Card
      title="Welcome back"
      description="Log in to your gym dashboard"
      className="max-w-[520px]"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gray-900 underline">
            Sign up
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

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={state.fieldErrors.password}
          required
        />

        <Button type="submit" fullWidth loading={isPending}>
          Log in
        </Button>
      </form>
    </Card>
  );
}
