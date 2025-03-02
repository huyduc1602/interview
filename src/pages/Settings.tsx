import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key } from 'lucide-react';

interface APIKeys {
  openai?: string;
  gemini?: string;
  mistral?: string;
  openchat?: string;
}

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys));
      }
    }
  }, [user]);

  const handleSave = () => {
    if (user && Object.keys(apiKeys).length > 0) {
      localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(apiKeys));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

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

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  OpenAI API Key
                </label>
                <Input
                  type="password"
                  value={apiKeys.openai || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                  placeholder="sk-..."
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.openai.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Google Gemini API Key
                </label>
                <Input
                  type="password"
                  value={apiKeys.gemini || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                  placeholder="AIzaSy..."
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.gemini.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Mistral API Key
                </label>
                <Input
                  type="password"
                  value={apiKeys.mistral || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, mistral: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.mistral.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  OpenChat API Key
                </label>
                <Input
                  type="password"
                  value={apiKeys.openchat || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openchat: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.openchat.help')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave}>
                {t('settings.save')}
              </Button>
              {saved && (
                <span className="text-sm text-green-600">
                  {t('settings.saved')}
                </span>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}