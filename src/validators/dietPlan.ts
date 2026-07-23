import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const DIETARY_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "Maintenance",
  "General Health",
] as const;

export const DIETARY_PREFERENCES = [
  "Vegetarian",
  "Non-vegetarian",
  "Vegan",
  "Eggetarian",
] as const;

export const ACTIVITY_LEVELS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
] as const;

export const BUDGET_PREFERENCES = ["Budget", "Moderate", "Premium"] as const;

export const dietPlanSchema = z.object({
  memberId: z.string().uuid("Select a member"),
  dietaryGoal: z.enum(DIETARY_GOALS),
  dietaryPreference: z.enum(DIETARY_PREFERENCES),
  activityLevel: z.enum(ACTIVITY_LEVELS),
  dailyCalorieTarget: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().optional(),
  ),
  mealCount: z.coerce.number().int().min(1).max(8),
  budgetPreference: z.preprocess(emptyStringToUndefined, z.enum(BUDGET_PREFERENCES).optional()),
  preferredCuisine: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  dislikedFoods: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  allergies: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  medicalConditions: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  supplements: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
});

export type DietPlanInput = z.infer<typeof dietPlanSchema>;
