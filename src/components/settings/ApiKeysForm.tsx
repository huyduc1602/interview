import React from 'react';
import { useTranslation } from 'react-i18next';
import ApiKeyInput from './ApiKeyInput';
import { ApiKeyService } from '@/hooks/useApiKeys';
import { APIKeysState } from '@/hooks/useApiKeysSettings';

interface ApiKeysFormProps {
    apiKeys: APIKeysState;
    handleApiKeyChange: (key: string, value: string) => void;
    showKeys: boolean;
}

const ApiKeysForm: React.FC<ApiKeysFormProps> = ({
    apiKeys,
    handleApiKeyChange,
    showKeys
}) => {
    const { t } = useTranslation();

    // Define the API key fields
    const apiKeyFields = [
        {
            name: ApiKeyService.OPENAI,
            label: t('settings.apiKeys.openai.label'),
            helpText: t('settings.apiKeys.openai.help'),
            placeholder: 'sk-...'
        },
        {
            name: ApiKeyService.GEMINI,
            label: t('settings.apiKeys.gemini.label'),
            helpText: t('settings.apiKeys.gemini.help'),
            placeholder: 'AIzaSy...'
        },
        {
            name: ApiKeyService.MISTRAL,
            label: t('settings.apiKeys.mistral.label'),
            helpText: t('settings.apiKeys.mistral.help'),
            placeholder: ''
        },
        {
            name: ApiKeyService.OPENCHAT,
            label: t('settings.apiKeys.openchat.label'),
            helpText: t('settings.apiKeys.openchat.help'),
            placeholder: ''
        },
        {
            name: ApiKeyService.GOOGLE_SHEET_API_KEY,
            label: t('settings.apiKeys.googleSheetApiKey.label'),
            helpText: t('settings.apiKeys.googleSheetApiKey.help'),
            placeholder: 'AIzaSy...'
        },
        {
            name: ApiKeyService.SPREADSHEET_ID,
            label: t('settings.apiKeys.spreadsheetId.label'),
            helpText: t('settings.apiKeys.spreadsheetId.help'),
            placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
        },
        {
            name: ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE,
            label: t('settings.apiKeys.sheetNameKnowledgeBase.label'),
            helpText: t('settings.apiKeys.sheetNameKnowledgeBase.help'),
            placeholder: 'KnowledgeBase'
        },
        {
            name: ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS,
            label: t('settings.apiKeys.sheetNameInterviewQuestions.label'),
            helpText: t('settings.apiKeys.sheetNameInterviewQuestions.help'),
            placeholder: 'InterviewQuestions'
        }
    ];

    return (
        <div className="grid gap-6">
            {apiKeyFields.map(field => (
                <ApiKeyInput
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    value={apiKeys[field.name] || ''}
                    onChange={(value) => handleApiKeyChange(field.name, value)}
                    placeholder={field.placeholder}
                    helpText={field.helpText}
                    showKey={showKeys}
                />
            ))}
        </div>
    );
};

export default ApiKeysForm;