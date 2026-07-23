export interface AiCompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  /**
   * Signals intent, not mechanism — each provider decides how to honor
   * this (e.g. Anthropic uses an assistant-turn prefill trick, OpenAI
   * would use its native response_format option). Callers never need to
   * know which.
   */
  expectJson?: boolean;
}

export interface AiCompletionResult {
  text: string;
}

export interface AiProvider {
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>;
}

export class AiProviderError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AiProviderError";
  }
}

export class AiTimeoutError extends AiProviderError {
  constructor() {
    super("The AI provider took too long to respond.");
    this.name = "AiTimeoutError";
  }
}

export class AiEmptyResponseError extends AiProviderError {
  constructor() {
    super("The AI provider returned an empty response.");
    this.name = "AiEmptyResponseError";
  }
}
