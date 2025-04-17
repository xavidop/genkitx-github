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

import { startFlowServer } from '@genkit-ai/express';
import dotenv from 'dotenv';
import { genkit, z } from 'genkit';
import { openAIGpt4o, github } from 'genkitx-github';


dotenv.config();

const ai = genkit({
  plugins: [
    github(),
  ],
  model: openAIGpt4o,
});

export const jokeFlow = ai.defineFlow(
  {
    name: 'jokeFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {


   
   const llmResponse = await ai.generate({
      prompt: `Tell me a joke about ${subject}`,
    });
    return llmResponse.text;
  }
);


startFlowServer({
  flows: [jokeFlow],
});
