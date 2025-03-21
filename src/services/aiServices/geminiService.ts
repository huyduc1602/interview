import axios from 'axios';
import { GeminiResponse, processGeminiResponse, PromptMessage } from './types';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';

const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export async function generateGeminiResponse(
  messages: PromptMessage[],
  user: User | null
): Promise<GeminiResponse> {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const GEMINI_API_KEY = getApiKey(ApiKeyService.GEMINI, user.id);

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    // Send the entire conversation history to maintain context
    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data) {
      throw new Error('Invalid response format from Gemini API');
    }

    return processGeminiResponse(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Gemini API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}