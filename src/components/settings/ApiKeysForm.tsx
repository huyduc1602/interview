import React from 'react';
import { useTranslation } from 'react-i18next';
import ApiKeyInput from './ApiKeyInput';
import { SettingsState } from '@/hooks/useSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ApiKeysFormProps {
    // Use the unified settings types
    settings: SettingsState;
    updateSetting: (category: string, key: string, value: any) => void;
    showKeys: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const ApiKeysForm: React.FC<ApiKeysFormProps> = ({
    settings,
    updateSetting,
    showKeys,
}) => {
    const { t } = useTranslation();

    // Get feature flags for convenience
    const featureFlags = settings?.featureFlags || {};

    // Define the API key fields with category support
    const apiKeyFields = [
        {
            name: 'openai',
            category: '',
            label: t('settings.apiKeys.openai.label'),
            helpText: t('settings.apiKeys.openai.help'),
            placeholder: 'sk-...'
        },
        ...(isDevelopment ? [{
            name: 'gemini',
            category: '',
            label: t('settings.apiKeys.gemini.label'),
            helpText: t('settings.apiKeys.gemini.help'),
            placeholder: 'AIzaSy...'
        }] : []),
        {
            name: 'mistral',
            category: '',
            label: t('settings.apiKeys.mistral.label'),
            helpText: t('settings.apiKeys.mistral.help'),
            placeholder: ''
        },
        {
            name: 'openchat',
            category: '',
            label: t('settings.apiKeys.openchat.label'),
            helpText: t('settings.apiKeys.openchat.help'),
            placeholder: ''
        },
        {
            name: 'googleSheetApiKey',
            category: '',
            label: t('settings.apiKeys.googleSheetApiKey.label'),
            helpText: t('settings.apiKeys.googleSheetApiKey.help'),
            placeholder: 'AIzaSy...'
        },
        {
            name: 'spreadsheetId',
            category: '',
            label: t('settings.apiKeys.spreadsheetId.label'),
            helpText: t('settings.apiKeys.spreadsheetId.help'),
            placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
        },
        {
            name: 'sheetNameKnowledgeBase',
            category: '',
            label: t('settings.apiKeys.sheetNameKnowledgeBase.label'),
            helpText: t('settings.apiKeys.sheetNameKnowledgeBase.help'),
            placeholder: 'KnowledgeBase'
        },
        {
            name: 'sheetNameInterviewQuestions',
            category: '',
            label: t('settings.apiKeys.sheetNameInterviewQuestions.label'),
            helpText: t('settings.apiKeys.sheetNameInterviewQuestions.help'),
            placeholder: 'InterviewQuestions'
        }
    ];

    // Feature toggles
    const featureToggles = [
        {
            key: "autoSaveKnowledge",
            label: t('settings.features.autoSaveKnowledge.label'),
            description: t('settings.features.autoSaveKnowledge.description')
        },
        {
            key: "autoSaveInterview",
            label: t('settings.features.autoSaveInterview.label'),
            description: t('settings.features.autoSaveInterview.description')
        }
    ];

    // Helper function to get value from settings object
    const getValue = (field: { name: string, category: string }) => {
        if (!field.category) {
            return settings[field.name] || '';
        }
        return settings && settings[field.category]?.[field.name] || '';
    };

    // Handle setting value change
    const handleValueChange = (field: { name: string, category: string }, value: string) => {
        updateSetting(field.category, field.name, value);
    };

    // Handle feature flag change
    const handleFeatureFlagChange = (key: string, value: boolean) => {
        updateSetting('featureFlags', key, value);
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-6">
                {apiKeyFields.map(field => (
                    <ApiKeyInput
                        key={`${field.category}-${field.name}`}
                        name={field.name}
                        label={field.label}
                        value={getValue(field)}
                        onChange={(value) => handleValueChange(field, value)}
                        placeholder={field.placeholder}
                        helpText={field.helpText}
                        showKey={showKeys}
                    />
                ))}
            </div>

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
                                checked={!!featureFlags[feature.key]}
                                variant="success"
                                onCheckedChange={(checked) => handleFeatureFlagChange(feature.key, checked)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApiKeysForm;