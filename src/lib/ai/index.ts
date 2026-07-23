import type { AiProvider } from "./types";
import { anthropicProvider } from "./anthropicProvider";

/**
 * The swap point for a future provider (e.g. OpenAI): implement AiProvider
 * in a new file and return it from here instead. No caller of
 * getAiProvider() needs to change.
 */
export function getAiProvider(): AiProvider {
  return anthropicProvider;
}

export * from "./types";
