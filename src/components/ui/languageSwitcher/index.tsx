import { useEffect, useState } from 'react';
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
import { useAuth } from '@/hooks/useAuth';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const { user } = useAuth();
  // Local state to store current language to avoid re-renders
  const [currentLanguage, setCurrentLanguage] = useState(i18n?.language || 'vi');

  // Set initial language from settings only once on mount
  useEffect(() => {
    try {
      const savedLanguage = settings?.appPreferences?.language;
      const defaultLanguage = savedLanguage || 'vi';

      if (i18n && defaultLanguage !== currentLanguage) {
        i18n.changeLanguage(defaultLanguage);
        setCurrentLanguage(defaultLanguage);
      }
    } catch (error) {
      console.error("Language initialization error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Empty dependency array means this runs once on mount

  // Update language when user changes
  useEffect(() => {
    if (user && user.preferredLanguage && user.preferredLanguage !== currentLanguage) {
      const userLanguage = user.preferredLanguage;

      if (i18n) {
        i18n.changeLanguage(userLanguage);
        setCurrentLanguage(userLanguage);

        // Only update settings if different
        if (updateSetting && settings?.appPreferences?.language !== userLanguage) {
          updateSetting('appPreferences', 'language', userLanguage);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);  // Only depend on user to avoid loops

  const handleLanguageChange = (value: string) => {
    if (!i18n || value === currentLanguage) return;

    if (value === 'en' || value === 'vi') {
      // Update local state first
      setCurrentLanguage(value);

      // Then update i18n
      i18n.changeLanguage(value);

      // Finally update settings
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

  // Find the current language display info
  const currentLangDisplay = languages.find(lang => lang.value === currentLanguage) || languages[1];

  return (
    <div className="relative inline-block">
      <Select
        defaultValue={currentLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 sm:px-0">
          <SelectValue placeholder={
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>
                {currentLangDisplay.flag} {currentLangDisplay.label}
              </span>
            </div>
          }>
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
    </div>
  );
}