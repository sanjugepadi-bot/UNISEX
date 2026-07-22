"use server";

import { revalidatePath } from "next/cache";
import { checkInSchema } from "@/validators/attendance";
import { getCurrentUserProfile } from "@/services/profiles";
import { checkInMember } from "@/services/attendance";

export async function checkInAction(formData: FormData): Promise<void> {
  const parsed = checkInSchema.safeParse({ memberId: formData.get("memberId") });

  if (!parsed.success) {
    return;
  }

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    return;
  }

  const { error } = await checkInMember(parsed.data.memberId);
  if (error) {
    console.error("[checkInAction]", error);
  }

  revalidatePath("/attendance");
}
