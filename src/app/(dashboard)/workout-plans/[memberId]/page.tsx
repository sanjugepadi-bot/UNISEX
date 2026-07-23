import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById } from "@/services/members";
import { getWorkoutPlansForMember } from "@/services/workoutPlans";
import { WorkoutPlanForm } from "@/features/workout-planner/components/WorkoutPlanForm";
import { generateWorkoutPlanAction } from "./actions";

export const metadata: Metadata = {
  title: "Workout Plans",
};

interface MemberWorkoutPlansPageProps {
  params: Promise<{ memberId: string }>;
}

export default async function MemberWorkoutPlansPage({ params }: MemberWorkoutPlansPageProps) {
  const { memberId } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: member } = await getMemberById(memberId, profile.gymId);
  if (!member) {
    notFound();
  }

  const { data: plans, error } = await getWorkoutPlansForMember(memberId, profile.gymId);

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium text-gray-900">
        {member.fullName}&apos;s Workout Plans
      </h1>

      <WorkoutPlanForm action={generateWorkoutPlanAction} member={member} />

      <h2 className="mb-2 mt-8 text-sm font-medium text-gray-700">Plan history</h2>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200">
        {(!plans || plans.length === 0) && (
          <div className="px-3 py-4 text-sm text-gray-500">No workout plans generated yet.</div>
        )}
        {plans?.map((plan) => (
          <Link
            key={plan.id}
            href={`/workout-plans/${memberId}/${plan.id}`}
            className="flex items-center justify-between border-t border-gray-200 px-3 py-2 text-sm first:border-t-0 hover:bg-gray-50"
          >
            <span className="text-gray-900">{plan.fitnessGoal}</span>
            <span className="text-gray-500">
              {new Date(plan.createdAt).toLocaleDateString()} · {plan.workoutDaysPerWeek}d/week
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
