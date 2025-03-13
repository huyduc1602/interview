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

export const useApiKey = (service: ApiKeyService): string => {
    const { settings } = useSettings();

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
};