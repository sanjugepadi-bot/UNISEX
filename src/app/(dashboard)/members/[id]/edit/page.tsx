import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById } from "@/services/members";
import { getActivePlans } from "@/services/membershipPlans";
import { MemberForm } from "@/features/members/components/MemberForm";
import { updateMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Edit member",
};

interface EditMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: member } = await getMemberById(id, profile.gymId);
  if (!member) {
    notFound();
  }

  const { data: plans } = await getActivePlans(profile.gymId);

  return (
    <MemberForm
      action={updateMemberAction}
      defaultValues={member}
      memberId={member.id}
      plans={plans ?? []}
      submitLabel="Save changes"
      title="Edit member"
    />
  );
}
