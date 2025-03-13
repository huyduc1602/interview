import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key } from 'lucide-react';
import { useApiKeysSettings } from '@/hooks/useApiKeysSettings';
import SettingsActions from '@/components/settings/SettingsActions';
import ApiKeysForm from '@/components/settings/ApiKeysForm';

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
    handleDownloadSampleKeys
  } = useApiKeysSettings();

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
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}