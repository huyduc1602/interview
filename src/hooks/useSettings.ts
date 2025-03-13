import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserSettings, saveUserSettings, updateFeatureFlag } from '@/utils/supabaseStorage';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';

// Define data types for settings
export interface SettingsState {
    // API keys - stored as top-level fields for direct access
    openai?: string;
    gemini?: string;
    mistral?: string;
    openchat?: string;
    googleSheetApiKey?: string;

    // Google Sheets specific settings that were originally flat in useApiKeysSettings
    spreadsheetId?: string;
    sheetNameKnowledgeBase?: string;
    sheetNameInterviewQuestions?: string;

    // API settings - for additional API-related settings
    apiSettings?: {
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
    const { i18n } = useTranslation();
    const { user, isGoogleUser } = useAuth();
    const langActive = i18n.language === 'en' ? 'vi' : 'en';
    const [settings, setSettings] = useState<SettingsState>({
        apiSettings: {},
        appPreferences: { theme: 'light', language: langActive },
        featureFlags: {
            autoSaveKnowledge: true,
            autoSaveInterview: true,
            saveHistoryKnowledge: true,
            saveHistoryInterview: true
        }
    });
    const [saved, setSaved] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
    const [loading, setLoading] = useState(false);

    // Flags to control auto-saving behavior
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [skipNextSave, setSkipNextSave] = useState(false);

    // Track previous settings for comparison
    const previousSettingsRef = useRef(settings);

    // Determine if we should use Supabase or local storage
    const isGoogle = isGoogleUser();

    // Create a debounced save function to avoid excessive saves
    const debouncedSave = useCallback(
        debounce((settingsToSave) => {
            const saveSettingsToStorage = async () => {
                if (!user) return;

                setLoading(true);
                try {
                    if (isGoogle) {
                        // Format settings for database
                        const dbSettings = {
                            // Direct API keys
                            openai: settingsToSave.openai,
                            gemini: settingsToSave.gemini,
                            mistral: settingsToSave.mistral,
                            openchat: settingsToSave.openchat,
                            googleSheetApiKey: settingsToSave.googleSheetApiKey,

                            // Structured settings
                            api_settings: {
                                ...settingsToSave.apiSettings,
                                // Include top-level sheet settings in api_settings
                                spreadsheetId: settingsToSave.spreadsheetId,
                                sheetNameKnowledgeBase: settingsToSave.sheetNameKnowledgeBase,
                                sheetNameInterviewQuestions: settingsToSave.sheetNameInterviewQuestions
                            },
                            app_preferences: settingsToSave.appPreferences || {},
                            feature_flags: settingsToSave.featureFlags || {}
                        };

                        // Save to Supabase
                        const { error } = await saveUserSettings(user.id, dbSettings);

                        if (error) {
                            console.error('Failed to save settings to Supabase:', error);
                            return;
                        }
                    } else {
                        // Save to localStorage
                        localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settingsToSave));
                    }

                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000);
                } catch (error) {
                    console.error('Error saving settings:', error);
                } finally {
                    setLoading(false);
                }
            };

            saveSettingsToStorage();
        }, 700),
        [user, isGoogle]
    );

    // Load settings from Supabase or localStorage
    const loadSettings = useCallback(async () => {
        if (!user) return;

        setSkipNextSave(true); // Skip auto-save after loading
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
                        // Direct API keys
                        openai: data.openai,
                        gemini: data.gemini,
                        mistral: data.mistral,
                        openchat: data.openchat,
                        googleSheetApiKey: data.google_sheet_api_key,

                        // Google Sheets settings - bringing them to top level for compatibility
                        spreadsheetId: data.api_settings?.spreadsheetId,
                        sheetNameKnowledgeBase: data.api_settings?.sheetNameKnowledgeBase,
                        sheetNameInterviewQuestions: data.api_settings?.sheetNameInterviewQuestions,

                        // Structured settings
                        apiSettings: data.api_settings || {},
                        appPreferences: data.app_preferences || {},
                        featureFlags: data.feature_flags || {}
                    };

                    setSettings(mappedSettings);
                    previousSettingsRef.current = mappedSettings;
                }
            } else {
                // Load settings from localStorage
                const savedSettings = localStorage.getItem(`user_settings_${user.id}`);
                if (savedSettings) {
                    try {
                        const parsedSettings = JSON.parse(savedSettings);
                        setSettings(parsedSettings);
                        previousSettingsRef.current = parsedSettings;
                    } catch (error) {
                        console.error('Failed to parse settings from localStorage:', error);
                        localStorage.removeItem(`user_settings_${user.id}`);
                    }
                }
            }

            // Mark initial load as complete
            setInitialLoadComplete(true);
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

    // Auto-save settings when they change
    useEffect(() => {
        // Don't save during initial load or if skip flag is set
        if (!initialLoadComplete || skipNextSave) {
            setSkipNextSave(false);
            return;
        }

        // Skip if settings haven't actually changed
        if (JSON.stringify(settings) === JSON.stringify(previousSettingsRef.current)) {
            return;
        }

        // Update the reference for next comparison
        previousSettingsRef.current = settings;

        // Auto-save
        debouncedSave(settings);

    }, [settings, initialLoadComplete, debouncedSave]);

    // Manual save - can be used to force immediate save
    const saveSettings = async () => {
        setSkipNextSave(true); // Prevent auto-save from double-saving
        debouncedSave.cancel(); // Cancel any pending auto-saves

        if (!user) return;

        setLoading(true);
        try {
            if (isGoogle) {
                // Format settings for database
                const dbSettings = {
                    // Direct API keys
                    openai: settings.openai,
                    gemini: settings.gemini,
                    mistral: settings.mistral,
                    openchat: settings.openchat,
                    googleSheetApiKey: settings.googleSheetApiKey,

                    // Structured settings
                    api_settings: {
                        ...settings.apiSettings,
                        // Include top-level sheet settings in api_settings
                        spreadsheetId: settings.spreadsheetId,
                        sheetNameKnowledgeBase: settings.sheetNameKnowledgeBase,
                        sheetNameInterviewQuestions: settings.sheetNameInterviewQuestions
                    },
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

    // Update a setting value with optional auto-save control
    const updateSetting = (category: string, key: string, value: any, skipAutoSave = false) => {

        if (skipAutoSave) {
            setSkipNextSave(true);
        }

        setSettings(prev => {
            const newSettings = category ? {
                ...prev,
                [category]: {
                    ...(prev[category] || {}),
                    [key]: value
                }
            } : {
                ...prev,
                [key]: value
            };

            return newSettings;
        });
    };

    // Update multiple settings at once (useful for forms)
    const updateMultipleSettings = (updates: Partial<SettingsState>, skipAutoSave = false) => {
        if (skipAutoSave) {
            setSkipNextSave(true);
        }

        setSettings(prev => ({
            ...prev,
            ...updates
        }));
    };

    // Update API key - convenience method that matches useApiKeysSettings
    const handleApiKeyChange = (key: string, value: string) => {
        updateSetting('', key, value);
    };

    // Update feature flag - with Supabase sync for Google users
    const handleFeatureFlagChange = async (key: string, value: boolean) => {
        if (!user) return;

        try {
            setLoading(true);
            // Update local state
            updateSetting('featureFlags', key, value, true); // Skip auto-save

            if (isGoogle) {
                // Update in Supabase
                await updateFeatureFlag(user.id, key, value);
            } else {
                // Full save to localStorage to ensure consistency
                const updatedSettings = {
                    ...settings,
                    featureFlags: {
                        ...(settings.featureFlags || {}),
                        [key]: value
                    }
                };
                localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(updatedSettings));
            }
        } catch (error) {
            console.error('Error updating feature flag:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload - support both flat and nested formats
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
        const sampleContent = `openai=sk-...\ngemini=AIzaSy...\nmistral=...\nopenchat=...\nspreadsheetId=...\nsheetNameKnowledgeBase=...\nsheetNameInterviewQuestions=...\nfeatureFlags.autoSaveKnowledge=true\nfeatureFlags.autoSaveInterview=true`;
        const blob = new Blob([sampleContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-settings.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get API keys in flat format (for components expecting the old format)
    const getApiKeys = () => {
        const { openai, gemini, mistral, openchat, googleSheetApiKey, spreadsheetId,
            sheetNameKnowledgeBase, sheetNameInterviewQuestions } = settings;

        return {
            openai,
            gemini,
            mistral,
            openchat,
            googleSheetApiKey,
            spreadsheetId,
            sheetNameKnowledgeBase,
            sheetNameInterviewQuestions
        };
    };

    // Get feature flags (for components expecting the old format)
    const getFeatureFlags = () => settings.featureFlags || {};

    return {
        // Full settings object
        settings,

        // For backward compatibility with useApiKeysSettings
        apiKeys: getApiKeys(),
        featureFlags: getFeatureFlags(),

        // Status
        saved,
        loading,
        showKeys,
        setShowKeys,
        isGoogle,

        // Methods
        saveSettings,
        updateSetting,
        updateMultipleSettings,
        handleApiKeyChange,
        handleFeatureFlagChange,
        handleFileUpload,
        handleDownloadSampleSettings: handleDownloadSampleSettings,
        loadSettings,
    };
};