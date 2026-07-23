import { z } from "zod";
import { generateStructured } from "@/lib/ai/generateStructured";
import { buildDietPrompt, type DietPlanGeneratorInput } from "@/lib/ai/prompts/dietPrompt";

export type { DietPlanGeneratorInput };

export interface DietPlanMeal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlanDay {
  day: string;
  meals: DietPlanMeal[];
}

export interface DietPlanContent {
  summary: string;
  dailyCalorieTarget: number;
  days: DietPlanDay[];
  notes: string[];
}

const dietPlanContentSchema = z.object({
  summary: z.string().min(1),
  dailyCalorieTarget: z.number().int().positive(),
  days: z
    .array(
      z.object({
        day: z.string().min(1),
        meals: z
          .array(
            z.object({
              name: z.string().min(1),
              description: z.string().min(1),
              calories: z.number().int().nonnegative(),
              protein: z.number().nonnegative(),
              carbs: z.number().nonnegative(),
              fat: z.number().nonnegative(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
  notes: z.array(z.string()),
});

/**
 * Calls the configured AI provider to generate a diet plan, then validates
 * the response before returning it. Structurally identical to
 * generateWorkoutPlanContent — same provider layer, same error handling,
 * just a diet-specific prompt and validation schema.
 */
export async function generateDietPlanContent(
  input: DietPlanGeneratorInput,
): Promise<DietPlanContent> {
  const { systemPrompt, userPrompt } = buildDietPrompt(input);
  return generateStructured({
    systemPrompt,
    userPrompt,
    schema: dietPlanContentSchema,
  });
}
