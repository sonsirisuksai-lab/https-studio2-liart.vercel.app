import { AIProvider, AIConfig } from '../engine';
import { geminiClient } from '@cosmos/core';

class GeminiAIProvider implements AIProvider {
  id = 'gemini' as const;

  async generate(prompt: string, config?: AIConfig): Promise<string> {
    return geminiClient.generate(prompt, config?.systemPrompt);
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    await geminiClient.stream(prompt, onChunk);
  }
}

export const geminiProvider = new GeminiAIProvider();

