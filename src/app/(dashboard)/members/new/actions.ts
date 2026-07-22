"use server";

import { revalidatePath } from "next/cache";
import { memberSchema, type MemberInput } from "@/validators/member";
import { getCurrentUserProfile } from "@/services/profiles";
import { createMember } from "@/services/members";
import type { MemberFormState } from "@/features/members/components/MemberForm";

export async function createMemberAction(
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const raw = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    gender: formData.get("gender"),
    dateOfBirth: formData.get("dateOfBirth"),
    height: formData.get("height"),
    weight: formData.get("weight"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
    membershipStartDate: formData.get("membershipStartDate"),
    membershipEndDate: formData.get("membershipEndDate"),
  };

  const parsed = memberSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: MemberFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof MemberInput | undefined;
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
      formError: "You must belong to a gym to add members.",
    };
  }

  const { error } = await createMember({
    gymId: profile.gymId,
    ...parsed.data,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath("/members");
  return { success: true, fieldErrors: {}, formError: null };
}
