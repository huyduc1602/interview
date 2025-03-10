import axios from 'axios';
import type { OpenAIResponse } from './types';
import { getApiKey } from '../../utils/apiKeys';
import { User } from '@/types/common';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function fetchChatGPTAnswer(prompt: string, model: string, user: User | null): Promise<OpenAIResponse> {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const OPENAI_API_KEY = getApiKey('openai', user.id);

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('ChatGPT API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`ChatGPT API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}