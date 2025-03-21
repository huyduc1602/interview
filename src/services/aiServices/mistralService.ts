import axios from 'axios';
import type { MistralResponse, PromptMessage } from './types';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';

const API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function generateMistralResponse(
  messages: PromptMessage[],
  user: User | null
): Promise<MistralResponse> {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const MISTRAL_API_KEY = getApiKey(ApiKeyService.MISTRAL, user.id);

  if (!MISTRAL_API_KEY) {
    throw new Error('Mistral API key not configured');
  }

  try {
    // Send the entire message history to maintain conversation context
    const response = await axios.post(
      API_URL,
      {
        model: 'mistral-small-latest',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Mistral API');
    }

    return {
      id: response.data.id,
      object: response.data.object,
      created: response.data.created,
      prompt: response.data.prompt || messages,
      choices: response.data.choices,
      usage: response.data.usage,
      model: response.data.model
    } as MistralResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Mistral API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Mistral API Error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}