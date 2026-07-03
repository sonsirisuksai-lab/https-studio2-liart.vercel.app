import { GoogleGenAI } from '@google/genai';

export interface GeminiConfig {
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
      console.warn(`Gemini API attempt ${i + 1} failed. Retrying in ${delayMs}ms...`, err);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

export class GeminiClient {
  private ai: GoogleGenAI | null = null;
  private model: string;
  private apiKey: string;

  constructor(config: GeminiConfig = {}) {
    this.apiKey = config.apiKey || getEnvVar('GEMINI_API_KEY');
    this.model = config.model || 'gemini-3.5-flash';
    
    if (this.apiKey && this.apiKey !== 'mock') {
      this.ai = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API Error: Missing valid API Key.');
    }

    return retryWithDelay(async () => {
      const response = await this.ai!.models.generateContent({
        model: this.model,
        contents: prompt,
        config: systemPrompt ? { systemInstruction: systemPrompt } : undefined,
      });
      return response.text || '';
    });
  }

  async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    if (!this.ai) {
      throw new Error('Gemini API Error: Missing valid API Key.');
    }

    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: this.model,
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          onChunk(chunk.text);
        }
      }
    } catch (error) {
      console.error('Gemini streaming failed, falling back to non-streaming:', error);
      const text = await this.generate(prompt);
      onChunk(text);
    }
  }
}

export const geminiClient = new GeminiClient();
