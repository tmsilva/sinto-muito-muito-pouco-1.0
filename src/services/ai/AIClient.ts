export interface AIModelOptions {
  temperature: number;
  maxTokens: number;
  systemInstruction?: string;
}

export interface AIClient {
  /**
   * Generates natural language content from a prompt, model identifier, and options.
   */
  generate(prompt: string, modelIdentifier: string, options: AIModelOptions): Promise<string>;
}
