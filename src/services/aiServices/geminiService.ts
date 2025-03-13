import { AIModel } from './types';
import axios from 'axios';
import type { GeminiResponse } from './types';
import { handleAPIError } from './utils';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';

const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

export async function generateGeminiResponse(prompt: string, user: User | null): Promise<GeminiResponse> {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const GEMINI_API_KEY = process.env.NODE_ENV === 'development' ? getApiKey(ApiKeyService.GEMINI, user.id) : '';
  if (!GEMINI_API_KEY && process.env.NODE_ENV === 'development') {
    throw new Error("Gemini API key is not configured in development mode");
  }

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 8192,
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

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return {
      model: AIModel.GEMINI,
      candidates: response.data.candidates,
      usage: {
        prompt_tokens: response.data.usageMetadata.promptTokenCount || 0,
        completion_tokens: response.data.usageMetadata.candidatesTokenCount || 0,
        total_tokens: response.data.usageMetadata.totalTokenCount || 0
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    throw handleAPIError(error, 'Gemini');
  }
}