import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from './useSettings';
import { useAuth } from './useAuth';
import { supportedLanguages, getUserPreferredLanguage } from '@/utils/languageUtils';

export type Language = {
    value: string;
    label: string;
    flag: string;
};

export function useLanguageManager() {
    const { i18n, ready } = useTranslation();
    const { settings, updateSetting, initializeSettings } = useSettings();
    const { user } = useAuth();
    const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
        // Initialize with the current i18n language or from settings
        return i18n?.language || getUserPreferredLanguage('vi');
    });
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const initialSetupDone = useRef(false);

    // Use the shared list of languages from our utils
    const languages: Language[] = supportedLanguages;

    // Current language display information
    const currentLangDisplay = languages.find(lang => lang.value === currentLanguage) || languages[1];

    // Helper function to ensure settings exist and update language
    const ensureSettingsAndUpdateLanguage = (lang: string) => {
        if (!updateSetting) return;

        // If settings don't exist or appPreferences doesn't exist, initialize them
        if (!settings || !settings.appPreferences) {
            console.log('Settings not initialized, creating with language preference:', lang);
            if (initializeSettings) {
                initializeSettings({ appPreferences: { language: lang } });
            } else {
                // Fallback if initializeSettings is not available
                updateSetting('appPreferences', 'language', lang);
            }
        } else if (settings.appPreferences.language !== lang) {
            // Settings exist, just update the language
            updateSetting('appPreferences', 'language', lang);
        }
    };

    // Ensure language is properly synchronized after i18n is ready
    useEffect(() => {
        if (ready && isInitializing) {
            setCurrentLanguage(i18n.language);
            setIsInitializing(false);
        }
    }, [ready, i18n, isInitializing]);

    // Initialize language based on user preference or saved settings
    useEffect(() => {
        if (initialSetupDone.current || !ready) return;

        const initializeLanguage = async () => {
            try {
                // First try to get language from user preferences if logged in
                if (user?.preferredLanguage) {
                    const userLanguage = user.preferredLanguage;
                    if (userLanguage !== i18n.language) {
                        console.log(`Setting user preferred language: ${userLanguage}`);
                        await i18n.changeLanguage(userLanguage);
                        setCurrentLanguage(userLanguage);

                        // Ensure settings exist and update language
                        ensureSettingsAndUpdateLanguage(userLanguage);
                        initialSetupDone.current = true;
                        return;
                    }
                }

                // Otherwise get language from utility function and apply if different
                const preferredLanguage = getUserPreferredLanguage();
                if (preferredLanguage !== i18n.language) {
                    console.log(`Setting preferred language from settings: ${preferredLanguage}`);
                    await i18n.changeLanguage(preferredLanguage);
                    setCurrentLanguage(preferredLanguage);

                    // Ensure settings are updated if they exist
                    ensureSettingsAndUpdateLanguage(preferredLanguage);
                }
            } catch (error) {
                console.error("Language initialization error:", error);
            } finally {
                initialSetupDone.current = true;
                setIsInitializing(false);
            }
        };

        initializeLanguage();
    }, [i18n, settings, updateSetting, user, ready]);

    // Listen for language changes
    useEffect(() => {
        const handleLanguageChanged = (lang: string) => {
            if (currentLanguage !== lang) {
                console.log(`Language changed to: ${lang}`);
                setCurrentLanguage(lang);

                // Ensure settings exist and update language when changed externally
                ensureSettingsAndUpdateLanguage(lang);
            }
        };

        if (i18n?.on) {
            i18n.on('languageChanged', handleLanguageChanged);
            return () => {
                i18n.off('languageChanged', handleLanguageChanged);
            };
        }
    }, [i18n, currentLanguage, settings]);

    // Handle language change from user selection
    const changeLanguage = async (value: string) => {
        if (!i18n || value === currentLanguage) return;

        try {
            const isValidLanguage = languages.some(lang => lang.value === value);

            if (isValidLanguage) {
                // Update local state immediately for UI responsiveness
                console.log(`User changing language to: ${value}`);
                setCurrentLanguage(value);

                // Change language in i18n
                await i18n.changeLanguage(value);

                // Update document language attribute
                document.documentElement.lang = value;

                // Ensure settings exist and update language
                ensureSettingsAndUpdateLanguage(value);
            } else {
                console.error("Invalid language selected:", value);
            }
        } catch (error) {
            console.error("Language change error:", error);
            // Revert to previous language on failure
            setCurrentLanguage(i18n.language);
        }
    };

    return {
        currentLanguage,
        currentLangDisplay,
        languages,
        changeLanguage,
        isReady: ready && !isInitializing
    };
}
