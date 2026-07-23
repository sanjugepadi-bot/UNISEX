import { calculateBmr, type Gender } from "./bmr";

export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "extra"] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly active (1-3 days/week)",
  moderate: "Moderately active (3-5 days/week)",
  active: "Very active (6-7 days/week)",
  extra: "Extra active (hard exercise + physical job)",
};

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extra: 1.9,
};

export function calculateTdee(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
): { bmr: number; tdee: number } {
  const bmr = calculateBmr(gender, weightKg, heightCm, age);
  return { bmr, tdee: bmr * ACTIVITY_MULTIPLIERS[activityLevel] };
}
