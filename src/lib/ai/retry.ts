function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RetryOptions {
  isRetryable: (error: unknown) => boolean;
  maxAttempts?: number;
  baseDelayMs?: number;
}

const DEFAULT_MAX_ATTEMPTS = 2; // initial attempt + a single retry
const DEFAULT_BASE_DELAY_MS = 1000;

/**
 * Generic retry-with-exponential-backoff wrapper — intentionally provider-
 * agnostic. Each provider supplies its own isRetryable predicate (built
 * from its own SDK's error classes), so this same helper works unchanged
 * for Anthropic today and any future provider (e.g. OpenAI).
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (!options.isRetryable(err) || isLastAttempt) {
        throw err;
      }
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }

  // Unreachable — the loop above always either returns or throws — but
  // TypeScript can't infer that from a `for` loop, so this satisfies it.
  throw new Error("Exhausted retry attempts.");
}
