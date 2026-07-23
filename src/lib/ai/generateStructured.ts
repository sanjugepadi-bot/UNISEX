import type { z } from "zod";
import { getAiProvider, AiProviderError } from "./index";

interface GenerateStructuredParams<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodType<T>;
  maxTokens?: number;
}

/**
 * Shared "ask the AI for JSON matching this schema" flow: resolves the
 * configured provider, requests a completion, parses the result as JSON,
 * and validates it against the given Zod schema before returning. Used by
 * both the workout and diet plan generators so this logic — and its error
 * handling — exists in exactly one place.
 */
export async function generateStructured<T>({
  systemPrompt,
  userPrompt,
  schema,
  maxTokens,
}: GenerateStructuredParams<T>): Promise<T> {
  const provider = getAiProvider();

  const { text } = await provider.complete({
    systemPrompt,
    userPrompt,
    maxTokens,
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

  const validated = schema.safeParse(parsedJson);
  if (!validated.success) {
    throw new AiProviderError(
      `The AI provider's response did not match the expected structure: ${validated.error.message}`,
    );
  }

  return validated.data;
}
