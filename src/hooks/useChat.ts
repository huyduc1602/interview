/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { fetchChatGPTAnswer } from '@/services/aiServices/chatgptService';
import { generateGeminiResponse } from '@/services/aiServices/geminiService';
import { generateMistralResponse } from '@/services/aiServices/mistralService';
import { generateOpenChatResponse } from '@/services/aiServices/openchatService';
import {
  AIModel,
  type AIModelType,
  type AIResponse,
  type TokenUsage,
  isOpenAIResponse,
  isGeminiResponse,
  isMistralResponse,
  isOpenChatResponse
} from '@/services/aiServices/types';
import { User } from '@/types/common';

interface UseChatOptions {
  type: 'knowledge' | 'interview' | 'chat';
}

interface UseChatReturn {
  loading: boolean;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<string>>;
  generateAnswer: (input: string) => Promise<string>;
  answer: string | null;
  setAnswer: Dispatch<SetStateAction<string | null>>;
  error: string | null;
  usage: TokenUsage | undefined;
  isFirstQuestion: boolean;
}

export function useChat({ type }: UseChatOptions, user: User | null): UseChatReturn {
  const [selectedModel, setSelectedModel] = useState<AIModelType>(AIModel.GPT35_0125);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<TokenUsage | undefined>(undefined);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [error] = useState<string | null>(null);

  const getSystemContext = useCallback(() => {
    switch (type) {
      case 'chat':
        return 'You are a helpful AI assistant.';
      case 'interview':
        return 'You are an interview preparation assistant.';
      case 'knowledge':
        return 'You are a knowledge base assistant.';
      default:
        return 'You are a helpful AI assistant.';
    }
  }, [type]);

  const generateAnswer = useCallback(async (input: string): Promise<string> => {
    try {
      setLoading(true);

      const finalInput = isFirstQuestion
        ? `${getSystemContext()}\n\n${input}`
        : input;

      let response: AIResponse;

      switch (selectedModel) {
        case AIModel.GPT35:
        case AIModel.GPT4:
        case AIModel.GPT35_0125:
          response = await fetchChatGPTAnswer(finalInput, selectedModel, user);
          if (isOpenAIResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;
            setAnswer(content);
            return content;
          }
          break;

        case AIModel.GEMINI:
          response = await generateGeminiResponse(finalInput, user);
          if (isGeminiResponse(response)) {
            setUsage(undefined);
            setIsFirstQuestion(false);
            const content = response.candidates[0].content.parts[0].text;
            setAnswer(content);
            return content;
          }
          break;

        case AIModel.MISTRAL:
          response = await generateMistralResponse(finalInput, user);
          if (isMistralResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;
            setAnswer(content);
            return content;
          }
          break;

        case AIModel.OPENCHAT:
          response = await generateOpenChatResponse(finalInput, user);
          if (isOpenChatResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;
            setAnswer(content);
            return content;
          }
          break;

        default:
          console.error('Unsupported model:', selectedModel);
          throw new Error(`Model ${selectedModel} is not supported`);
      }

      throw new Error(`Invalid response format from ${selectedModel}`);
    } catch (error) {
      console.error('Error in generateAnswer:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : `Unknown error with ${selectedModel}`;
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedModel, isFirstQuestion, getSystemContext, user]);

  useEffect(() => {
    setIsFirstQuestion(true);
  }, [selectedModel]);
  return {
    loading,
    selectedModel,
    setSelectedModel,
    generateAnswer,
    usage,
    answer,
    setAnswer,
    isFirstQuestion,
    error
  };
}