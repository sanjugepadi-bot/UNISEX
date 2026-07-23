import Anthropic from "@anthropic-ai/sdk";
import type { AiProvider, AiCompletionRequest, AiCompletionResult } from "./types";
import { AiProviderError, AiTimeoutError, AiEmptyResponseError } from "./types";
import { withRetry } from "./retry";

const DEFAULT_MODEL = "claude-sonnet-5";
const DEFAULT_MAX_TOKENS = 2048;
const REQUEST_TIMEOUT_MS = 30_000;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AiProviderError("ANTHROPIC_API_KEY is not configured.");
  }
  return new Anthropic({ apiKey, timeout: REQUEST_TIMEOUT_MS });
}

function isRetryableAnthropicError(err: unknown): boolean {
  return (
    err instanceof Anthropic.APIConnectionTimeoutError || err instanceof Anthropic.RateLimitError
  );
}

export const anthropicProvider: AiProvider = {
  async complete({
    systemPrompt,
    userPrompt,
    maxTokens,
    expectJson,
  }: AiCompletionRequest): Promise<AiCompletionResult> {
    const client = getClient();
    const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    const messages: { role: "user" | "assistant"; content: string }[] = [
      { role: "user", content: userPrompt },
    ];
    // Priming the assistant turn with "{" forces Claude to continue directly
    // into JSON, skipping any "Sure, here's your plan:" preamble.
    if (expectJson) {
      messages.push({ role: "assistant", content: "{" });
    }

    let response;
    try {
      response = await withRetry(
        () =>
          client.messages.create({
            model,
            max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
            system: systemPrompt,
            messages,
          }),
        { isRetryable: isRetryableAnthropicError },
      );
    } catch (err) {
      if (err instanceof Anthropic.APIConnectionTimeoutError) {
        throw new AiTimeoutError();
      }
      if (err instanceof Anthropic.APIError) {
        throw new AiProviderError(`Anthropic API error: ${err.message}`, { cause: err });
      }
      throw new AiProviderError("Unexpected error calling the AI provider.", { cause: err });
    }

    const textBlock = response.content.find((block) => block.type === "text");
    let text = textBlock && "text" in textBlock ? textBlock.text.trim() : "";

    if (!text) {
      throw new AiEmptyResponseError();
    }

    // The primed "{" was never part of the API's own response text —
    // Claude only returns what it generated *after* the prime — so it has
    // to be restored here for the result to be complete, parseable JSON.
    if (expectJson && !text.startsWith("{")) {
      text = "{" + text;
    }

    return { text };
  },
};
