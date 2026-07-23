import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getCurrentUserProfile } from "@/services/profiles";
import { getDietPlanById } from "@/services/dietPlans";
import { RegenerateButton } from "./RegenerateButton";

export const metadata: Metadata = {
  title: "Diet Plan",
};

interface DietPlanDetailPageProps {
  params: Promise<{ memberId: string; planId: string }>;
}

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{plan.dietaryGoal}</h1>
          <p className="text-sm text-gray-500">
            Generated {new Date(plan.createdAt).toLocaleString()}
          </p>
        </div>
        <RegenerateButton planId={plan.id} memberId={memberId} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-700">{plan.planContent.summary}</p>
        <p className="mt-1 text-xs text-gray-500">
          Target: {plan.planContent.dailyCalorieTarget} kcal/day
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {plan.planContent.days.map((day) => (
            <div key={day.day}>
              <p className="text-sm font-medium text-gray-900">{day.day}</p>
              <ul className="mt-1 flex flex-col gap-1">
                {day.meals.map((meal) => (
                  <li key={meal.name} className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{meal.name}</span> —{" "}
                    {meal.description} ({meal.calories} kcal, {meal.protein}g protein,{" "}
                    {meal.carbs}g carbs, {meal.fat}g fat)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {plan.planContent.notes.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium text-gray-400">NOTES</p>
            <ul className="mt-1 flex flex-col gap-1">
              {plan.planContent.notes.map((note, index) => (
                <li key={index} className="text-xs text-gray-600">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Generated from: {plan.gender ?? "—"}, {plan.age ?? "—"} yrs, {plan.heightCm ?? "—"} cm,{" "}
        {plan.weightKg ?? "—"} kg, {plan.dietaryPreference}, {plan.activityLevel},{" "}
        {plan.mealCount} meals/day
        {plan.budgetPreference && `, budget: ${plan.budgetPreference}`}
        {plan.preferredCuisine && `, cuisine: ${plan.preferredCuisine}`}
        {plan.dislikedFoods && `. Disliked: ${plan.dislikedFoods}`}
        {plan.allergies && `. Allergies: ${plan.allergies}`}
        {plan.medicalConditions && `. Medical notes: ${plan.medicalConditions}`}
        {plan.supplements && `. Supplements: ${plan.supplements}`}
      </div>
    </div>
  );
}
