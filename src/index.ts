import { Genkit } from "genkit";
import { genkitPlugin } from "genkit/plugin";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

import {
  githubModel,
  openAIGpt4o,
  openAIGpt4oMini,
  openAIO1Preview,
  openAIO1Mini,
  openAIO1,
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  metaLlama3211bVisionInstruct,
  metaLlama3290bVisionInstruct,
  metaLlama3370bInstruct,
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
  jais30bChat,
  deepseekR1,
  SUPPORTED_GITHUB_MODELS,
} from "./github_llms.js";
import {
  cohereEmbedv3English,
  cohereEmbedv3Multilingual,
  githubEmbedder,
  openAITextEmbedding3Large,
  openAITextEmbedding3Small,
  SUPPORTED_EMBEDDING_MODELS,
} from "./github_embedders.js";

export {
  openAIGpt4o,
  openAIGpt4oMini,
  openAIO1Preview,
  openAIO1Mini,
  openAIO1,
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  metaLlama3211bVisionInstruct,
  metaLlama3290bVisionInstruct,
  metaLlama3370bInstruct,
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
  jais30bChat,
  deepseekR1,
};

export {
  openAITextEmbedding3Small,
  openAITextEmbedding3Large,
  cohereEmbedv3English,
  cohereEmbedv3Multilingual,
};

export interface PluginOptions {
  githubToken?: string;
  endpoint?: string;
}

export function github(options?: PluginOptions) {
  return genkitPlugin("github", async (ai: Genkit) => {
    const token = options?.githubToken || process.env.GITHUB_TOKEN;
    let endpoint = options?.endpoint || process.env.GITHUB_ENDPOINT;
    if (!token) {
      throw new Error(
        "Please pass in the TOKEN key or set the GITHUB_TOKEN environment variable",
      );
    }
    if (!endpoint) {
      endpoint = "https://models.inference.ai.azure.com";
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    Object.keys(SUPPORTED_GITHUB_MODELS).forEach((name) => {
      githubModel(name, client, ai);
    });

    Object.keys(SUPPORTED_EMBEDDING_MODELS).forEach((name) =>
      githubEmbedder(name, ai, options),
    );
  });
}

export default github;
