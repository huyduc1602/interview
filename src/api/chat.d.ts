export interface ChatOptions {
  language?: 'en' | 'vi';
  modelType?: 'gpt-3.5-turbo' | 'gpt-4-turbo-preview';
  temperature?: number;
  max_tokens?: number;
}

export function chatWithGPT(prompt: string, options?: ChatOptions): Promise<string>;