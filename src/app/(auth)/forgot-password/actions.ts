"use server";

import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validators/forgotPassword";
import { requestPasswordReset } from "@/services/auth";

export interface ForgotPasswordFormState {
  submitted: boolean;
  fieldErrors: Partial<Record<keyof ForgotPasswordInput, string>>;
  formError: string | null;
}

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const raw = {
    email: formData.get("email"),
  };

  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ForgotPasswordFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ForgotPasswordInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { submitted: false, fieldErrors, formError: null };
  }

  await requestPasswordReset(parsed.data.email);

  // Always report success, whether or not the email is registered, so the
  // response cannot be used to enumerate which addresses have accounts.
  return { submitted: true, fieldErrors: {}, formError: null };
}
