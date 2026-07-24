"use server";

import { resetPasswordSchema, type ResetPasswordInput } from "@/validators/resetPassword";
import { updatePassword } from "@/services/auth";

export interface ResetPasswordFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof ResetPasswordInput, string>>;
  formError: string | null;
}

export async function resetPasswordAction(
  _prevState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const raw = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ResetPasswordFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ResetPasswordInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { error } = await updatePassword(parsed.data.password);

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  return { success: true, fieldErrors: {}, formError: null };
}
