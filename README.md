![Firebase Genkit + Github Models](https://github.com/xavidop/genkitx-github/blob/main/assets/genkit-github.png?raw=true)

<h1 align="center">
   Firebase Genkit <> Github Models Plugin
</h1>

<h4 align="center">Github Models Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/xavidop/genkitx-github?label=version">
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

**`genkitx-github`** is a community plugin for using Github Models APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Xavier Portilla Edo**](https://github.com/xavidop). 🔥

This Genkit plugin allows to use Github models through their official APIs.

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-github`
- `yarn add genkitx-github`
- `pnpm add genkitx-github`

## Usage

### Configuration

To use the plugin, you need to configure it with your Github Token key. You can do this by calling the `configureGenkit` function:

```typescript
import {github, openAIGpt4o} from "genkitx-github";

configureGenkit({
  plugins: [
    github({
      githubToken: '<my-github-token>',
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
```

You can also intialize the plugin in this way if you have set the `GITHUB_TOKEN` environment variable:

```typescript
import {github, openAIGpt4o} from "genkitx-github";

configureGenkit({
  plugins: [
    github(),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});
```


### Basic examples

The simplest way to call the text generation model is by using the helper function `generate`:

```typescript
import {github, openAIGpt4o} from "genkitx-github";

// Basic usage of an LLM
const response = await generate({
  model: openAIGpt4o, // model imported from genkitx-github
  prompt: 'Tell me a joke.',
});

console.log(await response.text());
```

### Within a flow

```typescript
// ...configure Genkit (as shown above)...

export const myFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: openAIGpt4o,
    });

    return llmResponse.text();
  }
);
```

### Tool use

```typescript
// ...configure Genkit (as shown above)...

const specialToolInputSchema = z.object({ meal: z.enum(["breakfast", "lunch", "dinner"]) });
const specialTool = defineTool(
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

const result = generate({
  model: openAIGpt4o,
  tools: [specialTool],
  prompt: "What's for breakfast?",
});

console.log(result.then((res) => res.text()));
```

For more detailed examples and the explanation of other functionalities, refer to the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/xavidop/genkitx-github/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [Github Discussions](https://github.com/xavidop/genkitx-github/discussions).

## Credits

This plugin is proudly maintained by Xavier Portilla Edo [**Xavier Portilla Edo**](https://github.com/xavidop). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/xavidop/genkitx-github/blob/main/LICENSE).

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/xavidop/genkitx-github/blob/main/LICENSE)