"use server";

import { loginSchema, type LoginInput } from "@/validators/login";
import { signIn } from "@/services/auth";

export interface LoginFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof LoginInput, string>>;
  formError: string | null;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: LoginFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LoginInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { error } = await signIn({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  return { success: true, fieldErrors: {}, formError: null };
}
