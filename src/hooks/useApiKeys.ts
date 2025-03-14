import { useSettings } from './useSettings';

export enum ApiKeyService {
    OPENAI = 'OPENAI',
    GEMINI = 'GEMINI',
    MISTRAL = 'MISTRAL',
    OPENCHAT = 'OPENCHAT',
    GOOGLE_SHEET_API_KEY = 'GOOGLE_SHEET_API_KEY',
    SPREADSHEET_ID = 'SPREADSHEET_ID',
    GOOGLE_SHEET_KNOWLEDGE_BASE = 'GOOGLE_SHEET_KNOWLEDGE_BASE',
    GOOGLE_SHEET_INTERVIEW_QUESTIONS = 'GOOGLE_SHEET_INTERVIEW_QUESTIONS'
}


/**
 * A hook that provides access to API keys for various services.
 * 
 * This hook retrieves API keys from the application settings based on the requested service.
 * It leverages the useSettings hook to access the current settings values.
 * 
 * @returns An object containing the getApiKeyByService function which returns the API key 
 *          string for the specified service, or an empty string if not found.
 * 
 * @example
 * const { getApiKeyByService } = useApiKeys();
 * const openAIKey = getApiKeyByService(ApiKeyService.OPENAI);
 */
export function useApiKeys() {
    const { settings } = useSettings();

    const getApiKeyByService = (service: ApiKeyService): string => {

        switch (service) {
            case ApiKeyService.OPENAI:
                return settings.openai || '';
            case ApiKeyService.GEMINI:
                return settings.gemini || '';
            case ApiKeyService.MISTRAL:
                return settings.mistral || '';
            case ApiKeyService.OPENCHAT:
                return settings.openchat || '';
            case ApiKeyService.GOOGLE_SHEET_API_KEY:
                return settings.googleSheetApiKey || '';
            case ApiKeyService.SPREADSHEET_ID:
                return settings.spreadsheetId || '';
            case ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE:
                return settings.sheetNameKnowledgeBase || '';
            case ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS:
                return settings.sheetNameInterviewQuestions || '';
            default:
                return '';
        }
    }

    return {
        getApiKeyByService
    };
};