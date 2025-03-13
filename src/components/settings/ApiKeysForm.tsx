import React from 'react';
import { useTranslation } from 'react-i18next';
import ApiKeyInput from './ApiKeyInput';
import { APIKeysState } from '@/hooks/useApiKeysSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ApiKeysFormProps {
    apiKeys: APIKeysState;
    handleApiKeyChange: (key: string, value: string) => void;
    showKeys: boolean;
    featureFlags: Record<string, any>;
    onFeatureFlagChange?: (key: string, value: boolean) => void;
}

const ApiKeysForm: React.FC<ApiKeysFormProps> = ({
    apiKeys,
    handleApiKeyChange,
    showKeys,
    featureFlags,
    onFeatureFlagChange
}) => {
    const { t } = useTranslation();

    // Define the API key fields
    const apiKeyFields = [
        {
            name: 'openai',
            label: t('settings.apiKeys.openai.label'),
            helpText: t('settings.apiKeys.openai.help'),
            placeholder: 'sk-...'
        },
        {
            name: 'gemini',
            label: t('settings.apiKeys.gemini.label'),
            helpText: t('settings.apiKeys.gemini.help'),
            placeholder: 'AIzaSy...'
        },
        {
            name: 'mistral',
            label: t('settings.apiKeys.mistral.label'),
            helpText: t('settings.apiKeys.mistral.help'),
            placeholder: ''
        },
        {
            name: 'openchat',
            label: t('settings.apiKeys.openchat.label'),
            helpText: t('settings.apiKeys.openchat.help'),
            placeholder: ''
        },
        {
            name: 'googleSheetApiKey',
            category: 'apiSettings',
            label: t('settings.apiKeys.googleSheetApiKey.label'),
            helpText: t('settings.apiKeys.googleSheetApiKey.help'),
            placeholder: 'AIzaSy...'
        },
        {
            name: 'spreadsheetId',
            category: 'apiSettings',
            label: t('settings.apiKeys.spreadsheetId.label'),
            helpText: t('settings.apiKeys.spreadsheetId.help'),
            placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
        },
        {
            name: 'sheetNameKnowledgeBase',
            category: 'apiSettings',
            label: t('settings.apiKeys.sheetNameKnowledgeBase.label'),
            helpText: t('settings.apiKeys.sheetNameKnowledgeBase.help'),
            placeholder: 'KnowledgeBase'
        },
        {
            name: 'sheetNameInterviewQuestions',
            category: 'apiSettings',
            label: t('settings.apiKeys.sheetNameInterviewQuestions.label'),
            helpText: t('settings.apiKeys.sheetNameInterviewQuestions.help'),
            placeholder: 'InterviewQuestions'
        }
    ];

    // Feature toggles
    const featureToggles = [
        {
            key: "auto_save_knowledge",
            label: t('settings.features.autoSaveKnowledge.label'),
            description: t('settings.features.autoSaveKnowledge.description')
        },
        {
            key: "auto_save_interview",
            label: t('settings.features.autoSaveInterview.label'),
            description: t('settings.features.autoSaveInterview.description')
        }
    ];

    return (
        <div className="space-y-8">
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

            {onFeatureFlagChange && (
                <div className="border rounded-md p-4 space-y-4">
                    <h3 className="text-lg font-medium">{t('settings.features.title')}</h3>

                    <div className="space-y-4">
                        {featureToggles.map(feature => (
                            <div key={feature.key} className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor={feature.key} className="font-medium">
                                        {feature.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                                <Switch
                                    id={feature.key}
                                    checked={featureFlags[feature.key] === true}
                                    onCheckedChange={(checked) => onFeatureFlagChange(feature.key, checked)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeysForm;