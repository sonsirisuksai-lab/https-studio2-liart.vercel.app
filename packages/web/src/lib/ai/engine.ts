export interface AIConfig {
  model: string;
  apiKey?: string;
  systemPrompt?: string;
}

export interface AIProvider {
  id: string;
  generate: (prompt: string) => Promise<string>;
}

export const aiEngine = {
  process: async (prompt: string) => "AI Processing..."
};
