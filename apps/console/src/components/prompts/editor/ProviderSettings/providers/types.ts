export interface LLMSettings {
  promptCostPer1000Tokens: number;
  completionsCostPer1000Tokens: number;
  maxTokens: number;
  trainingCostPer1000Tokens?: number;
}

export interface LLMCostOptions {
  promptTokens: number;
  completionTokens: number;
}
