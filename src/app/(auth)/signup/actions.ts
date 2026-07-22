"use server";

import { signupSchema, type SignupInput } from "@/validators/signup";
import { signUp } from "@/services/auth";

export interface SignupFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof SignupInput, string>>;
  formError: string | null;
}

export async function signupAction(
  _prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    // Native checkboxes submit "on" when checked, and are omitted entirely when unchecked
    agreeToTerms: formData.get("agreeToTerms") === "on",
  };

  const parsed = signupSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: SignupFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof SignupInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { error } = await signUp({
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  return { success: true, fieldErrors: {}, formError: null };
}
