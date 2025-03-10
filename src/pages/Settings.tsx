import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Eye, EyeOff, Upload } from 'lucide-react';
import { ApiKeyService } from '@/hooks/useApiKeys';

interface APIKeys {
  openai?: string;
  gemini?: string;
  mistral?: string;
  openchat?: string;
  googleSheetApiKey?: string;
  spreadsheetId?: string;
  sheetNameKnowledgeBase?: string;
  sheetNameInterviewQuestions?: string;
}

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (savedKeys) {
        try {
          setApiKeys(JSON.parse(savedKeys));
        } catch (error) {
          console.error('Failed to parse API keys from localStorage:', error);
          localStorage.removeItem(`api_keys_${user.id}`);
        }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const newApiKeys: APIKeys = {};
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            newApiKeys[key.trim() as keyof APIKeys] = value.trim();
          }
        });
        setApiKeys(newApiKeys);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadSample = () => {
    const sampleContent = `openai=sk-...\ngemini=AIzaSy...\nmistral=...\nopenchat=...\ngoogleSheetApiKey=...\nspreadsheetId=...\nsheetNameKnowledgeBase=...\nsheetNameInterviewQuestions=...`;
    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-api-keys.txt';
    a.click();
    URL.revokeObjectURL(url);
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

            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                {t('settings.save')}
              </Button>
              {saved && (
                <span className="text-sm text-green-600">
                  {t('settings.saved')}
                </span>
              )}
              <Button
                variant="outline"
                onClick={() => setShowKeys(!showKeys)}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-300"
              >
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} &nbsp;
                {showKeys ? t('settings.hideKeys') : t('settings.showKeys')}
              </Button>
              <label className="flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span className="text-gray-700 font-semibold">{t('settings.upload')}</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <Button
                variant="outline"
                onClick={handleDownloadSample}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-300"
              >
                {t('settings.downloadSample')}
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.openai.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.openai || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.OPENAI]: e.target.value }))}
                  placeholder="sk-..."
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.openai.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.gemini.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.gemini || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.GEMINI]: e.target.value }))}
                  placeholder="AIzaSy..."
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.gemini.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.mistral.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.mistral || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.MISTRAL]: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.mistral.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.openchat.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.openchat || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.OPENCHAT]: e.target.value }))}
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.openchat.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.googleSheetApiKey.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.googleSheetApiKey || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.GOOGLE_SHEET_API_KEY]: e.target.value }))}
                  placeholder="AIzaSy..."
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.googleSheetApiKey.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.spreadsheetId.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.spreadsheetId || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.SPREADSHEET_ID]: e.target.value }))}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.spreadsheetId.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.sheetNameKnowledgeBase.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.sheetNameKnowledgeBase || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE]: e.target.value }))}
                  placeholder="KnowledgeBase"
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.sheetNameKnowledgeBase.help')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('settings.apiKeys.sheetNameInterviewQuestions.label')}
                </label>
                <Input
                  type={showKeys ? "text" : "password"}
                  value={apiKeys.sheetNameInterviewQuestions || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, [ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS]: e.target.value }))}
                  placeholder="InterviewQuestions"
                />
                <p className="text-sm text-gray-500">
                  {t('settings.apiKeys.sheetNameInterviewQuestions.help')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}