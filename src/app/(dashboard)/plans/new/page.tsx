import type { Metadata } from "next";
import { PlanForm } from "@/features/membership-plans/components/PlanForm";
import { createPlanAction } from "./actions";

export const metadata: Metadata = {
  title: "Add plan",
};

export default function NewPlanPage() {
  return <PlanForm action={createPlanAction} />;
}
