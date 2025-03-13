import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
    const { user } = useAuth();
    const [apiKeys, setApiKeys] = useState<APIKeysState>({});
    const [saved, setSaved] = useState(false);
    const [showKeys, setShowKeys] = useState(false);

    useEffect(() => {
        if (user) {
            loadApiKeys();
        }
    }, [user]);

    const loadApiKeys = () => {
        if (!user) return;

        const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
        if (savedKeys) {
            try {
                setApiKeys(JSON.parse(savedKeys));
            } catch (error) {
                console.error('Failed to parse API keys from localStorage:', error);
                localStorage.removeItem(`api_keys_${user.id}`);
            }
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
        loadApiKeys
    };
};