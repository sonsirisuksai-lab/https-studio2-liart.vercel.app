import { geminiClient as coreGeminiClient } from '@cosmos/core';

export const geminiClient = {
  generate: async (prompt: string, systemPrompt?: string) => {
    return await coreGeminiClient.generate(prompt, systemPrompt);
  },
  stream: async (prompt: string, onChunk: (chunk: string) => void) => {
    return await coreGeminiClient.stream(prompt, onChunk);
  }
};
