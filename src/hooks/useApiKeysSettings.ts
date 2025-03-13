import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserSettings, updateFeatureFlag } from '@/utils/supabaseStorage';

export interface APIKeysState {
    openai?: string;
    gemini?: string;
    mistral?: string;
    openchat?: string;
    googleSheetApiKey?: string;
    spreadsheetId?: string;
    sheetNameKnowledgeBase?: string;
    sheetNameInterviewQuestions?: string;
    [key: string]: string | undefined;
}

export const useApiKeysSettings = () => {
    const { user, isGoogleUser } = useAuth();
    const [apiKeys, setApiKeys] = useState<APIKeysState>({});
    const [saved, setSaved] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
    const [featureFlags, setFeatureFlags] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const isGoogle = isGoogleUser();

    useEffect(() => {
        if (user) {
            loadApiKeys();
        }
    }, [user]);

    const loadApiKeys = async () => {
        if (!user) return;
        setLoading(true);

        try {
            if (isGoogle) {
                // Load settings from Supabase
                const { data: settingsData } = await fetchUserSettings(user.id);

                if (settingsData) {
                    // Set API keys
                    const settings: APIKeysState = {
                        // ...existing mapping
                    };
                    setApiKeys(settings);

                    // Set feature flags
                    setFeatureFlags(settingsData.feature_flags || {});
                }

                // If no feature flags exist yet, initialize defaults
                if (!settingsData?.feature_flags) {
                    const defaultFlags = {
                        auto_save_knowledge: true,
                        auto_save_interview: true
                    };
                    setFeatureFlags(defaultFlags);
                }
            } else {
                // Load from localStorage
                const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
                if (savedKeys) {
                    try {
                        setApiKeys(JSON.parse(savedKeys));
                    } catch (error) {
                        console.error('Failed to parse API keys from localStorage:', error);
                        localStorage.removeItem(`api_keys_${user.id}`);
                    }
                }

                // Load feature flags
                const savedFlags = localStorage.getItem(`feature_flags_${user.id}`);
                if (savedFlags) {
                    try {
                        setFeatureFlags(JSON.parse(savedFlags));
                    } catch (error) {
                        console.error('Failed to parse feature flags:', error);
                    }
                } else {
                    // Set default flags
                    const defaultFlags = {
                        auto_save_knowledge: true,
                        auto_save_interview: true
                    };
                    setFeatureFlags(defaultFlags);
                    localStorage.setItem(`feature_flags_${user.id}`, JSON.stringify(defaultFlags));
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (user && Object.keys(apiKeys).length > 0) {
            localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(apiKeys));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleApiKeyChange = (key: string, value: string) => {
        setApiKeys(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const newApiKeys: APIKeysState = {};
                lines.forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        newApiKeys[key.trim()] = value.trim();
                    }
                });
                setApiKeys({ ...apiKeys, ...newApiKeys });
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadSampleKeys = () => {
        const sampleContent = `openai=sk-...\ngemini=AIzaSy...\nmistral=...\nopenchat=...\ngoogleSheetApiKey=...\nspreadsheetId=...\nsheetNameKnowledgeBase=...\nsheetNameInterviewQuestions=...`;
        const blob = new Blob([sampleContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-api-keys.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFeatureFlagChange = async (key: string, value: boolean) => {
        if (!user) return;

        try {
            setLoading(true);

            // Update local state
            setFeatureFlags(prev => ({
                ...prev,
                [key]: value
            }));

            if (isGoogle) {
                // Update in Supabase
                await updateFeatureFlag(user.id, key, value);
            } else {
                // Update in localStorage
                localStorage.setItem(`feature_flags_${user.id}`, JSON.stringify({
                    ...featureFlags,
                    [key]: value
                }));
            }
        } catch (error) {
            console.error('Error updating feature flag:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        apiKeys,
        setApiKeys,
        saved,
        showKeys,
        setShowKeys,
        handleSave,
        handleApiKeyChange,
        handleFileUpload,
        handleDownloadSampleKeys,
        loadApiKeys,
        featureFlags,
        loading,
        handleFeatureFlagChange
    };
};