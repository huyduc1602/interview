import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import vi from './locales/vi';
import { getUserPreferredLanguage } from './utils/languageUtils';

// Get the preferred language, which now includes browser language detection
const initialLanguage = getUserPreferredLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en',
    lng: initialLanguage,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Only use detector if our utility function doesn't find a language
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false // Prevents suspense during language loading
    }
  });

// Set HTML lang attribute
document.documentElement.lang = initialLanguage;

console.log(`i18n initialized with language: ${initialLanguage}`);

export default i18n;