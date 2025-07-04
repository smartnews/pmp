import OpenAI from "openai";
import { FormSchema, ProviderSettingsDefinition } from "../types";
import { GaiToolkit } from "./gai-tool-kit";
// import * as gaiPrompt from "~/lib/gai-client/gaiPrompt";
import { useModels } from "~/lib/hooks/useModels";

const { gptModels } = GaiToolkit;

type OpenAIProviderSettings = Omit<
  OpenAI.Chat.Completions.CompletionCreateParams,
  "messages"
>;

const defaultSettings: OpenAIProviderSettings = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  max_tokens: 256,
  // top_p: 1,
  // frequency_penalty: 0,
  // presence_penalty: 0,
};

const latestModels = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "claude-3-haiku-20240307",
  "claude-3-sonnet-20240229",
  "claude-3-opus-20240229",
  "claude-3-haiku-20240307-bedrock",
  "claude-3-sonnet-20240229-bedrock",
  "claude-3-opus-20240229-bedrock",
  "claude-3-5-haiku-20241022-bedrock",
  "claude-3-5-haiku-20241022",
  "claude-3-5-sonnet-20240620-bedrock",
  "claude-3-5-sonnet-20240620",
  "claude-3-7-sonnet-20250219-bedrock",
  "claude-3-7-sonnet-20250219",
  "claude-sonnet-4-20250514-bedrock",
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514-bedrock",
  "claude-opus-4-20250514",
  "gemini-2.0-flash-001",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gpt-4o-mini-azure",
  "gpt-4o-azure",
  "gpt-4.1-azure",
  "deepseek-r1",
  "gemini-2.0-flash-google-genai",
  "gemini-2.5-flash-google-genai",
  "gemini-2.5-pro-google-genai"
];

export const GenerateFormSchema = (
  settings: OpenAIProviderSettings
): FormSchema => {
  const { models } = useModels()

  const options = Object.values(latestModels).map((model) => ({
    value: model,
    label: model,
  }));

  const maxResponseTokensValue = gptModels[settings.model].maxTokens;

  return [
    {
      label: "Model",
      name: "model",
      type: "select",
      options,
    },
    {
      label: "Temperature",
      name: "temperature",
      type: "slider",
      min: 0,
      max: 1,
      step: 0.1,
    },
    {
      label: "Max Response Length",
      name: "max_tokens",
      type: "slider",
      min: 1,
      max: maxResponseTokensValue,
      step: 1,
    },
    // TODO: enable the following settings if need in the future
    // {
    //   label: "Top P",
    //   name: "top_p",
    //   type: "slider",
    //   min: 0,
    //   max: 1,
    //   step: 0.1,
    // },
    // {
    //   label: "Frequency Penalty",
    //   name: "frequency_penalty",
    //   type: "slider",
    //   min: 0,
    //   max: 1,
    //   step: 0.1,
    // },
    // {
    //   label: "Presence Penalty",
    //   name: "presence_penalty",
    //   type: "slider",
    //   min: 0,
    //   max: 1,
    //   step: 0.1,
    // },
  ];
};

export const openAIChatCompletionSettingsDefinition: ProviderSettingsDefinition<OpenAIProviderSettings> =
{
  defaultSettings,
  GenerateFormSchema,
};
