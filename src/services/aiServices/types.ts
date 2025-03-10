export enum AIModel {
  GPT35 = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4-turbo-preview',
  GPT35_0125 = 'gpt-3.5-turbo-0125',
  GEMINI = 'gemini-pro',
  MISTRAL = 'mistral-small',
  OPENCHAT = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
}

export type AIModelType = AIModel | string;

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface BaseResponse {
  model?: AIModelType;
  usage?: TokenUsage;
}

export interface OpenAIResponse extends BaseResponse {
  id: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      refusal: null | string;
    };
    logprobs: null;
    finish_reason: string;
  }>;
}

export interface GeminiResponse extends BaseResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    avgLogprobs?: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails: Array<{
      modality: string;
      tokenCount: number;
    }>;
    candidatesTokensDetails: Array<{
      modality: string;
      tokenCount: number;
    }>;
  };
  modelVersion?: string;
}

export interface MistralResponse extends BaseResponse {
  id: string;
  object: string;
  created: number;
  prompt: PromptMessage[];
  choices: Array<{
    index: number;
    seed?: number;
    logprobs: null;
    message: {
      role: string;
      content: string;
      tool_calls: unknown[];
    };
    finish_reason: string;
  }>;
}

export interface PromptMessage {
  role: string;
  content: string;
}

export interface OpenChatResponse extends BaseResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  prompt: PromptMessage[];
  choices: Array<{
    finish_reason: string;
    seed: number;
    logprobs: null;
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls: unknown[];
    };
  }>;
  usage?: TokenUsage;
}

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SheetData {
  id: string;
  values: unknown[][];
}

export type AIResponse =
  | OpenAIResponse
  | GeminiResponse
  | MistralResponse
  | OpenChatResponse;

export function isOpenAIResponse(response: AIResponse): response is OpenAIResponse {
  return 'object' in response && response.object === 'chat.completion';
}

export function isGeminiResponse(response: AIResponse): response is GeminiResponse {
  return 'candidates' in response;
}

export function isMistralResponse(response: AIResponse): response is MistralResponse {
  return 'choices' in response && 'message' in response.choices[0];
}

export function isOpenChatResponse(response: AIResponse): response is OpenChatResponse {
  return (
    'choices' in response &&
    Array.isArray(response.choices) &&
    response.choices.length > 0 &&
    'message' in response.choices[0] &&
    'content' in response.choices[0].message &&
    typeof response.choices[0].message.content === 'string'
  );
}

export const processGeminiResponse = (response: unknown): GeminiResponse => {
  type GeminiCandidate = {
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    avgLogprobs?: number;
  };
  
  const typedResponse = response as { candidates?: GeminiCandidate[] };
  return {
    model: AIModel.GEMINI,
    candidates: typedResponse.candidates || [{
      content: {
        parts: [{ text: '' }],
        role: 'model'
      },
      finishReason: 'STOP'
    }]
  };
};