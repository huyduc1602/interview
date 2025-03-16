import { useEffect, useState, useMemo } from 'react';
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

type Language = {
  value: string;
  label: string;
  flag: string;
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const { user } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n?.language || 'vi');

  // Available languages with their labels - memoized to avoid recreation on each render
  const languages: Language[] = useMemo(() => [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ], []);

  // Memoize current language display to avoid recalculation on each render
  const currentLangDisplay = useMemo(() =>
    languages.find(lang => lang.value === currentLanguage) || languages[1],
    [currentLanguage, languages]
  );

  // Combined effect for language initialization and user preference handling
  useEffect(() => {
    try {
      // First check for user preference if logged in
      if (user?.preferredLanguage) {
        const userLanguage = user.preferredLanguage;
        if (i18n && userLanguage !== i18n.language) {
          i18n.changeLanguage(userLanguage);
          setCurrentLanguage(userLanguage);

          if (updateSetting && settings?.appPreferences?.language !== userLanguage) {
            updateSetting('appPreferences', 'language', userLanguage);
          }
          return; // Exit early if we applied user preference
        }
      }

      // Otherwise use saved setting or default
      const savedLanguage = settings?.appPreferences?.language;
      const defaultLanguage = savedLanguage || 'vi';

      if (i18n && defaultLanguage !== i18n.language) {
        i18n.changeLanguage(defaultLanguage);
        setCurrentLanguage(defaultLanguage);
      }
    } catch (error) {
      console.error("Language initialization error:", error);
    }
  }, [i18n, settings?.appPreferences?.language, updateSetting, user]);

  const handleLanguageChange = (value: string) => {
    if (!i18n || value === currentLanguage) return;

    try {
      if (value === 'en' || value === 'vi') {
        // Update all language sources in the correct order
        i18n.changeLanguage(value);
        setCurrentLanguage(value);

        if (updateSetting) {
          updateSetting('appPreferences', 'language', value);
        }
      }
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  return (
    <div className="relative inline-block">
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[130px] bg-white dark:bg-gray-800 sm:px-0">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span>
                {currentLangDisplay.flag} {currentLangDisplay.label}
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
    </div>
  );
}