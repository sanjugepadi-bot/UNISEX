"use server";

import { revalidatePath } from "next/cache";
import { memberSchema, type MemberInput } from "@/validators/member";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById, updateMember } from "@/services/members";
import { getPlanById } from "@/services/membershipPlans";
import type { MemberFormState } from "@/features/members/components/MemberForm";

function addDaysUtc(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function updateMemberAction(
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  const memberId = formData.get("memberId");

  if (typeof memberId !== "string" || !memberId) {
    return { success: false, fieldErrors: {}, formError: "Missing member reference." };
  }

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
      formError: "You must belong to a gym to edit members.",
    };
  }

  const { data: existing, error: existingError } = await getMemberById(memberId, profile.gymId);
  if (existingError || !existing) {
    return { success: false, fieldErrors: {}, formError: "Member not found." };
  }

  // Only recalculate expiry if the plan or start date actually changed —
  // resubmitting the same plan (e.g. editing an unrelated field like phone)
  // must never shift the expiry, even if that plan's duration changed since.
  const planChanged = (parsed.data.planId ?? null) !== (existing.planId ?? null);
  const startDateChanged = parsed.data.membershipStartDate !== existing.membershipStartDate;

  let membershipEndDate: string | undefined;
  if (parsed.data.planId && (planChanged || startDateChanged)) {
    const { data: plan, error: planError } = await getPlanById(parsed.data.planId, profile.gymId);
    if (planError || !plan) {
      return { success: false, fieldErrors: {}, formError: "Selected plan could not be found." };
    }
    membershipEndDate = addDaysUtc(parsed.data.membershipStartDate, plan.durationDays);
  }

  const { error } = await updateMember({
    id: memberId,
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
