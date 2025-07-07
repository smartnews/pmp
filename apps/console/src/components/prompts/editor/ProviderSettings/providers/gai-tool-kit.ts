import { LLMCostOptions, LLMSettings } from "./types";

const gaiToolkit = () => {
  const defineModel = <T>(settings: T): T => settings;

  const calculateGptCost = ({
                              model,
                              promptTokens,
                              completionTokens,
                            }: LLMCostOptions & { model: keyof typeof gptModels }) => {
    const promptCost =
      (promptTokens / 1000) * gptModels[model].promptCostPer1000Tokens;
    const completionCost =
      (completionTokens / 1000) * gptModels[model].completionsCostPer1000Tokens;

    return {
      promptCost,
      completionCost,
    };
  };

  const gptModels = {
    /**
     * GPT-3.5
     */
    ["gpt-3.5-turbo"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0015,
      completionsCostPer1000Tokens: 0.002,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-16k"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.004,
      maxTokens: 16385,
    }),
    // New GPT-3.5 turbo model (Novermber 2023)
    ["gpt-3.5-turbo-1106"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0010,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-instruct"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0015,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    ["gpt-3.5-turbo-0125"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0010,
      completionsCostPer1000Tokens: 0.0020,
      maxTokens: 4096,
    }),
    /**
     * GPT-4
     */
    ["gpt-4"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.03,
      completionsCostPer1000Tokens: 0.06,
      maxTokens: 8192,
    }),
    ["gpt-4-turbo"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.06,
      completionsCostPer1000Tokens: 0.12,
      maxTokens: 4096,
    }),
    ["gpt-4-32k"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.06,
      completionsCostPer1000Tokens: 0.12,
      maxTokens: 32768,
    }),
    // Same as above
    ["gpt-4-1106-preview"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["gpt-4-0125-preview"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    // Same as above
    ["gpt-4-vision-preview"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["gpt-4o"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 16384,
    }),
    ["gpt-4o-mini"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.00015,
      completionsCostPer1000Tokens: 0.0006,
      maxTokens: 16384,
    }),
    ["gpt-4.1"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.002,
      completionsCostPer1000Tokens: 0.008,
      maxTokens: 32768,
    }),
    ["gpt-4.1-mini"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.004,
      completionsCostPer1000Tokens: 0.0006,
      maxTokens: 32768,
    }),
    ["gpt-4.1-nano"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.00015,
      completionsCostPer1000Tokens: 0.0006,
      maxTokens: 32768,
    }),
    /**
     * OpenAI on Azure
     */
    ["gpt-4o-azure"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0025,
      completionsCostPer1000Tokens: 0.010,
      maxTokens: 16384,
    }),
    ["gpt-4o-mini-azure"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.00015,
      completionsCostPer1000Tokens: 0.0006,
      maxTokens: 16384,
    }),
    ["gpt-4.1-azure"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.002,
      completionsCostPer1000Tokens: 0.008,
      maxTokens: 32768,
    }),
    /**
     * Claude
     */
    ["claude-3-haiku-20240307"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-sonnet-20240229"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-opus-20240229"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-5-haiku-20241022"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0008,
      completionsCostPer1000Tokens: 0.004,
      maxTokens: 8192,
    }),
    ["claude-3-5-sonnet-20240620"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 8192,
    }),
    ["claude-3-7-sonnet-20250219"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 64000,
    }),
    ["claude-sonnet-4-20250514"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 64000,
    }),
    ["claude-opus-4-20250514"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.015,
      completionsCostPer1000Tokens: 0.075,
      maxTokens: 32000,
    }),
    /**
     * Claude on Bedrock
    */
    ["claude-3-haiku-20240307-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-sonnet-20240229-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-opus-20240229-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 4096,
    }),
    ["claude-3-5-haiku-20241022-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0008,
      completionsCostPer1000Tokens: 0.004,
      maxTokens: 8192,
    }),
    ["claude-3-5-sonnet-20240620-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 8192,
    }),
    ["claude-3-7-sonnet-20250219-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 64000,
    }),
    ["claude-sonnet-4-20250514-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.003,
      completionsCostPer1000Tokens: 0.015,
      maxTokens: 64000,
    }),
    ["claude-opus-4-20250514-bedrock"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.015,
      completionsCostPer1000Tokens: 0.075,
      maxTokens: 32000,
    }),
    /**
     * Gemini via VerteX AI
     */
    ["gemini-pro"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 2048,
    }),
    ["gemini-1.5-pro-preview-0409"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.01,
      completionsCostPer1000Tokens: 0.03,
      maxTokens: 8192,
    }),
    ["gemini-2.0-flash-001"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0001,
      completionsCostPer1000Tokens: 0.0004,
      maxTokens: 8192,
    }),
    ["gemini-2.5-pro"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.00125,
      completionsCostPer1000Tokens: 0.010,
      maxTokens: 65536,
    }),
    ["gemini-2.5-flash"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0003,
      completionsCostPer1000Tokens: 0.0025,
      maxTokens: 65536,
    }),
    /**
     * Gemini via Gemini API
     */
    ["gemini-2.0-flash-google-genai"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0001,
      completionsCostPer1000Tokens: 0.0004,
      maxTokens: 8192,
    }),
    ["gemini-2.5-pro-google-genai"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.00125,
      completionsCostPer1000Tokens: 0.010,
      maxTokens: 65536,
    }),
    ["gemini-2.5-flash-google-genai"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.0003,
      completionsCostPer1000Tokens: 0.0025,
      maxTokens: 65536,
    }),
    /**
     * DeepSeek
     */
    ["deepseek-r1"]: defineModel<LLMSettings>({
      promptCostPer1000Tokens: 0.000135,
      completionsCostPer1000Tokens: 0.00055,
      maxTokens: 64000,
    }),
  };

  return {
    calculateGptCost,
    gptModels,
  };
};

export const GaiToolkit = gaiToolkit();
