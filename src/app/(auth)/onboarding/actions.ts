"use server";

import { onboardingSchema, type OnboardingInput } from "@/validators/onboarding";
import { getCurrentUserProfile } from "@/services/profiles";
import { createGymForOwner } from "@/services/gyms";

export interface OnboardingFormState {
  success: boolean;
  fieldErrors: Partial<Record<keyof OnboardingInput, string>>;
  formError: string | null;
}

export async function onboardingAction(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const raw = {
    gymName: formData.get("gymName"),
    gymPhone: formData.get("gymPhone"),
    gymEmail: formData.get("gymEmail"),
    address: formData.get("address"),
  };

  const parsed = onboardingSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: OnboardingFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof OnboardingInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { data: profile, error: profileError } = await getCurrentUserProfile();

  if (profileError) {
    return { success: false, fieldErrors: {}, formError: profileError };
  }

  if (!profile?.fullName) {
    return {
      success: false,
      fieldErrors: {},
      formError: "Your account is missing a name. Please contact support.",
    };
  }

  const { error } = await createGymForOwner({
    gymName: parsed.data.gymName,
    ownerName: profile.fullName,
    gymPhone: parsed.data.gymPhone,
    gymEmail: parsed.data.gymEmail,
    address: parsed.data.address,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  return { success: true, fieldErrors: {}, formError: null };
}
