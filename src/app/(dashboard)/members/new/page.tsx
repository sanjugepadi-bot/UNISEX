import type { Metadata } from "next";
import { MemberForm } from "@/features/members/components/MemberForm";
import { createMemberAction } from "./actions";

export const metadata: Metadata = {
  title: "Add member",
};

export default function NewMemberPage() {
  return <MemberForm action={createMemberAction} />;
}
