import axios from 'axios';
import type { PerflexityResponse } from './types';
import { handleAPIError } from './utils';
import { getApiKey } from '@/utils/apiKeys';
import { User } from '@/types/common';
import { ApiKeyService } from '@/hooks/useApiKeys';
import { AIModel } from './types';

// API endpoint for Perflexity's Sonar Pro model
const API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Fetches a response from the Perflexity AI service
 * 
 * @param prompt - The user's input question or prompt
 * @param user - The current user object containing authentication info
 * @returns A promise that resolves to a PerflexityResponse
 * 
 * This function calls Perflexity AI's API to get a response to the user's question
 * It authenticates with the API key and sends a prompt to Perflexity's endpoint
 */
export async function fetchPerflexityAnswer(prompt: string, user: User | null): Promise<PerflexityResponse> {
    try {
        // Get the API key for Perflexity
        const apiKey = await getApiKey(ApiKeyService.PERFLEXITY, user?.id);

        if (!apiKey) {
            throw new Error('No API key found for Perflexity');
        }

        const response = await axios.post(
            API_URL,
            {
                model: AIModel.PERFLEXITY,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        return response.data;
    } catch (error) {
        // Handle errors using the common error handling utility
        throw handleAPIError(error, 'Perflexity');
    }
}