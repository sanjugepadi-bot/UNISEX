import { getRecentAiGenerationCount } from "@/services/aiUsage";

export const AI_RATE_LIMIT_MAX_GENERATIONS = 20;
export const AI_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export interface RateLimitResult {
  allowed: boolean;
  error: string | null;
}

/**
 * Checks whether a gym has exceeded its AI generation budget for the
 * current rolling window. Fails open on infrastructure errors — a DB
 * hiccup in the rate-limit check itself should not block a legitimate
 * generation request.
 */
export async function checkAiRateLimit(gymId: string): Promise<RateLimitResult> {
  const sinceIso = new Date(Date.now() - AI_RATE_LIMIT_WINDOW_MS).toISOString();
  const { data: count, error } = await getRecentAiGenerationCount(gymId, sinceIso);

  if (error) {
    return { allowed: true, error: null };
  }

  if ((count ?? 0) >= AI_RATE_LIMIT_MAX_GENERATIONS) {
    return {
      allowed: false,
      error: `Your gym has reached the limit of ${AI_RATE_LIMIT_MAX_GENERATIONS} AI-generated plans per hour. Please try again later.`,
    };
  }

  return { allowed: true, error: null };
}
