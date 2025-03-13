import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserSettings, saveUserSettings } from '@/utils/supabaseStorage';

// Định nghĩa kiểu dữ liệu cho settings
export interface SettingsState {
    // API keys - stored as top-level fields
    openai?: string;
    gemini?: string;
    mistral?: string;
    openchat?: string;
    google_sheet_api_key?: string;

    // API settings
    apiSettings?: {
        googleSheetApiKey?: string;
        spreadsheetId?: string;
        sheetNameKnowledgeBase?: string;
        sheetNameInterviewQuestions?: string;
        [key: string]: any;
    };

    // App preferences
    appPreferences?: {
        theme?: 'light' | 'dark' | 'system';
        language?: string;
        [key: string]: any;
    };

    // Feature flags
    featureFlags?: {
        autoSaveKnowledge?: boolean;
        autoSaveInterview?: boolean;
        saveHistoryKnowledge?: boolean;
        saveHistoryInterview?: boolean;
        [key: string]: any;
    };

    // Allow additional settings
    [key: string]: any;
}

export const useSettings = () => {
    const { user, isGoogleUser } = useAuth();
    const [settings, setSettings] = useState<SettingsState>({
        apiSettings: {},
        appPreferences: {},
        featureFlags: {
            autoSaveKnowledge: false,
            autoSaveInterview: false,
            saveHistoryKnowledge: true,
            saveHistoryInterview: true
        }
    });
    const [saved, setSaved] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
    const [loading, setLoading] = useState(false);

    // Determine if we should use Supabase or local storage
    const isGoogle = isGoogleUser();

    // Load settings from Supabase or localStorage
    const loadSettings = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            if (isGoogle) {
                // Load settings from Supabase
                const { data, error } = await fetchUserSettings(user.id);

                if (error) {
                    console.error('Failed to fetch settings from Supabase:', error);
                } else if (data) {
                    // Convert database schema to settings state
                    const mappedSettings: SettingsState = {
                        openai: data.openai,
                        gemini: data.gemini,
                        mistral: data.mistral,
                        openchat: data.openchat,
                        google_sheet_api_key: data.google_sheet_api_key,
                        apiSettings: data.api_settings || {},
                        appPreferences: data.app_preferences || {},
                        featureFlags: data.feature_flags || {}
                    };

                    setSettings(mappedSettings);
                }
            } else {
                // Load settings from localStorage
                const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
                if (savedSettings) {
                    try {
                        setSettings(JSON.parse(savedSettings));
                    } catch (error) {
                        console.error('Failed to parse settings from localStorage:', error);
                        localStorage.removeItem(`user_settings_${user.id}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    }, [user, isGoogle]);

    // Load settings when user changes
    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user, loadSettings]);

    // Save settings
    const saveSettings = async () => {
        if (!user) return;

        setLoading(true);
        try {
            if (isGoogle) {
                // Format settings for database
                const dbSettings = {
                    openai: settings.openai,
                    gemini: settings.gemini,
                    mistral: settings.mistral,
                    openchat: settings.openchat,
                    google_sheet_api_key: settings.google_sheet_api_key,
                    api_settings: settings.apiSettings || {},
                    app_preferences: settings.appPreferences || {},
                    feature_flags: settings.featureFlags || {}
                };

                // Save to Supabase
                const { error } = await saveUserSettings(user.id, dbSettings);

                if (error) {
                    console.error('Failed to save settings to Supabase:', error);
                    return;
                }
            } else {
                // Save to localStorage
                localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Update a setting value
    const updateSetting = (category: string, key: string, value: any) => {
        setSettings(prev => {
            if (category) {
                // Update nested setting
                return {
                    ...prev,
                    [category]: {
                        ...(prev[category] || {}),
                        [key]: value
                    }
                };
            } else {
                // Update top-level setting
                return {
                    ...prev,
                    [key]: value
                };
            }
        });
    };

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const newSettings: SettingsState = { ...settings };

                lines.forEach(line => {
                    const [path, value] = line.split('=');
                    if (path && value) {
                        const pathParts = path.trim().split('.');

                        // Handle nested paths (e.g., "apiSettings.googleSheetApiKey")
                        if (pathParts.length > 1) {
                            const category = pathParts[0];
                            const key = pathParts[1];

                            newSettings[category] = {
                                ...(newSettings[category] || {}),
                                [key]: value.trim()
                            };
                        } else {
                            // Handle top-level setting
                            newSettings[pathParts[0]] = value.trim();
                        }
                    }
                });

                setSettings(newSettings);
            };
            reader.readAsText(file);
        }
    };

    // Download sample settings file
    const handleDownloadSampleSettings = () => {
        const sampleContent = `openai=sk-...\ngemini=AIzaSy...\nmistral=...\nopenchat=...\napiSettings.googleSheetApiKey=...\napiSettings.spreadsheetId=...\napiSettings.sheetNameKnowledgeBase=...\napiSettings.sheetNameInterviewQuestions=...\nfeatureFlags.autoSaveKnowledge=true\nfeatureFlags.autoSaveInterview=true`;
        const blob = new Blob([sampleContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-settings.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return {
        settings,
        saved,
        loading,
        showKeys,
        setShowKeys,
        saveSettings,
        updateSetting,
        handleFileUpload,
        handleDownloadSampleSettings,
        loadSettings,
        isGoogle
    };
};