import axios from 'axios';
import type { OpenChatResponse } from './types';
import { handleAPIError } from './utils';
import { getApiKey } from '../../utils/apiKeys';
import { User } from '@/types/common';

const API_URL = 'https://api.together.xyz/v1/chat/completions';

export async function generateOpenChatResponse(prompt: string, user: User | null): Promise<OpenChatResponse> {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const OPENCHAT_API_KEY = getApiKey('openchat', user.id);

  if (!OPENCHAT_API_KEY) {
    throw new Error('OpenChat API key not configured');
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENCHAT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Llama API');
    }

    interface Message {
      role: string;
      content: string;
      tool_calls?: unknown[];
    }

    interface Choice {
      finish_reason: string;
      seed: number;
      logprobs: null;
      index: number;
      message: Message;
    }

    const formattedResponse: OpenChatResponse = {
      id: response.data.id || '',
      object: response.data.object || '',
      created: response.data.created || 0,
      model: response.data.model || '',
      prompt: response.data.prompt || [],
      choices: response.data.choices.map((choice: Choice): Choice => ({
        finish_reason: choice.finish_reason || '',
        seed: choice.seed || 0,
        logprobs: null,
        index: choice.index || 0,
        message: {
          role: choice.message.role || '',
          content: choice.message.content || '',
          tool_calls: choice.message.tool_calls || []
        }
      })),
      usage: response.data.usage ? {
        prompt_tokens: response.data.usage.prompt_tokens,
        completion_tokens: response.data.usage.completion_tokens,
        total_tokens: response.data.usage.total_tokens
      } : undefined
    } as OpenChatResponse;

    return formattedResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Llama API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    throw handleAPIError(error, 'Llama');
  }
}