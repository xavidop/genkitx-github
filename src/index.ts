import { genkitPlugin, Plugin } from "@genkit-ai/core";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import {
  githubModel,
  openAIGpt4o,
  openAIGpt4oMini,
  openAIO1Preview,
  openAIO1Mini,
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  cohereCommandR,
  cohereCommandRPlus,
  mistralSmall,
  mistralLarge,
  mistralLarge2407,
  mistralNemo,
  ai21Jamba15Mini,
  ai21Jamba15Large,
  microsoftPhi3Mini4kInstruct,
  microsoftPhi3Mini128kInstruct,
  microsoftPhi3Small8kInstruct,
  microsoftPhi3Small128kInstruct,
  microsoftPhi3Medium4kInstruct,
  microsoftPhi35Mini128kInstruct,
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
  metaLlama370bInstruct,
  metaLlama38bInstruct,
  metaLlama31405bInstruct,
  metaLlama3170bInstruct,
  metaLlama318bInstruct,
  cohereCommandRPlus,
  cohereCommandR,
  mistralSmall,
  mistralLarge,
  mistralLarge2407,
  mistralNemo,
  ai21Jamba15Mini,
  ai21Jamba15Large,
  microsoftPhi3Mini4kInstruct,
  microsoftPhi3Mini128kInstruct,
  microsoftPhi3Small8kInstruct,
  microsoftPhi3Small128kInstruct,
  microsoftPhi3Medium4kInstruct,
  microsoftPhi35Mini128kInstruct,
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

export const github: Plugin<[PluginOptions]> = genkitPlugin(
  "github",
  async (options: PluginOptions) => {
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

    return {
      models: [
        ...Object.keys(SUPPORTED_GITHUB_MODELS).map((name) =>
          githubModel(name, client),
        ),
      ],
      embedders: Object.keys(SUPPORTED_EMBEDDING_MODELS).map((name) =>
        githubEmbedder(name, options),
      ),
    };
  },
);

export default github;
