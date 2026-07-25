import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Utensils, Layers, Target, Clock } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getMemberById } from "@/services/members";
import { getDietPlansForMember } from "@/services/dietPlans";
import { DietPlanForm } from "@/features/diet-planner/components/DietPlanForm";
import { StatTile } from "@/components/ui/StatTile";
import { generateDietPlanAction } from "./actions";

export const metadata: Metadata = {
  title: "Diet Plans",
};

interface MemberDietPlansPageProps {
  params: Promise<{ memberId: string }>;
}

export default async function MemberDietPlansPage({ params }: MemberDietPlansPageProps) {
  const { memberId } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: member } = await getMemberById(memberId, profile.gymId);
  if (!member) {
    notFound();
  }

  const { data: plans, error } = await getDietPlansForMember(memberId, profile.gymId);
  const hasPlans = Boolean(plans && plans.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
          <Utensils className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h2 font-semibold text-foreground">
            {member.fullName}&apos;s Diet Plans
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate a new AI-powered plan or review this member&apos;s plan history.
          </p>
        </div>
      </div>

      {hasPlans && plans && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Plans generated" value={plans.length} icon={Layers} />
          <StatTile label="Latest goal" value={plans[0].dietaryGoal} icon={Target} />
          <StatTile
            label="Last generated"
            value={new Date(plans[0].createdAt).toLocaleDateString()}
            icon={Clock}
          />
        </div>
      )}

      <DietPlanForm action={generateDietPlanAction} member={member} />

      <div>
        <h2 className="text-sm font-semibold text-foreground">Plan history</h2>

        {error && (
          <p role="alert" className="mt-3 rounded-control bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-3 overflow-hidden rounded-surface border border-border bg-surface shadow-card">
          {!hasPlans ? (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Utensils className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No diet plans yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the form above to generate this member&apos;s first diet plan.
                </p>
              </div>
            </div>
          ) : (
            plans?.map((plan) => (
              <Link
                key={plan.id}
                href={`/diet-plans/${memberId}/${plan.id}`}
                className="flex items-center gap-3 border-t border-border px-4 py-3 transition-colors duration-150 first:border-t-0 hover:bg-secondary/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
                  <Target className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {plan.dietaryGoal}
                  </p>
                  <p className="text-caption text-muted-foreground">
                    {new Date(plan.createdAt).toLocaleDateString()} · {plan.mealCount} meals/day
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
