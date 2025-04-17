/**
 * Copyright 2024 Xavier Portilla Edo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import {
  Message,
  GenerateRequest,
  GenerationCommonConfigSchema,
  MessageData,
  Part,
  Role,
  ToolRequestPart,
  Genkit,
} from "genkit";

import {
  ModelResponseData,
  ModelAction,
  modelRef,
  ToolDefinition,
} from "genkit/model";

import {
  ChatChoiceOutput,
  ChatRequestMessage,
  ModelClient,
  GetChatCompletionsDefaultResponse,
  GetChatCompletions200Response,
  ChatCompletionsToolCall,
  ChatCompletionsToolDefinition,
  FunctionDefinition,
  ChatMessageContentItem,
  ChatMessageImageDetailLevel,
} from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";

export const openAIGpt41 = modelRef({
  name: "github/gpt-4.1",
  info: {
    versions: ["gpt-4.1"],
    label: "OpenAI - GPT-4.1",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIGpt41Mini = modelRef({
  name: "github/gpt-4.1-mini",
  info: {
    versions: ["gpt-4.1-mini"],
    label: "OpenAI - GPT-4.1 Mini",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIGpt41Nano = modelRef({
  name: "github/gpt-4.1-nano",
  info: {
    versions: ["gpt-4.1-nano"],
    label: "OpenAI - GPT-4.1 Nano",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIGpt4o = modelRef({
  name: "github/gpt-4o",
  info: {
    versions: ["gpt-4o"],
    label: "OpenAI - GPT-4o",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIGpt4oMini = modelRef({
  name: "github/gpt-4o-mini",
  info: {
    versions: ["gpt-4o-mini"],
    label: "OpenAI - GPT-4o-mini",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO1Preview = modelRef({
  name: "github/o1-preview",
  info: {
    versions: ["o1-preview"],
    label: "OpenAI - o1-preview",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO1Mini = modelRef({
  name: "github/o1-mini",
  info: {
    versions: ["o1-mini"],
    label: "OpenAI - o1-mini",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO1 = modelRef({
  name: "github/o1",
  info: {
    versions: ["o1"],
    label: "OpenAI - o1",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO3 = modelRef({
  name: "github/o3",
  info: {
    versions: ["o3"],
    label: "OpenAI - o3",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO3Mini = modelRef({
  name: "github/o3-mini",
  info: {
    versions: ["o3-mini"],
    label: "OpenAI - o3-mini",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const openAIO4Mini = modelRef({
  name: "github/o4-mini",
  info: {
    versions: ["o4-mini"],
    label: "OpenAI - o4-mini",
    supports: {
      multiturn: true,
      tools: false,
      media: false,
      systemRole: false,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama370bInstruct = modelRef({
  name: "github/meta-llama-3-70b-instruct",
  info: {
    versions: ["meta-llama-3-70b-instruct"],
    label: "Meta - Llama-3-70b-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama38bInstruct = modelRef({
  name: "github/meta-llama-3-8b-instruct",
  info: {
    versions: ["meta-llama-3-8b-instruct"],
    label: "Meta - Llama-3-8b-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama31405bInstruct = modelRef({
  name: "github/meta-llama-3.1-405b-instruct",
  info: {
    versions: ["meta-llama-3.1-405b-instruct"],
    label: "Meta - Llama-3.1-405b-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3170bInstruct = modelRef({
  name: "github/meta-llama-3.1-70b-instruct",
  info: {
    versions: ["meta-llama-3.1-70b-instruct"],
    label: "Meta - Llama-3.1-70b-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama318bInstruct = modelRef({
  name: "github/meta-llama-3.1-8b-instruct",
  info: {
    versions: ["meta-llama-3.1-8b-instruct"],
    label: "Meta - Llama-3.1-8b-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3211bVisionInstruct = modelRef({
  name: "github/Llama-3.2-11B-Vision-Instruct",
  info: {
    versions: ["Llama-3.2-11B-Vision-Instruct"],
    label: "Meta - Llama-3.2-11b-vision-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3290bVisionInstruct = modelRef({
  name: "github/Llama-3.2-90B-Vision-Instruct",
  info: {
    versions: ["Llama-3.2-90B-Vision-Instruct"],
    label: "Meta - Llama-3.2-90b-vision-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3370bInstruct = modelRef({
  name: "github/Llama-3.3-70B-Instruct",
  info: {
    versions: ["Llama-3.3-70B-Instruct"],
    label: "Meta - Llama-3.3-70B-Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama4Scout17bInstruct = modelRef({
  name: "github/Llama-4-Scout-17B-16E-Instruct",
  info: {
    versions: ["Llama-4-Scout-17B-16E-Instructt"],
    label: "Meta - Llama-4-Scout-17B-16E-Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama4Maverick17bInstruct = modelRef({
  name: "github/Llama-4-Maverick-17B-128E-Instruct-FP8",
  info: {
    versions: ["Llama-4-Maverick-17B-128E-Instruct-FP8"],
    label: "Meta - Llama-4-Maverick-17B-128E-Instruct-FP8",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandR = modelRef({
  name: "github/cohere-command-r",
  info: {
    versions: ["cohere-command-r"],
    label: "Cohere - Command-r",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandA = modelRef({
  name: "github/cohere-command-a",
  info: {
    versions: ["cohere-command-a"],
    label: "Cohere - Command-a",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandR082024 = modelRef({
  name: "github/Cohere-command-r-08-2024",
  info: {
    versions: ["Cohere-command-r-08-2024"],
    label: "Cohere - Command-r-08-2024",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandRPlus = modelRef({
  name: "github/cohere-command-r-plus",
  info: {
    versions: ["cohere-command-r-plus"],
    label: "Cohere - Command-r-plus",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandRPlus082024 = modelRef({
  name: "github/Cohere-command-r-plus-08-2024",
  info: {
    versions: ["Cohere-command-r-plus-08-2024"],
    label: "Cohere - Command-r-plus-08-2024",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralSmall = modelRef({
  name: "github/Mistral-small",
  info: {
    versions: ["Mistral-small"],
    label: "Mistral - Small",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralLarge = modelRef({
  name: "github/Mistral-large",
  info: {
    versions: ["Mistral-large"],
    label: "Mistral - Large",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralLarge2407 = modelRef({
  name: "github/Mistral-large-2407",
  info: {
    versions: ["Mistral-large-2407"],
    label: "Mistral - Large-2407",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralLarge2411 = modelRef({
  name: "github/Mistral-large-24111",
  info: {
    versions: ["Mistral-large-2411"],
    label: "Mistral - Large-2411",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralCodestral2501 = modelRef({
  name: "github/Codestral-2501",
  info: {
    versions: ["Codestral-2501"],
    label: "Mistral - Codestral-2501",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralNemo = modelRef({
  name: "github/Mistral-nemo",
  info: {
    versions: ["Mistral-nemo"],
    label: "Mistral - Nemo",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ministral3B = modelRef({
  name: "github/Ministral-3b",
  info: {
    versions: ["Ministral-3B"],
    label: "Ministral - 3B",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jamba15Mini = modelRef({
  name: "github/ai21-jamba-1.5-mini",
  info: {
    versions: ["ai21-jamba-1.5-mini"],
    label: "AI21Labs - Jamba-1.5-mini",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jamba15Large = modelRef({
  name: "github/ai21-jamba-1.5-large",
  info: {
    versions: ["ai21-jamba-1.5-large"],
    label: "AI21Labs - Jamba-1.5-large",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Mini4kInstruct = modelRef({
  name: "github/Phi-3-mini-4k-instruct",
  info: {
    versions: ["Phi-3-mini-4k-instruct"],
    label: "Microsoft - Phi-3-mini-4k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Mini128kInstruct = modelRef({
  name: "github/Phi-3-mini-128k-instruct",
  info: {
    versions: ["Phi-3-mini-128k-instruct"],
    label: "Microsoft - Phi-3-mini-128k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Small8kInstruct = modelRef({
  name: "github/Phi-3-small-8k-instruct",
  info: {
    versions: ["Phi-3-small-8k-instruct"],
    label: "Microsoft - Phi-3-small-8k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Small128kInstruct = modelRef({
  name: "github/Phi-3-small-128k-instruct",
  info: {
    versions: ["Phi-3-small-128k-instruct"],
    label: "Microsoft - Phi-3-small-128k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Medium4kInstruct = modelRef({
  name: "github/Phi-3-medium-4k-instruct",
  info: {
    versions: ["Phi-3-medium-4k-instruct"],
    label: "Microsoft - Phi-3-medium-4k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi3Medium128kInstruct = modelRef({
  name: "github/Phi-3-medium-128k-instruct",
  info: {
    versions: ["Phi-3-medium-128k-instruct"],
    label: "Microsoft - Phi-3-medium-128k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi35Mini128kInstruct = modelRef({
  name: "github/Phi-3.5-mini-instruct",
  info: {
    versions: ["Phi-3.5-mini-instruct"],
    label: "Microsoft - Phi-3.5-mini-128k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi35MoE128kInstruct = modelRef({
  name: "github/Phi-3.5-moe-instruct",
  info: {
    versions: ["Phi-3.5-moe-instruct"],
    label: "Microsoft - Phi-3.5-moe-128k-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi35Vision128kInstruct = modelRef({
  name: "github/Phi-3.5-vision-instruct",
  info: {
    versions: ["Phi-3.5-vision-instruct"],
    label: "Microsoft - Phi-3.5-vision-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi4 = modelRef({
  name: "github/Phi-4",
  info: {
    versions: ["Phi-4"],
    label: "Microsoft - Phi-4",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi4MultimodalInstruct = modelRef({
  name: "github/Phi-4-multimodal-instruct",
  info: {
    versions: ["Phi-4-multimodal-instruct"],
    label: "Microsoft - Phi-4-multimodal",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftPhi4MiniInstruct = modelRef({
  name: "github/Phi-4-mini-instruct",
  info: {
    versions: ["Phi-4-mini-instruct"],
    label: "Microsoft - Phi-4-mini-instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const microsoftMaiDsR1 = modelRef({
  name: "github/MAI-DS-R1",
  info: {
    versions: ["MAI-DS-R1"],
    label: "Microsoft - MAI-DS-R1",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const jais30bChat = modelRef({
  name: "github/jais-30b-chat",
  info: {
    versions: ["jais-30b-chat"],
    label: "Jais - 30b-chat",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const deepseekR1 = modelRef({
  name: "github/DeepSeek-R1",
  info: {
    versions: ["DeepSeek-R1"],
    label: "DeepSeek - R1",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const SUPPORTED_GITHUB_MODELS: Record<string, any> = {
  "gpt-4.1": openAIGpt41,
  "gpt-4.1-mini": openAIGpt41Mini,
  "gpt-4.1-nano": openAIGpt41Nano,
  "gpt-4o": openAIGpt4o,
  "gpt-4o-mini": openAIGpt4oMini,
  "o1-preview": openAIO1Preview,
  "o1-mini": openAIO1Mini,
  o1: openAIO1,
  o3: openAIO3,
  "o3-mini": openAIO3Mini,
  "o4-mini": openAIO4Mini,
  "meta-llama-3-70b-instruct": metaLlama370bInstruct,
  "meta-llama-3-8b-instruct": metaLlama38bInstruct,
  "meta-llama-3.1-405b-instruct": metaLlama31405bInstruct,
  "meta-llama-3.1-70b-instruct": metaLlama3170bInstruct,
  "meta-llama-3.1-8b-instruct": metaLlama318bInstruct,
  "Llama-3.2-11B-Vision-Instruct": metaLlama3211bVisionInstruct,
  "Llama-3.2-90B-Vision-Instruct": metaLlama3290bVisionInstruct,
  "Llama-3.3-70B-Instruct": metaLlama3370bInstruct,
  "Llama-4-Scout-17B-16E-Instruct": metaLlama4Scout17bInstruct,
  "Llama-4-Maverick-17B-128E-Instruct-FP8": metaLlama4Maverick17bInstruct,
  "cohere-command-a": cohereCommandA,
  "Cohere-command-r": cohereCommandR,
  "Cohere-command-r-plus": cohereCommandRPlus,
  "Cohere-command-r-08-2024": cohereCommandR082024,
  "Cohere-command-r-plus-08-2024": cohereCommandRPlus082024,
  "Mistral-small": mistralSmall,
  "Mistral-large": mistralLarge,
  "Mistral-large-2407": mistralLarge2407,
  "Mistral-large-2411": mistralLarge2411,
  "Mistral-nemo": mistralNemo,
  "Ministral-3B": ministral3B,
  "Codestral-2501": mistralCodestral2501,
  "ai21-jamba-1.5-mini": ai21Jamba15Mini,
  "ai21-jamba-1.5-large": ai21Jamba15Large,
  "Phi-3-mini-4k-instruct": microsoftPhi3Mini4kInstruct,
  "Phi-3-mini-128k-instruct": microsoftPhi3Mini128kInstruct,
  "Phi-3-small-8k-instruct": microsoftPhi3Small8kInstruct,
  "Phi-3-small-128k-instruct": microsoftPhi3Small128kInstruct,
  "Phi-3-medium-4k-instruct": microsoftPhi3Medium4kInstruct,
  "Phi-3-medium-128k-instruct": microsoftPhi3Medium128kInstruct,
  "Phi-3.5-mini-instruct": microsoftPhi35Mini128kInstruct,
  "Phi-3.5-moe-instruct": microsoftPhi35MoE128kInstruct,
  "Phi-3.5-vision-instruct": microsoftPhi35Vision128kInstruct,
  "Phi-4": microsoftPhi4,
  "Phi-4-multimodal-instruct": microsoftPhi4MultimodalInstruct,
  "Phi-4-mini-instruct": microsoftPhi4MiniInstruct,
  "MAI-DS-R1": microsoftMaiDsR1,
  "jais-30b-chat": jais30bChat,
  "DeepSeek-R1": deepseekR1,
};

function toGithubRole(role: Role): string {
  switch (role) {
    case "user":
      return "user";
    case "model":
      return "assistant";
    case "system":
      return "system";
    case "tool":
      return "tool";
    default:
      throw new Error(`role ${role} doesn't map to an Github Models role.`);
  }
}

function toGithubTool(tool: ToolDefinition): ChatCompletionsToolDefinition {
  return {
    type: "function",
    function: {
      name: tool.name,
      parameters: tool.inputSchema,
      description: tool.description,
    } as FunctionDefinition,
  };
}

export function toGithubTextAndMedia(
  part: Part,
  visualDetailLevel: ChatMessageImageDetailLevel,
): ChatMessageContentItem {
  if (part.text) {
    return {
      type: "text",
      text: part.text,
    };
  } else if (part.media) {
    return {
      type: "image_url",
      image_url: {
        url: part.media.url,
        detail: visualDetailLevel,
      },
    };
  }
  throw Error(
    `Unsupported genkit part fields encountered for current message role: ${part}.`,
  );
}

export function toGithubMessages(
  messages: MessageData[],
  visualDetailLevel: ChatMessageImageDetailLevel = "auto",
): ChatRequestMessage[] {
  const githubMsgs: ChatRequestMessage[] = [];
  for (const message of messages) {
    const msg = new Message(message);
    const role = toGithubRole(message.role);
    switch (role) {
      case "user": {
        const textAndMedia = msg.content.map((part) =>
          toGithubTextAndMedia(part, visualDetailLevel),
        );
        if (textAndMedia.length > 1) {
          githubMsgs.push({
            role: role,
            content: textAndMedia,
          });
        } else {
          githubMsgs.push({
            role: role,
            content: msg.text,
          });
        }
        break;
      }
      case "system":
        githubMsgs.push({
          role: role,
          content: msg.text,
        });
        break;
      case "assistant": {
        const toolCalls: ChatCompletionsToolCall[] = msg.content
          .filter((part) => part.toolRequest)
          .map((part) => {
            if (!part.toolRequest) {
              throw Error(
                "Mapping genkit message to openai tool call content part but message.toolRequest not provided.",
              );
            }
            return {
              id: part.toolRequest.ref || "",
              type: "function",
              function: {
                name: part.toolRequest.name,
                arguments: JSON.stringify(part.toolRequest.input),
              },
            };
          });
        if (toolCalls?.length > 0) {
          githubMsgs.push({
            role: role,
            tool_calls: toolCalls,
          });
        } else {
          githubMsgs.push({
            role: role,
            content: msg.text,
          });
        }
        break;
      }
      case "tool": {
        const toolResponseParts = msg.toolResponseParts();
        toolResponseParts.map((part) => {
          githubMsgs.push({
            role: role,
            tool_call_id: part.toolResponse.ref || "",
            content:
              typeof part.toolResponse.output === "string"
                ? part.toolResponse.output
                : JSON.stringify(part.toolResponse.output),
          });
        });
        break;
      }
      default:
        throw new Error("unrecognized role");
    }
  }
  return githubMsgs;
}

const finishReasonMap: Record<
  NonNullable<string>,
  ModelResponseData["finishReason"]
> = {
  length: "length",
  stop: "stop",
  tool_calls: "stop",
  content_filter: "blocked",
};

function fromGithubToolCall(toolCall: ChatCompletionsToolCall) {
  if (!("function" in toolCall)) {
    throw Error(
      `Unexpected github chunk choice. tool_calls was provided but one or more tool_calls is missing.`,
    );
  }
  const f = toolCall.function;
  return {
    toolRequest: {
      name: f.name,
      ref: toolCall.id,
      input: f.arguments ? JSON.parse(f.arguments) : f.arguments,
    },
  };
}

function fromGithubChoice(
  choice: ChatChoiceOutput,
  jsonMode = false,
): ModelResponseData {
  const toolRequestParts = choice.message.tool_calls?.map(fromGithubToolCall);
  return {
    finishReason:
      "finish_reason" in choice
        ? finishReasonMap[choice.finish_reason!]
        : "other",
    message: {
      role: "model",
      content:
        (toolRequestParts?.length ?? 0) > 0
          ? (toolRequestParts as ToolRequestPart[])
          : [
              jsonMode
                ? { data: JSON.parse(choice.message.content!) }
                : { text: choice.message.content! },
            ],
    },
    custom: {},
  };
}

function fromGithubChunkChoice(choice: any): ModelResponseData {
  return {
    finishReason: choice.content
      ? finishReasonMap[choice.finishReason] || "other"
      : "unknown",
    message: {
      role: "model",
      content: [{ text: choice.delta?.content ?? "" }],
    },
    custom: {},
  };
}

export function toGithubRequestBody(
  modelName: string,
  request: GenerateRequest<typeof GenerationCommonConfigSchema>,
) {
  const model = SUPPORTED_GITHUB_MODELS[modelName];
  if (!model) throw new Error(`Unsupported model: ${modelName}`);
  const githubMessages = toGithubMessages(request.messages);

  const jsonMode =
    request.output?.format === "json" ||
    request.output?.contentType === "application/json";

  const textMode =
    request.output?.format === "text" ||
    request.output?.contentType === "plain/text";

  let responseFormat;
  const response_format = request.output?.format
    ? request.output?.format
    : request.output?.contentType;
  if (jsonMode && model.info.supports?.output?.includes("json")) {
    responseFormat = {
      type: "json_object",
    };
  } else if (
    (textMode && model.info.supports?.output?.includes("text")) ||
    model.info.supports?.output?.includes("text")
  ) {
    responseFormat = {
      type: "text",
    };
  } else {
    throw new Error(
      `${response_format} format is not supported for GPT models currently`,
    );
  }
  const modelString = (request.config?.version ||
    model.version ||
    modelName) as string;
  const body = {
    body: {
      messages: githubMessages,
      tools: request.tools?.map(toGithubTool),
      model: modelString,
      max_tokens: request.config?.maxOutputTokens,
      temperature: request.config?.temperature,
      top_p: request.config?.topP,
      n: request.candidates,
      stop: request.config?.stopSequences,
      // FIXME: coherence models don't support response_format for now
      response_format: modelString.includes("cohere") ? "" : responseFormat,
    },
  } as any;

  for (const key in body.body) {
    if (
      !body.body[key] ||
      (Array.isArray(body.body[key]) && !body.body[key].length)
    )
      delete body.body[key];
  }
  return body;
}

export function githubModel(
  name: string,
  client: ModelClient,
  ai: Genkit,
): ModelAction<typeof GenerationCommonConfigSchema> {
  const modelId = `github/${name}`;
  const model = SUPPORTED_GITHUB_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema: SUPPORTED_GITHUB_MODELS[name].configSchema,
    },
    async (request, streamingCallback) => {
      let response:
        | GetChatCompletions200Response
        | GetChatCompletionsDefaultResponse;
      const body = toGithubRequestBody(name, request);
      if (streamingCallback) {
        body.body.stream = true;
        response = await client.path("/chat/completions").post(body);
        const stream = response.body;
        const sseStream = createSseStream(stream as any);
        for await (const event of sseStream) {
          if (event.data === "[DONE]") {
            break;
          }
          for (const choice of JSON.parse(event.data).choices) {
            const c = fromGithubChunkChoice(choice);
            streamingCallback({
              content: [{ ...c, custom: c.custom as Record<string, any> }],
            });
          }
        }
      } else {
        response = await client.path("/chat/completions").post(body);
      }
      return {
        message:
          "choices" in response.body
            ? fromGithubChoice(
                response.body.choices[0],
                request.output?.format === "json",
              ).message
            : { role: "model", content: [] },
        usage: {
          inputTokens:
            "usage" in response.body ? response.body.usage?.prompt_tokens : 0,
          outputTokens:
            "usage" in response.body
              ? response.body.usage?.completion_tokens
              : 0,
          totalTokens:
            "usage" in response.body ? response.body.usage?.total_tokens : 0,
        },
        custom: response,
      };
    },
  );
}
