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

import { Message } from "@genkit-ai/ai";
import {
  CandidateData,
  defineModel,
  GenerateRequest,
  GenerationCommonConfigSchema,
  MessageData,
  ModelAction,
  modelRef,
  Role,
  ToolDefinition,
  ToolRequestPart,
} from "@genkit-ai/ai/model";

import {
  ChatChoiceOutput,
  ChatRequestAssistantMessage,
  ChatRequestMessage,
  ChatRequestSystemMessage,
  ChatRequestToolMessage,
  ChatRequestUserMessage,
  ModelClient,
  GetChatCompletionsDefaultResponse,
  GetChatCompletions200Response,
  ChatCompletionsToolCall,
  ChatCompletionsToolDefinition,
  FunctionDefinition,
} from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";

export const openAIGpt4o = modelRef({
  name: "github/gpt-4o",
  info: {
    versions: ["gpt-4o"],
    label: "OpenAI - GPT-4o",
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
      arguments: tool.inputSchema,
      description: tool.description,
    } as FunctionDefinition,
  };
}

export function toGithubMessages(
  messages: MessageData[],
): ChatRequestMessage[] {
  const githubMsgs: ChatRequestMessage[] = [];
  for (const message of messages) {
    const msg = new Message(message);
    const role = toGithubRole(message.role);

    githubMsgs.push({
      role: role,
      content: msg.text(),
    } as
      | ChatRequestSystemMessage
      | ChatRequestUserMessage
      | ChatRequestAssistantMessage
      | ChatRequestToolMessage);
  }

  return githubMsgs;
}

const finishReasonMap: Record<
  NonNullable<string>,
  CandidateData["finishReason"]
> = {
  length: "length",
  stop: "stop",
  tool_calls: "stop",
  content_filter: "blocked",
};

export const SUPPORTED_GITHUB_MODELS: Record<string, any> = {
  "gpt-4o": openAIGpt4o,
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
): CandidateData {
  const toolRequestParts = choice.message.tool_calls?.map(fromGithubToolCall);
  return {
    index: choice.index,
    finishReason:
      "finish_reason" in choice
        ? finishReasonMap[choice.finish_reason!]
        : "other",
    message: {
      role: "model",
      content: toolRequestParts
        ? 
          (toolRequestParts as ToolRequestPart[])
        : [
            jsonMode
              ? { data: JSON.parse(choice.message.content!) }
              : { text: choice.message.content! },
          ],
    },
    custom: {},
  };
}

function fromGithubChunkChoice(choice: any): CandidateData {
  choice.custom;
  return {
    index: choice.index,
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

  let responseFormat;
  const response_format = request.output?.format;
  if (
    response_format === "json" &&
    model.info.supports?.output?.includes("json")
  ) {
    responseFormat = {
      type: "json_object",
    };
    githubMessages.push({
      role: "system",
      content: "Write it in JSON",
    } as ChatRequestSystemMessage);
  } else if (
    (response_format === "text" &&
      model.info.supports?.output?.includes("text")) ||
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
  const body = {
    body: {
      messages: githubMessages,
      tools: request.tools?.map(toGithubTool),
      model: request.config?.version || model.version || modelName,
      max_tokens: request.config?.maxOutputTokens,
      temperature: request.config?.temperature,
      top_p: request.config?.topP,
      n: request.candidates,
      stop: request.config?.stopSequences,
      response_format: responseFormat,
    },
  } as any;

  for (const key in body.body) {
    if (!body[key] || (Array.isArray(body[key]) && !body[key].length))
      delete body[key];
  }
  return body;
}

export function githubModel(
  name: string,
  client: ModelClient,
): ModelAction<typeof GenerationCommonConfigSchema> {
  const modelId = `github/${name}`;
  const model = SUPPORTED_GITHUB_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return defineModel(
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
              index: c.index,
              content: c.message.content,
            });
          }
        }
      } else {
        response = await client.path("/chat/completions").post(body);
      }
      return {
        candidates:
          "choices" in response.body
            ? response.body.choices.map((c) =>
                fromGithubChoice(c, request.output?.format === "json"),
              )
            : [],
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
