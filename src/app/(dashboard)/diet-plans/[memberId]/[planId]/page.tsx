import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { Utensils, Flame, StickyNote, Info } from "lucide-react";
import { getCurrentUserProfile } from "@/services/profiles";
import { getDietPlanById } from "@/services/dietPlans";
import { Card } from "@/components/ui/Card";
import { RegenerateButton } from "./RegenerateButton";

export const metadata: Metadata = {
  title: "Diet Plan",
};

interface DietPlanDetailPageProps {
  params: Promise<{ memberId: string; planId: string }>;
}

const MACRO_PILL_CLASSNAME =
  "rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-secondary-foreground";

export default async function DietPlanDetailPage({ params }: DietPlanDetailPageProps) {
  const { memberId, planId } = await params;

  const { data: profile } = await getCurrentUserProfile();
  if (!profile?.gymId) {
    redirect("/onboarding");
  }

  const { data: plan } = await getDietPlanById(planId, profile.gymId);
  if (!plan || plan.memberId !== memberId) {
    notFound();
  }

  const generatedFromItems = (
    [
      plan.gender ? { label: "Gender", value: plan.gender } : null,
      plan.age ? { label: "Age", value: `${plan.age} yrs` } : null,
      plan.heightCm ? { label: "Height", value: `${plan.heightCm} cm` } : null,
      plan.weightKg ? { label: "Weight", value: `${plan.weightKg} kg` } : null,
      { label: "Dietary preference", value: plan.dietaryPreference },
      { label: "Activity level", value: plan.activityLevel },
      { label: "Meals per day", value: String(plan.mealCount) },
      plan.budgetPreference ? { label: "Budget", value: plan.budgetPreference } : null,
      plan.preferredCuisine ? { label: "Preferred cuisine", value: plan.preferredCuisine } : null,
      plan.dislikedFoods ? { label: "Disliked foods", value: plan.dislikedFoods } : null,
      plan.allergies ? { label: "Allergies", value: plan.allergies } : null,
      plan.medicalConditions ? { label: "Medical notes", value: plan.medicalConditions } : null,
      plan.supplements ? { label: "Supplements", value: plan.supplements } : null,
    ] as const
  ).filter((item): item is { label: string; value: string } => item !== null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary/10 text-primary">
            <Utensils className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-h2 font-semibold text-foreground">{plan.dietaryGoal}</h1>
            <p className="text-sm text-muted-foreground">
              Generated {new Date(plan.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <RegenerateButton planId={plan.id} memberId={memberId} />
      </div>

      <Card title="Summary">
        <p className="text-sm text-foreground">{plan.planContent.summary}</p>
        {plan.planContent.dailyCalorieTarget && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Flame className="h-4 w-4" aria-hidden="true" />
            {plan.planContent.dailyCalorieTarget} kcal/day target
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-5">
        {plan.planContent.days.map((day) => (
          <div key={day.day} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">{day.day}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {day.meals.map((meal) => (
                <Card key={meal.name} className="!p-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">{meal.name}</p>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{meal.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className={MACRO_PILL_CLASSNAME}>{meal.calories} kcal</span>
                    <span className={MACRO_PILL_CLASSNAME}>{meal.protein}g protein</span>
                    <span className={MACRO_PILL_CLASSNAME}>{meal.carbs}g carbs</span>
                    <span className={MACRO_PILL_CLASSNAME}>{meal.fat}g fat</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {plan.planContent.notes.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
              Notes
            </p>
          </div>
          <ul className="mt-2 flex flex-col gap-1.5">
            {plan.planContent.notes.map((note, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">
            Generated from
          </p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {generatedFromItems.map((item) => (
            <div key={item.label}>
              <dt className="text-caption text-muted-foreground">{item.label}</dt>
              <dd className="text-sm text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
