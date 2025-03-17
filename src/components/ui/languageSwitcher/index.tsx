import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { Languages } from 'lucide-react';
import { useLanguageManager } from '@/hooks/useLanguageManager';

export function LanguageSwitcher() {
  const {
    currentLanguage,
    currentLangDisplay,
    languages,
    changeLanguage
  } = useLanguageManager();

  return (
    <div className="relative inline-block">
      <Select
        value={currentLanguage}
        onValueChange={changeLanguage}
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