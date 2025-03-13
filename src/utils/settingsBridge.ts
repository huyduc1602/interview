import { SettingsState } from '@/hooks/useSettings';

// Global store that acts as a bridge between useSettings and utility functions
class SettingsBridge {
    private static instance: SettingsBridge;
    private _settings: Partial<SettingsState> | null = null;
    private _currentUserId: string | null = null;

    private constructor() { }

    public static getInstance(): SettingsBridge {
        if (!SettingsBridge.instance) {
            SettingsBridge.instance = new SettingsBridge();
        }
        return SettingsBridge.instance;
    }

    // Called from useSettings hook
    public updateSettings(settings: SettingsState, userId: string): void {
        this._settings = settings;
        this._currentUserId = userId;
    }

    public getSettings(): Partial<SettingsState> | null {
        return this._settings;
    }

    public getCurrentUserId(): string | null {
        return this._currentUserId;
    }

    // Helper to get API keys in a way that matches the original getApiKey function
    public getApiKey(service: string): string | undefined {
        if (!this._settings) return undefined;

        // Map service names to settings keys
        switch (service) {
            case 'GOOGLE_SHEET_API_KEY':
                return this._settings.googleSheetApiKey;
            case 'SPREADSHEET_ID':
                return this._settings.spreadsheetId;
            case 'GOOGLE_SHEET_KNOWLEDGE_BASE':
                return this._settings.sheetNameKnowledgeBase;
            case 'GOOGLE_SHEET_INTERVIEW_QUESTIONS':
                return this._settings.sheetNameInterviewQuestions;
            case 'OPENAI':
                return this._settings.openai;
            case 'GEMINI':
                return this._settings.gemini;
            case 'MISTRAL':
                return this._settings.mistral;
            case 'OPENCHAT':
                return this._settings.openchat;
            default:
                // For other settings, try the lowercase version
                return this._settings[service.toLowerCase()];
        }
    }
}

export const settingsBridge = SettingsBridge.getInstance();