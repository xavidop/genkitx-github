/**
 * Copyright 2024 The Fire Company
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

import { embedderRef as createEmbedderRef } from "genkit";
import type ModelClient from "@azure-rest/ai-inference";
import type {
  GetEmbeddings200Response,
  GetEmbeddingsParameters,
} from "@azure-rest/ai-inference";
import { z } from "zod";
import { embedder } from "genkit/plugin";

export const TextEmbeddingConfigSchema = z.object({
  dimensions: z.number().optional(),
  encodingFormat: z.union([z.literal("float"), z.literal("base64")]).optional(),
});

export type TextEmbeddingGeckoConfig = z.infer<
  typeof TextEmbeddingConfigSchema
>;

export const TextEmbeddingInputSchema = z.string();

export const openAITextEmbedding3Small = createEmbedderRef({
  name: "github/text-embedding-3-small",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1536,
    label: "OpenAI - Text-embedding-3-small",
    supports: {
      input: ["text"],
    },
  },
});

export const openAITextEmbedding3Large = createEmbedderRef({
  name: "github/text-embedding-3-large",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 3072,
    label: "OpenAI - Text-embedding-3-large",
    supports: {
      input: ["text"],
    },
  },
});

export const cohereEmbedv3English = createEmbedderRef({
  name: "github/cohere-embed-v3-english",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: "Cohere - Embed-embed-v3-english",
    supports: {
      input: ["text"],
    },
  },
});

export const cohereEmbedv3Multilingual = createEmbedderRef({
  name: "github/cohere-embed-v3-multilingual",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: "Cohere - Embed-embed-v3-multilingual",
    supports: {
      input: ["text"],
    },
  },
});

export const cohereEmbedv4 = createEmbedderRef({
  name: "github/embed-v-4-0",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: "Cohere - Embed-embed-v4",
    supports: {
      input: ["text"],
    },
  },
});

export const SUPPORTED_EMBEDDING_MODELS: Record<string, any> = {
  "text-embedding-3-small": openAITextEmbedding3Small,
  "text-embedding-3-large": openAITextEmbedding3Large,
  "cohere-embed-v3-english": cohereEmbedv3English,
  "cohere-embed-v3-multilingual": cohereEmbedv3Multilingual,
  "embed-v-4-0": cohereEmbedv4,
};

export function githubEmbedder(
  name: string,
  client: ReturnType<typeof ModelClient>,
) {
  const modelRef = SUPPORTED_EMBEDDING_MODELS[name];
  if (!modelRef) throw new Error(`Unsupported model: ${name}`);

  return embedder(
    {
      info: modelRef.info!,
      configSchema: TextEmbeddingConfigSchema,
      name: modelRef.name,
    },
    async (request) => {
      const { input, options } = request;
      const body = {
        body: {
          model: name,
          input: input.map((d: any) => d.text),
          dimensions: options?.dimensions,
          encoding_format: options?.encodingFormat,
        },
      } as GetEmbeddingsParameters;
      const embeddings = (await client
        .path("/embeddings")
        .post(body)) as GetEmbeddings200Response;
      return {
        embeddings: embeddings.body.data.map((d) => ({
          embedding: Array.isArray(d.embedding) ? d.embedding : [],
        })),
      };
    },
  );
}
