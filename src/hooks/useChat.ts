import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { fetchChatGPTAnswer } from '@/services/aiServices/chatgptService';
import { generateGeminiResponse } from '@/services/aiServices/geminiService';
import { generateMistralResponse } from '@/services/aiServices/mistralService';
import { generateOpenChatResponse } from '@/services/aiServices/openchatService';
import { fetchPerflexityAnswer } from '@/services/aiServices/perflexityService';
import {
  AIModel,
  type AIModelType,
  type AIResponse,
  type TokenUsage,
  type ChatMessage,
  isOpenAIResponse,
  isGeminiResponse,
  isMistralResponse,
  isOpenChatResponse,
  isPerflexityResponse
} from '@/services/aiServices/types';
import { User } from '@/types/common';
import { useTranslation } from 'react-i18next';

interface UseChatOptions {
  type: 'knowledge' | 'interview' | 'chat';
}

interface UseChatReturn {
  loading: boolean;
  selectedModel: string;
  setSelectedModel: Dispatch<SetStateAction<AIModelType>>;
  generateAnswer: (input: string) => Promise<string>;
  answer: string | null;
  setAnswer: Dispatch<SetStateAction<string | null>>;
  error: string | null;
  usage: TokenUsage | undefined;
  isFirstQuestion: boolean;
  chatHistory: ChatMessage[];
  clearHistory: () => void;
}

export function useChat({ type }: UseChatOptions, user: User | null): UseChatReturn {
  const [selectedModel, setSelectedModel] = useState<AIModelType>(type == 'chat' ? AIModel.PERFLEXITY : AIModel.GPT35_0125);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<TokenUsage | undefined>(undefined);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [error] = useState<string | null>(null);
  // Add chat history state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { t } = useTranslation();

  const getSystemContext = useCallback(() => {
    switch (type) {
      case 'chat':
        return t('ai.systemContext.chat');
      case 'interview':
        return t('ai.systemContext.interview');
      case 'knowledge':
        return t('ai.systemContext.knowledge');
      default:
        return t('ai.systemContext.default');
    }
  }, [t, type]);

  // Add initial system message when chat is initialized
  useEffect(() => {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: getSystemContext(),
      timestamp: Date.now()
    };
    setChatHistory([systemMessage]);
  }, [getSystemContext]);

  // Function to clear chat history (except system message)
  const clearHistory = useCallback(() => {
    // Keep only the system message
    const systemMessage = chatHistory.find(msg => msg.role === 'system');
    setChatHistory(systemMessage ? [systemMessage] : []);
    setIsFirstQuestion(true);
    // Remove chatHistory from dependencies to break circular dependency
  }, []);

  // Get system message separately to avoid dependency on chatHistory
  const getSystemMessage = useCallback(() => {
    return {
      role: 'system' as const,
      content: getSystemContext(),
      timestamp: Date.now()
    };
  }, [getSystemContext]);

  // Update history when model changes
  useEffect(() => {
    // Reset history with just the system message
    setChatHistory([getSystemMessage()]);
    setIsFirstQuestion(true);
  }, [selectedModel, getSystemMessage]);

  const generateAnswer = useCallback(async (input: string): Promise<string> => {
    try {
      setLoading(true);

      // Add user message to chat history
      const userMessage: ChatMessage = {
        role: 'user',
        content: input,
        timestamp: Date.now()
      };

      // Create updated history for API calls
      const updatedHistory = [...chatHistory, userMessage];
      setChatHistory(updatedHistory);

      let response: AIResponse;

      switch (selectedModel) {
        case AIModel.GPT35:
        case AIModel.GPT4:
        case AIModel.GPT35_0125:
          // Convert chat history to OpenAI format
          response = await fetchChatGPTAnswer(
            updatedHistory.map(msg => ({ role: msg.role, content: msg.content })),
            selectedModel,
            user
          );
          if (isOpenAIResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;

            // Add assistant response to history
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content,
              timestamp: Date.now()
            };
            setChatHistory([...updatedHistory, assistantMessage]);

            setAnswer(content);
            return content;
          }
          break;

        case AIModel.GEMINI:
          response = await generateGeminiResponse(
            updatedHistory.map(msg => ({ role: msg.role, content: msg.content })),
            user
          );
          if (isGeminiResponse(response)) {
            setUsage(undefined);
            setIsFirstQuestion(false);
            const content = response.candidates[0].content.parts[0].text;

            // Add assistant response to history
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content,
              timestamp: Date.now()
            };
            setChatHistory([...updatedHistory, assistantMessage]);

            setAnswer(content);
            return content;
          }
          break;

        case AIModel.MISTRAL:
          response = await generateMistralResponse(
            updatedHistory.map(msg => ({ role: msg.role, content: msg.content })),
            user
          );
          if (isMistralResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;

            // Add assistant response to history
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content,
              timestamp: Date.now()
            };
            setChatHistory([...updatedHistory, assistantMessage]);

            setAnswer(content);
            return content;
          }
          break;

        case AIModel.OPENCHAT:
          response = await generateOpenChatResponse(
            updatedHistory.map(msg => ({ role: msg.role, content: msg.content })),
            user
          );
          if (isOpenChatResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;

            // Add assistant response to history
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content,
              timestamp: Date.now()
            };
            setChatHistory([...updatedHistory, assistantMessage]);

            setAnswer(content);
            return content;
          }
          break;

        case AIModel.PERFLEXITY:
          response = await fetchPerflexityAnswer(
            updatedHistory.map(msg => ({ role: msg.role, content: msg.content })),
            user
          );
          if (isPerflexityResponse(response)) {
            setUsage(response.usage ?? undefined);
            setIsFirstQuestion(false);
            const content = response.choices[0].message.content;

            // Add assistant response to history
            const assistantMessage: ChatMessage = {
              role: 'assistant',
              content,
              timestamp: Date.now()
            };
            setChatHistory([...updatedHistory, assistantMessage]);

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
  }, [selectedModel, chatHistory, user]);

  return {
    loading,
    selectedModel,
    setSelectedModel,
    generateAnswer,
    usage,
    answer,
    setAnswer,
    isFirstQuestion,
    error,
    chatHistory,
    clearHistory
  };
}