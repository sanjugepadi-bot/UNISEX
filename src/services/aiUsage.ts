import { createClient } from "@/lib/supabase/server";
import { getAiProvider } from "@/lib/ai";

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export type AiGenerationFeature = "workout_plan" | "diet_plan";
export type AiGenerationStatus = "success" | "failure";

interface LogAiGenerationParams {
  gymId: string;
  createdBy: string;
  feature: AiGenerationFeature;
  status: AiGenerationStatus;
  errorMessage?: string;
}

/**
 * Logs a single AI generation attempt (success or failure). provider/model
 * are read from the currently active provider — callers never pass these,
 * so the log always reflects reality even if the active provider changes.
 * Deliberately fire-and-forget: a logging failure must never break the
 * actual generation flow, so errors here are swallowed, not thrown.
 */
export async function logAiGeneration(params: LogAiGenerationParams): Promise<void> {
  try {
    const supabase = await createClient();
    const { provider, model } = getAiProvider().getProviderInfo();

    await supabase.from("ai_generation_logs").insert({
      gym_id: params.gymId,
      created_by: params.createdBy,
      feature: params.feature,
      status: params.status,
      error_message: params.errorMessage ?? null,
      provider,
      model,
    });
  } catch {
    // Logging failures must never break the actual generation flow.
  }
}

/**
 * Counts AI generation attempts (success + failure, combined) for a gym
 * since a given timestamp — used by the rate limiter. Reads from
 * ai_generation_logs, which records every attempt, not just successful
 * ones that made it into workout_plans/diet_plans.
 */
export async function getRecentAiGenerationCount(
  gymId: string,
  sinceIso: string,
): Promise<ServiceResult<number>> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("ai_generation_logs")
      .select("id", { count: "exact", head: true })
      .eq("gym_id", gymId)
      .gte("created_at", sinceIso);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: count ?? 0, error: null };
  } catch {
    return {
      data: null,
      error: "Unable to reach the server. Please check your connection and try again.",
    };
  }
}
