import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ApiKeyFormProps {
    onSubmit: (apiKey: string, spreadsheetId: string) => void;
}

export default function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
    const { getApiKey, saveApiKey } = useApiKeys();
    const [apiKey, setApiKey] = useState('');
    const [spreadsheetId, setSpreadsheetId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const initialApiKey = getApiKey('google_sheet');
        const initialSpreadsheetId = getApiKey('spreadsheet_id');
        if (initialApiKey) setApiKey(initialApiKey);
        if (initialSpreadsheetId) setSpreadsheetId(initialSpreadsheetId);
    }, [getApiKey]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!apiKey || !spreadsheetId) {
            setError(t('apiKeyForm.errors.required'));
            return;
        }
        setIsLoading(true);
        saveApiKey('google_sheet', apiKey);
        saveApiKey('spreadsheet_id', spreadsheetId);
        await onSubmit(apiKey, spreadsheetId);
        setIsLoading(false);
        navigate('/settings');
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
                <div className="mb-6">
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
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <Button
                    type="submit"
                    variant="default"
                    className="w-[90%] text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                        t('apiKeyForm.buttons.fetchData')
                    )}
                </Button>
            </form>
        </div>
    );
}