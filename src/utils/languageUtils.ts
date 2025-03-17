import { settingsBridge } from './settingsBridge';

/**
 * List of supported languages in the application
 */
export const supportedLanguages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
];

/**
 * Detect the browser's language and check if it's supported
 * Returns the detected language code if supported, or the default if not
 */
export function detectBrowserLanguage(defaultLang = 'vi'): string {
    try {
        // Get navigator language (e.g. 'en-US', 'vi', 'fr')
        const browserLang = navigator.language.split('-')[0].toLowerCase();

        // Check if the browser language is supported
        const isSupported = supportedLanguages.some(lang =>
            lang.value.toLowerCase() === browserLang
        );

        if (isSupported) {
            console.log(`Browser language detected and supported: ${browserLang}`);
            return browserLang;
        } else {
            console.log(`Browser language ${browserLang} not supported, using default: ${defaultLang}`);
        }
    } catch (error) {
        console.error('Error detecting browser language:', error);
    }

    return defaultLang;
}

/**
 * Gets the user's preferred language from all available sources
 * in a consistent order of precedence:
 * 1. SettingsBridge (in-memory current settings)
 * 2. User-specific settings in localStorage
 * 3. Browser language if supported
 * 4. Default language
 */
export function getUserPreferredLanguage(defaultLang = 'vi'): string {
    try {
        // First check if settings are available in the bridge
        const bridgeSettings = settingsBridge.getSettings();
        const currentUserId = settingsBridge.getCurrentUserId();

        // 1. Check settingsBridge first (most up-to-date source)
        if (bridgeSettings?.appPreferences?.language) {
            return bridgeSettings.appPreferences.language;
        }

        // 2. If bridge has userId but no language setting, check localStorage for that user
        if (currentUserId) {
            const userSettingsKey = `user_settings_${currentUserId}`;
            const storedSettings = localStorage.getItem(userSettingsKey);
            if (storedSettings) {
                const settings = JSON.parse(storedSettings);
                if (settings?.appPreferences?.language) {
                    return settings.appPreferences.language;
                }
            }
        }

        // 3. Use browser language if supported
        return detectBrowserLanguage(defaultLang);
    } catch (error) {
        console.error('Error reading language preference:', error);
    }

    // 4. Return default language if nothing found
    return defaultLang;
}

/**
 * Get language display info by language code
 */
export function getLanguageDisplayInfo(languageCode: string) {
    return supportedLanguages.find(lang => lang.value === languageCode)
        || supportedLanguages.find(lang => lang.value === 'vi')
        || supportedLanguages[0];
}
