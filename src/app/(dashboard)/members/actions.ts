"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserProfile } from "@/services/profiles";
import { deleteMember } from "@/services/members";

export async function deleteMemberAction(formData: FormData): Promise<void> {
  const memberId = formData.get("memberId");

  if (typeof memberId !== "string" || !memberId) {
    return;
  }

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    return;
  }

  const { error } = await deleteMember(memberId, profile.gymId);
  if (error) {
    console.error("[deleteMemberAction]", error);
  }

  revalidatePath("/members");
}
