import { genkitPluginV2, type ResolvableAction } from "genkit/plugin";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { ModelAction } from "genkit/model";
import { GenerationCommonConfigSchema } from "genkit";

import {
  githubModel,
  openAIGpt41,
  openAIGpt41Mini,
  openAIGpt41Nano,
  openAIGpt4o,
  openAIGpt4oMini,
  openAIO1Preview,
  openAIO1Mini,
  openAIO1,
  openAIO3Mini,
  openAIO3,
  openAIO4Mini,
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  metaLlama3211bVisionInstruct,
  metaLlama3290bVisionInstruct,
  metaLlama3370bInstruct,
  metaLlama4Scout17bInstruct,
  metaLlama4Maverick17bInstruct,
  cohereCommandA,
  cohereCommandR,
  cohereCommandRPlus,
  cohereCommandR082024,
  cohereCommandRPlus082024,
  mistralSmall,
  mistralLarge,
  mistralLarge2407,
  mistralLarge2411,
  mistralNemo,
  mistralCodestral2501,
  ministral3B,
  ai21Jamba15Mini,
  ai21Jamba15Large,
  microsoftPhi3Mini4kInstruct,
  microsoftPhi3Mini128kInstruct,
  microsoftPhi3Small8kInstruct,
  microsoftPhi3Small128kInstruct,
  microsoftPhi3Medium4kInstruct,
  microsoftPhi3Medium128kInstruct,
  microsoftPhi35Mini128kInstruct,
  microsoftPhi35MoE128kInstruct,
  microsoftPhi35Vision128kInstruct,
  microsoftPhi4,
  microsoftPhi4MultimodalInstruct,
  microsoftPhi4MiniInstruct,
  microsoftMaiDsR1,
  jais30bChat,
  deepseekR1,
  SUPPORTED_GITHUB_MODELS,
} from "./github_llms.js";
import {
  cohereEmbedv3English,
  cohereEmbedv3Multilingual,
  cohereEmbedv4,
  githubEmbedder,
  openAITextEmbedding3Large,
  openAITextEmbedding3Small,
  SUPPORTED_EMBEDDING_MODELS,
} from "./github_embedders.js";

export {
  openAIGpt41,
  openAIGpt41Mini,
  openAIGpt41Nano,
  openAIGpt4o,
  openAIGpt4oMini,
  openAIO1Preview,
  openAIO1Mini,
  openAIO1,
  openAIO3Mini,
  openAIO3,
  openAIO4Mini,
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  metaLlama3211bVisionInstruct,
  metaLlama3290bVisionInstruct,
  metaLlama3370bInstruct,
  metaLlama4Scout17bInstruct,
  metaLlama4Maverick17bInstruct,
  cohereCommandA,
  cohereCommandRPlus,
  cohereCommandR,
  cohereCommandR082024,
  cohereCommandRPlus082024,
  mistralSmall,
  mistralLarge,
  mistralLarge2407,
  mistralLarge2411,
  mistralCodestral2501,
  mistralNemo,
  ministral3B,
  ai21Jamba15Mini,
  ai21Jamba15Large,
  microsoftPhi3Mini4kInstruct,
  microsoftPhi3Mini128kInstruct,
  microsoftPhi3Small8kInstruct,
  microsoftPhi3Small128kInstruct,
  microsoftPhi3Medium4kInstruct,
  microsoftPhi3Medium128kInstruct,
  microsoftPhi35Mini128kInstruct,
  microsoftPhi35MoE128kInstruct,
  microsoftPhi35Vision128kInstruct,
  microsoftPhi4,
  microsoftPhi4MultimodalInstruct,
  microsoftPhi4MiniInstruct,
  microsoftMaiDsR1,
  jais30bChat,
  deepseekR1,
};

export {
  openAITextEmbedding3Small,
  openAITextEmbedding3Large,
  cohereEmbedv3English,
  cohereEmbedv3Multilingual,
  cohereEmbedv4,
};

export interface PluginOptions {
  githubToken?: string;
  endpoint?: string;
  apiVersion?: string;
  /**
   * Additional model names to register that are not in the predefined list.
   * These models will be available using the 'github/model-name' format.
   * @example ['gpt-4-turbo', 'custom-model-name']
   */
  customModels?: string[];
}

/**
 * Defines a custom GitHub model that is not exported by the plugin
 * @param name - The name of the model (e.g., "gpt-4-turbo", "custom-model")
 * @param options - Plugin options including githubToken, endpoint, and apiVersion
 * @returns A ModelAction that can be used with Genkit
 *
 * @example
 * ```typescript
 * import { defineGithubModel } from 'genkitx-github';
 *
 * const customModel = defineGithubModel('my-custom-model', {
 *   githubToken: process.env.GITHUB_TOKEN
 * });
 *
 * const response = await ai.generate({
 *   model: customModel,
 *   prompt: 'Hello!'
 * });
 * ```
 */
export function defineGithubModel(
  name: string,
  options?: PluginOptions,
): ModelAction<typeof GenerationCommonConfigSchema> {
  const token = options?.githubToken || process.env.GITHUB_TOKEN;
  let endpoint = options?.endpoint || process.env.GITHUB_ENDPOINT;
  const apiVersion = options?.apiVersion || "2024-12-01-preview";

  if (!token) {
    throw new Error(
      "Please pass in the TOKEN key or set the GITHUB_TOKEN environment variable",
    );
  }
  if (!endpoint) {
    endpoint = "https://models.github.ai/inference";
  }

  const client = ModelClient(endpoint, new AzureKeyCredential(token), {
    apiVersion: apiVersion,
  });

  return githubModel(name, client);
}

export function github(options?: PluginOptions) {
  const token = options?.githubToken || process.env.GITHUB_TOKEN;
  let endpoint = options?.endpoint || process.env.GITHUB_ENDPOINT;
  const apiVersion = options?.apiVersion || "2024-12-01-preview";
  if (!token) {
    throw new Error(
      "Please pass in the TOKEN key or set the GITHUB_TOKEN environment variable",
    );
  }
  if (!endpoint) {
    endpoint = "https://models.github.ai/inference";
  }

  const client = ModelClient(endpoint, new AzureKeyCredential(token), {
    apiVersion: apiVersion,
  });

  return genkitPluginV2({
    name: "github",
    init: async () => {
      const actions: ResolvableAction[] = [];

      // Register models
      for (const name of Object.keys(SUPPORTED_GITHUB_MODELS)) {
        actions.push(githubModel(name, client));
      }

      // Register custom models if provided
      if (options?.customModels) {
        for (const name of options.customModels) {
          actions.push(githubModel(name, client));
        }
      }

      // Register embedders
      for (const name of Object.keys(SUPPORTED_EMBEDDING_MODELS)) {
        actions.push(githubEmbedder(name, client));
      }

      return actions;
    },
  });
}

export default github;
