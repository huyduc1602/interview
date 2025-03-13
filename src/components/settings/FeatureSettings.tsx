import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsState } from '@/hooks/useSettings';

interface FeatureSettingsProps {
    settings: SettingsState;
    updateSetting: (category: string, key: string, value: any) => void;
}

const FeatureSettings: React.FC<FeatureSettingsProps> = ({
    settings,
    updateSetting
}) => {
    const { t } = useTranslation();
    const features = settings.featureFlags || {};

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.features.autoSave.title')}</CardTitle>
                    <CardDescription>
                        {t('settings.features.autoSave.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoSaveKnowledge">
                                {t('settings.features.autoSave.knowledge')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.features.autoSave.knowledgeHelp')}
                            </p>
                        </div>
                        <Switch
                            id="autoSaveKnowledge"
                            checked={features.autoSaveKnowledge || false}
                            onCheckedChange={(checked) =>
                                updateSetting('featureFlags', 'autoSaveKnowledge', checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="autoSaveInterview">
                                {t('settings.features.autoSave.interview')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.features.autoSave.interviewHelp')}
                            </p>
                        </div>
                        <Switch
                            id="autoSaveInterview"
                            checked={features.autoSaveInterview || false}
                            onCheckedChange={(checked) =>
                                updateSetting('featureFlags', 'autoSaveInterview', checked)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.features.saveHistory.title')}</CardTitle>
                    <CardDescription>
                        {t('settings.features.saveHistory.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="saveHistoryKnowledge">
                                {t('settings.features.saveHistory.knowledge')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.features.saveHistory.knowledgeHelp')}
                            </p>
                        </div>
                        <Switch
                            id="saveHistoryKnowledge"
                            checked={features.saveHistoryKnowledge || false}
                            onCheckedChange={(checked) =>
                                updateSetting('featureFlags', 'saveHistoryKnowledge', checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="saveHistoryInterview">
                                {t('settings.features.saveHistory.interview')}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.features.saveHistory.interviewHelp')}
                            </p>
                        </div>
                        <Switch
                            id="saveHistoryInterview"
                            checked={features.saveHistoryInterview || false}
                            onCheckedChange={(checked) =>
                                updateSetting('featureFlags', 'saveHistoryInterview', checked)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeatureSettings;