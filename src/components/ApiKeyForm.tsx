import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApiKeys } from '@/hooks/useApiKeys';

interface ApiKeyFormProps {
    // eslint-disable-next-line no-unused-vars
    onSubmit: (apiKey: string, spreadsheetId: string) => void;
}

export default function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
    const { getApiKey, saveApiKey } = useApiKeys();
    const [apiKey, setApiKey] = useState('');
    const [spreadsheetId, setSpreadsheetId] = useState('');

    useEffect(() => {
        const initialApiKey = getApiKey('google_sheet');
        const initialSpreadsheetId = getApiKey('spreadsheet_id');
        if (initialApiKey) setApiKey(initialApiKey);
        if (initialSpreadsheetId) setSpreadsheetId(initialSpreadsheetId);
    }, [getApiKey]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        saveApiKey('google_sheet', apiKey);
        saveApiKey('spreadsheet_id', spreadsheetId);
        onSubmit(apiKey, spreadsheetId);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Enter Google Sheet API Key and Spreadsheet ID</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Sheet API Key</label>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="Enter your API key"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spreadsheet ID</label>
                    <input
                        type="text"
                        value={spreadsheetId}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="Enter your Spreadsheet ID"
                    />
                </div>
                <Button type="submit" variant="default" className="w-full py-2">Fetch Data</Button>
            </form>
        </div>
    );
}