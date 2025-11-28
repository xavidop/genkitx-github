![Firebase Genkit + GitHub Models](https://github.com/xavidop/genkitx-github/blob/main/assets/genkit-github.png?raw=true)

<h1 align="center">
   Firebase Genkit <> GitHub Models Plugin
</h1>

<h4 align="center">GitHub Models Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="GitHub version" src="https://img.shields.io/github/v/release/xavidop/genkitx-github">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-github">
   <img alt="GitHub License" src="https://img.shields.io/github/license/xavidop/genkitx-github">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/xavidop/genkitx-github?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/xavidop/genkitx-github?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/xavidop/genkitx-github">
</div>

</br>

**`genkitx-github`** is a community plugin for using GitHub Models APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Xavier Portilla Edo**](https://github.com/xavidop).

This Genkit plugin allows to use GitHub models through their official APIs.

## Installation

Install this plugin in your project with your favorite package manager:

- `npm install genkitx-github`
- `pnpm add genkitx-github`

### Versions

if you are using Genkit version `<v0.9.0`, please use the plugin version `v1.9.0`. If you are using Genkit `>=v0.9.0`, please use the plugin version `>=v1.10.0`.

## Usage

### Configuration

To use the plugin, you need to configure it with your GitHub Token key. You can do this by calling the `genkit` function:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-github";

const ai = genkit({
  plugins: [
    github({
      githubToken: '<my-github-token>',
    }),
    model: openAIGpt4o,
  ]
});
```

You can also intialize the plugin in this way if you have set the `GITHUB_TOKEN` environment variable:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-github";

const ai = genkit({
  plugins: [
    github({
      githubToken: '<my-github-token>',
    }),
    model: openAIGpt4o,
  ]
});
```

### Basic examples

The simplest way to call the text generation model is by using the helper function `generate`:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-github";

// Basic usage of an LLM
const response = await ai.generate({
  prompt: 'Tell me a joke.',
});

console.log(await response.text);
```

### Within a flow

```typescript
// ...configure Genkit (as shown above)...

export const myFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await ai.generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
    });

    return llmResponse.text;
  }
);
```

### Tool use

```typescript
// ...configure Genkit (as shown above)...

const specialToolInputSchema = z.object({ meal: z.enum(["breakfast", "lunch", "dinner"]) });
const specialTool = ai.defineTool(
  {
    name: "specialTool",
    description: "Retrieves today's special for the given meal",
    inputSchema: specialToolInputSchema,
    outputSchema: z.string(),
  },
  async ({ meal }): Promise<string> => {
    // Retrieve up-to-date information and return it. Here, we just return a
    // fixed value.
    return "Baked beans on toast";
  }
);

const result = ai.generate({
  tools: [specialTool],
  prompt: "What's for breakfast?",
});

console.log(result.then((res) => res.text));
```

For more detailed examples and the explanation of other functionalities, refer to the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

## Using Custom Models

If you want to use a model that is not exported by this plugin, you can register it using the `customModels` option when initializing the plugin:

```typescript
import { genkit, z } from 'genkit';
import { github } from 'genkitx-github';

const ai = genkit({
  plugins: [
    github({
      customModels: ['gpt-5', 'my-custom-model'], // Register custom models
    }),
  ],
});

// Use the custom model by specifying its name as a string
export const customModelFlow = ai.defineFlow(
  {
    name: 'customModelFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await ai.generate({
      model: 'github/gpt-5', // Use any registered custom model
      prompt: `Tell me about ${subject}`,
    });
    return llmResponse.text;
  }
);
```

## Supported models

This plugin supports all currently available **Chat/Completion** and **Embeddings** models from GitHub Models. This plugin supports image input and multimodal models.

## API Reference

You can find the full API reference in the [API Reference Documentation](https://xavidop.github.io/genkitx-github/)

## Troubleshooting

1. GPT `o1-preview`, `o1` and `o1-mini` it is still in beta. It does not support system roles, tools and the `temperature` and `topP` needs to be set to `1`. See OpenAI annocement [here](https://openai.com/index/introducing-openai-o1-preview/)
2. Cohere models only supports text output for now. Issue opened [here](https://github.com/orgs/community/discussions/142364).

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/xavidop/genkitx-github/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [GitHub Discussions](https://github.com/xavidop/genkitx-github/discussions).

## Credits

This plugin is proudly maintained by Xavier Portilla Edo [**Xavier Portilla Edo**](https://github.com/xavidop).

I got the inspiration, structure and patterns to create this plugin from the [Genkit Community Plugins](https://github.com/TheFireCo/genkit-plugins) repository built by the [Fire Compnay](https://github.com/TheFireCo) as well as the [ollama plugin](https://firebase.google.com/docs/genkit/plugins/ollama).

## License

This project is licensed under the [Apache 2.0 License](https://github.com/xavidop/genkitx-github/blob/main/LICENSE).

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/xavidop/genkitx-github/blob/main/LICENSE)
