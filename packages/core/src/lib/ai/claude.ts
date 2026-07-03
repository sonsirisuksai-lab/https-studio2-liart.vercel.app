export interface ClaudeConfig {
  apiKey?: string;
  model?: string;
}

function getEnvVar(key: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // @ts-ignore
    if (import.meta.env && import.meta.env[`VITE_${key}`]) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`];
    }
  } catch {}
  return '';
}

async function retryWithDelay<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Claude API attempt ${i + 1} failed. Retrying in ${delayMs}ms...`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

export class ClaudeClient {
  private apiKey: string;
  private model: string;

  constructor(config: ClaudeConfig = {}) {
    this.apiKey = config.apiKey || getEnvVar('CLAUDE_API_KEY');
    this.model = config.model || 'claude-3-5-sonnet-20241022';
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'mock') {
      throw new Error('Claude API Error: Missing valid API Key.');
    }

    return retryWithDelay(async () => {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true', // Needed for direct browser requests
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: Status ${response.status}`);
      }

      const data = await response.json();
      return data.content?.[0]?.text || '';
    });
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    // If no real key, just generate non-streamingly
    if (!this.apiKey || this.apiKey === 'mock') {
      throw new Error('Claude API Error: Missing valid API Key.');
    }

    try {
      // In a pure browser context, streaming standard Server Sent Events requires SSE parsing.
      // We will fallback to a robust fetch and output the chunks sequentially to ensure compatibility on Web, Mobile, and Desktop.
      const text = await this.generate(prompt);
      // Simulate chunk-by-chunk output for smooth animation
      const chunks = text.match(/.{1,4}/g) || [text];
      for (const chunk of chunks) {
        onChunk(chunk);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    } catch (error) {
      console.error('Claude streaming failed:', error);
      onChunk(`[Error streaming from Claude API]`);
    }
  }
}

export const claudeClient = new ClaudeClient();
