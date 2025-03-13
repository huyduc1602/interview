import React, { useState, useEffect, Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';

interface ApiKeyFormProps {
    onSubmit: (apiKey: string, spreadsheetId: string, sheetName: string) => void;
    sheetNameProp?: string;
    setIsApiKeyFormVisible: Dispatch<React.SetStateAction<boolean>>;
}

export default function ApiKeyForm({ onSubmit, sheetNameProp, setIsApiKeyFormVisible }: ApiKeyFormProps) {
    const { t } = useTranslation();
    const { settings, updateSetting } = useSettings();
    const [apiKey, setApiKey] = useState('');
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Load initial values from settings
    useEffect(() => {
        setApiKey(settings.googleSheetApiKey || '');
        setSpreadsheetId(settings.spreadsheetId || '');

        // Determine which sheet name to use based on the prop
        let sheetNameKey = 'sheetNameKnowledgeBase'; // Default
        if (sheetNameProp === 'sheetNameInterviewQuestions') {
            sheetNameKey = 'sheetNameInterviewQuestions';
        }

        setSheetName(settings[sheetNameKey] || '');
    }, [settings, sheetNameProp]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update settings with new values
            updateSetting('', 'googleSheetApiKey', apiKey);
            updateSetting('', 'spreadsheetId', spreadsheetId);

            // Update appropriate sheet name based on prop
            let sheetNameKey = 'sheetNameKnowledgeBase'; // Default
            if (sheetNameProp === 'sheetNameInterviewQuestions') {
                sheetNameKey = 'sheetNameInterviewQuestions';
            }

            updateSetting('', sheetNameKey, sheetName);

            // Call the onSubmit callback with the new values
            onSubmit(apiKey, spreadsheetId, sheetName);
            setIsApiKeyFormVisible(false);
        } catch (error) {
            console.error('Error saving API settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const classInput = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">{t('apiKeyForm.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('apiKeyForm.labels.apiKey')}</label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={classInput}
                        placeholder={t('apiKeyForm.placeholders.apiKey')}
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('apiKeyForm.labels.spreadsheetId')}</label>
                    <input
                        type="text"
                        value={spreadsheetId}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        className={classInput}
                        placeholder={t('apiKeyForm.placeholders.spreadsheetId')}
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('apiKeyForm.labels.sheetName')}</label>
                    <input
                        type="text"
                        value={sheetName}
                        onChange={(e) => setSheetName(e.target.value)}
                        className={classInput}
                        placeholder={t('apiKeyForm.placeholders.sheetName')}
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-[90%] text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? t('apiKeyForm.loading') : t('apiKeyForm.submit')}
                </button>
            </form>
        </div>
    );
}