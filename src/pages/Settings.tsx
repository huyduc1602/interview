import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/index';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Cloud, Database } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import SettingsActions from '@/components/settings/SettingsActions';
import ApiKeysForm from '@/components/settings/ApiKeysForm';

export default function Settings() {
  const { t } = useTranslation();
  const {
    settings,
    saved,
    showKeys,
    setShowKeys,
    saveSettings,
    updateSetting,
    handleFileUpload,
    handleDownloadSampleSettings,
    isGoogleUser
  } = useSettings();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('settings.title')}</h1>

      <Tabs defaultValue="apikeys">
        <TabsList>
          <TabsTrigger value="apikeys">
            <Key className="w-4 h-4 mr-2" />
            {t('settings.tabs.apiKeys')}
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
            <Alert className={isGoogleUser() ? 'bg-blue-50' : 'bg-gray-50'}>
              {isGoogleUser() ? (
                <Cloud className="w-4 h-4 text-blue-500" />
              ) : (
                <Database className="w-4 h-4 text-gray-500" />
              )}
              <AlertDescription>
                {isGoogleUser()
                  ? t('settings.storageInfo.cloud')
                  : t('settings.storageInfo.local')}
              </AlertDescription>
            </Alert>

            <SettingsActions
              onSave={saveSettings}
              showKeys={showKeys}
              setShowKeys={setShowKeys}
              onFileUpload={handleFileUpload}
              onDownloadSampleKeys={handleDownloadSampleSettings}
              saved={saved}
            />

            <ApiKeysForm
              settings={settings}
              updateSetting={updateSetting}
              showKeys={showKeys}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}