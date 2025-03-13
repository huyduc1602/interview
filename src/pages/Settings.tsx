import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Cloud, Database, ToggleLeft } from 'lucide-react';
import { useApiKeysSettings } from '@/hooks/useApiKeysSettings';
import SettingsActions from '@/components/settings/SettingsActions';
import ApiKeysForm from '@/components/settings/ApiKeysForm';
import FeatureSettings from '@/components/settings/FeatureSettings';
import { useAuth } from '@/hooks/useAuth';

export default function Settings() {
  const { t } = useTranslation();
  const {
    apiKeys,
    saved,
    showKeys,
    setShowKeys,
    handleSave,
    handleApiKeyChange,
    handleFileUpload,
    handleDownloadSampleKeys,
    featureFlags,
    handleFeatureFlagChange
  } = useApiKeysSettings();

  const { isGoogleUser } = useAuth();
  const isGoogle = isGoogleUser();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

      <Tabs defaultValue="apikeys">
        <TabsList>
          <TabsTrigger value="apikeys">
            <Key className="w-4 h-4 mr-2" />
            {t('settings.tabs.apiKeys')}
          </TabsTrigger>
          <TabsTrigger value="features">
            <ToggleLeft className="w-4 h-4 mr-2" />
            {t('settings.tabs.features')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apikeys" className="mt-6">
          <div className="space-y-6">
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                {t('settings.apiKeys.info')}
              </AlertDescription>
            </Alert>

            {/* Storage location indicator */}
            <Alert className={isGoogle ? 'bg-blue-50' : 'bg-gray-50'}>
              {isGoogle ? (
                <Cloud className="w-4 h-4 text-blue-500" />
              ) : (
                <Database className="w-4 h-4 text-gray-500" />
              )}
              <AlertDescription>
                {isGoogle
                  ? t('settings.storageInfo.cloud')
                  : t('settings.storageInfo.local')}
              </AlertDescription>
            </Alert>

            <SettingsActions
              onSave={handleSave}
              showKeys={showKeys}
              setShowKeys={setShowKeys}
              onFileUpload={handleFileUpload}
              onDownloadSampleKeys={handleDownloadSampleKeys}
              saved={saved}
            />

            <ApiKeysForm
              apiKeys={apiKeys}
              handleApiKeyChange={handleApiKeyChange}
              showKeys={showKeys}
              featureFlags={featureFlags}
              onFeatureFlagChange={handleFeatureFlagChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              {t('settings.features.info')}
            </AlertDescription>
          </Alert>

          <div className="mt-6">
            <FeatureSettings
              settings={apiKeys}
              updateSetting={handleApiKeyChange}
            />
          </div>

          <div className="mt-6">
            <SettingsActions
              onSave={handleSave}
              showKeys={showKeys}
              setShowKeys={setShowKeys}
              onFileUpload={handleFileUpload}
              onDownloadSampleKeys={handleDownloadSampleKeys}
              saved={saved}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}