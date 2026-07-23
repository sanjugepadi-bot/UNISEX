"use server";

import { revalidatePath } from "next/cache";
import { gymSettingsSchema, type GymSettingsInput } from "@/validators/gymSettings";
import { getCurrentUserProfile } from "@/services/profiles";
import { updateGym } from "@/services/gyms";
import type { GymSettingsFormState } from "@/features/settings/components/GymProfileForm";

export async function updateGymSettingsAction(
  _prevState: GymSettingsFormState,
  formData: FormData,
): Promise<GymSettingsFormState> {
  const raw = {
    gymName: formData.get("gymName"),
    gymPhone: formData.get("gymPhone"),
    gymEmail: formData.get("gymEmail"),
    address: formData.get("address"),
  };

  const parsed = gymSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: GymSettingsFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof GymSettingsInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors, formError: null };
  }

  const { data: profile, error: profileError } = await getCurrentUserProfile();

  if (profileError || !profile?.gymId) {
    return {
      success: false,
      fieldErrors: {},
      formError: "You must belong to a gym to update settings.",
    };
  }

  if (profile.role !== "owner") {
    return {
      success: false,
      fieldErrors: {},
      formError: "Only the gym owner can update gym settings.",
    };
  }

  const { error } = await updateGym({
    gymId: profile.gymId,
    ...parsed.data,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath("/settings");
  return { success: true, fieldErrors: {}, formError: null };
}
