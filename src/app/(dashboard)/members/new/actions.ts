"use server";

import { revalidatePath } from "next/cache";
import { memberSchema, type MemberInput } from "@/validators/member";
import { getCurrentUserProfile } from "@/services/profiles";
import { createMember } from "@/services/members";
import { getPlanById } from "@/services/membershipPlans";
import type { MemberFormState } from "@/features/members/components/MemberForm";

function addDaysUtc(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

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
    planId: formData.get("planId"),
    membershipStartDate: formData.get("membershipStartDate"),
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

  let membershipEndDate: string | undefined;
  if (parsed.data.planId) {
    const { data: plan, error: planError } = await getPlanById(parsed.data.planId, profile.gymId);
    if (planError || !plan) {
      return { success: false, fieldErrors: {}, formError: "Selected plan could not be found." };
    }
    membershipEndDate = addDaysUtc(parsed.data.membershipStartDate, plan.durationDays);
  }

  const { error } = await createMember({
    gymId: profile.gymId,
    ...parsed.data,
    membershipEndDate,
  });

  if (error) {
    return { success: false, fieldErrors: {}, formError: error };
  }

  revalidatePath("/members");
  return { success: true, fieldErrors: {}, formError: null };
}
