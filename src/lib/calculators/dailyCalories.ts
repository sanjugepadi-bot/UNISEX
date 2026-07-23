import { calculateTdee, type ActivityLevel } from "./tdee";
import type { Gender } from "./bmr";

export const CALORIE_GOALS = ["lose", "maintain", "gain"] as const;

export type CalorieGoal = (typeof CALORIE_GOALS)[number];

export const CALORIE_GOAL_LABELS: Record<CalorieGoal, string> = {
  lose: "Lose weight",
  maintain: "Maintain weight",
  gain: "Gain weight",
};

const GOAL_ADJUSTMENTS: Record<CalorieGoal, number> = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

export function calculateDailyCalories(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: CalorieGoal,
): { bmr: number; tdee: number; target: number } {
  const { bmr, tdee } = calculateTdee(gender, weightKg, heightCm, age, activityLevel);
  return { bmr, tdee, target: tdee + GOAL_ADJUSTMENTS[goal] };
}
