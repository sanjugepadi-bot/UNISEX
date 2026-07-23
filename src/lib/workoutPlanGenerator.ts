import { z } from "zod";
import { getAiProvider, AiProviderError } from "@/lib/ai";
import {
  buildWorkoutPrompt,
  type WorkoutPlanGeneratorInput,
} from "@/lib/ai/prompts/workoutPrompt";

export type { WorkoutPlanGeneratorInput };

export interface WorkoutPlanExercise {
  name: string;
  sets: number;
  reps: string;
}

export interface WorkoutPlanDay {
  day: string;
  focus: string;
  exercises: WorkoutPlanExercise[];
}

export interface WorkoutPlanContent {
  summary: string;
  days: WorkoutPlanDay[];
  notes: string[];
}

const workoutPlanContentSchema = z.object({
  summary: z.string().min(1),
  days: z
    .array(
      z.object({
        day: z.string().min(1),
        focus: z.string().min(1),
        exercises: z
          .array(
            z.object({
              name: z.string().min(1),
              sets: z.number().int().positive(),
              reps: z.string().min(1),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
  notes: z.array(z.string()),
});

/**
 * Calls the configured AI provider to generate a workout plan, then
 * validates the response before returning it. Signature is unchanged from
 * the placeholder version — services/workoutPlans.ts needed no changes.
 */
export async function generateWorkoutPlanContent(
  input: WorkoutPlanGeneratorInput,
): Promise<WorkoutPlanContent> {
  const provider = getAiProvider();
  const { systemPrompt, userPrompt } = buildWorkoutPrompt(input);

  const { text } = await provider.complete({
    systemPrompt,
    userPrompt,
    expectJson: true,
  });

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch (err) {
    throw new AiProviderError("The AI provider returned a response that was not valid JSON.", {
      cause: err,
    });
  }

  const validated = workoutPlanContentSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new AiProviderError(
      `The AI provider's response did not match the expected workout plan structure: ${validated.error.message}`,
    );
  }

  return validated.data;
}
