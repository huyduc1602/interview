import axios from 'axios';
import type { PerflexityResponse, PromptMessage } from './types';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';

// API endpoint for Perflexity's Sonar Pro model
const API_URL = 'https://api.perplexity.ai/chat/completions';

export async function fetchPerflexityAnswer(
    messages: PromptMessage[],
    user: User | null
): Promise<PerflexityResponse> {
    if (!user) {
        throw new Error('User not authenticated');
    }

    const PERFLEXITY_API_KEY = getApiKey(ApiKeyService.PERFLEXITY, user.id);

    if (!PERFLEXITY_API_KEY) {
        throw new Error('Perflexity API key not configured');
    }

    try {
        // Send the entire message history to maintain conversation context
        const response = await axios.post(
            API_URL,
            {
                model: 'sonar-pro',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            },
            {
                headers: {
                    'Authorization': `Bearer ${PERFLEXITY_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from Perflexity API');
        }

        return {
            id: response.data.id,
            object: response.data.object,
            created: response.data.created,
            model: response.data.model,
            choices: response.data.choices,
            usage: response.data.usage
        } as PerflexityResponse;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Perflexity API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(`Perflexity API Error: ${error.response?.data?.error?.message || error.message}`);
        }
        throw error;
    }
}