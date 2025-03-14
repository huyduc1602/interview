import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { settings, updateSetting } = useSettings();

  // Set initial language from settings or default to Vietnamese
  useEffect(() => {
    try {
      const savedLanguage = settings?.appPreferences?.language;
      const defaultLanguage = savedLanguage || 'vi';

      // Only change if different from current
      if (i18n && i18n.language !== defaultLanguage) {
        i18n.changeLanguage(defaultLanguage);
      }
    } catch (error) {
      console.error("Language initialization error:", error);
    }
  }, [settings, i18n]);

  const handleLanguageChange = (value: string) => {
    if (!i18n) return;

    if (value === 'en' || value === 'vi') {
      // First update the i18n language immediately for UI
      i18n.changeLanguage(value);

      // Then update the setting - this will trigger auto-save from our enhanced useSettings hook
      if (updateSetting) {
        updateSetting('appPreferences', 'language', value);
      }
    }
  };

  // Available languages with their labels
  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  return (
    <Select
      defaultValue={i18n?.language || 'vi'}
      value={i18n?.language || 'vi'}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className="w-[130px] fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-md z-50">
        <SelectValue placeholder="Select Language">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span>
              {i18n?.language === 'en' ? '🇺🇸 English' : '🇻🇳 Tiếng Việt'}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}