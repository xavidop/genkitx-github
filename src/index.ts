import { genkitPlugin, GenkitError, Plugin } from "@genkit-ai/core";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { defineModel, GenerationCommonConfigSchema } from "@genkit-ai/ai/model";
import { simulateSystemPrompt } from "@genkit-ai/ai/model/middleware";
import { z } from "zod";
import { githubModel, SUPPORTED_GITHUB_MODELS } from "./github_llms.js";

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
      embedders: [],
    };
  },
);

export default github;
