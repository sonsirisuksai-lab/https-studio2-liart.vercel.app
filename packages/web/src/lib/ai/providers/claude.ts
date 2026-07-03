import { AIProvider, AIConfig } from '../engine';
import { claudeClient } from '@cosmos/core';

class ClaudeAIProvider implements AIProvider {
  id = 'claude' as const;

  async generate(prompt: string, config?: AIConfig): Promise<string> {
    return claudeClient.generate(prompt, config?.systemPrompt);
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    await claudeClient.stream(prompt, onChunk);
  }
}

export const claudeProvider = new ClaudeAIProvider();

