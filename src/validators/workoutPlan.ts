import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const FITNESS_GOALS = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Endurance",
] as const;

export const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const EQUIPMENT_OPTIONS = [
  "Bodyweight only",
  "Dumbbells",
  "Barbell",
  "Resistance bands",
  "Machines",
  "Full gym",
] as const;

export const workoutPlanSchema = z.object({
  memberId: z.string().uuid("Select a member"),
  fitnessGoal: z.enum(FITNESS_GOALS),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  workoutDaysPerWeek: z.coerce.number().int().min(1).max(7),
  workoutDurationMinutes: z.coerce.number().int().positive(),
  availableEquipment: z.array(z.string()).default([]),
  medicalConditions: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
});

export type WorkoutPlanInput = z.infer<typeof workoutPlanSchema>;
