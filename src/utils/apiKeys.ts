import { settingsBridge } from './settingsBridge';

declare global {
    interface Window {
        __ENV?: Record<string, string>;
    }
}

export const getApiKey = (service: string, userId?: string): string => {
    // First check the settings bridge (highest priority)
    const bridgeUserId = settingsBridge.getCurrentUserId();

    // Only use bridge if we have a userId match or no userId was provided
    if ((!userId || userId === bridgeUserId) && bridgeUserId) {
        const bridgeValue = settingsBridge.getApiKey(service);
        if (bridgeValue) {
            return bridgeValue;
        }
    }

    // If bridge fails, fall back to localStorage (for backward compatibility)
    const userIdToUse = userId || 'default';

    // Try to get from new settings format first
    const userSettings = localStorage.getItem(`user_settings_${userIdToUse}`);
    if (userSettings) {
        try {
            const settings = JSON.parse(userSettings);

            // Map service names to settings keys
            switch (service) {
                case 'GOOGLE_SHEET_API_KEY':
                    if (settings.googleSheetApiKey) return settings.googleSheetApiKey;
                    break;
                case 'SPREADSHEET_ID':
                    if (settings.spreadsheetId) return settings.spreadsheetId;
                    break;
                case 'GOOGLE_SHEET_KNOWLEDGE_BASE':
                    if (settings.sheetNameKnowledgeBase) return settings.sheetNameKnowledgeBase;
                    break;
                case 'GOOGLE_SHEET_INTERVIEW_QUESTIONS':
                    if (settings.sheetNameInterviewQuestions) return settings.sheetNameInterviewQuestions;
                    break;
                case 'OPENAI':
                    if (settings.openai) return settings.openai;
                    break;
                case 'GEMINI':
                    if (settings.gemini) return settings.gemini;
                    break;
                case 'MISTRAL':
                    if (settings.mistral) return settings.mistral;
                    break;
                case 'OPENCHAT':
                    if (settings.openchat) return settings.openchat;
                    break;
                default:
                    // Try direct match
                    if (settings[service.toLowerCase()]) {
                        return settings[service.toLowerCase()];
                    }
            }
        } catch (error) {
            console.error('Failed to parse user settings:', error);
        }
    }

    // Fall back to old format if all else fails
    const savedKeys = localStorage.getItem(`api_keys_${userIdToUse}`);
    if (savedKeys) {
        try {
            const decodedKeys = JSON.parse(savedKeys);
            if (decodedKeys[service]) {
                return decodedKeys[service];
            }
        } catch (error) {
            console.error('Failed to decode API keys from localStorage:', error);
        }
    }

    // Fallback to environment variables
    return window.__ENV?.[`VITE_${service.toUpperCase()}_API_KEY`] ||
        import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`] ||
        '';
};