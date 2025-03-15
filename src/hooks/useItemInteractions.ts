import { useState, useCallback } from 'react';
import { SavedItem, SharedCategoryShuffled, SharedItem, PromptType, PromptOptions } from '@/types/common';
import { useAIResponse } from './useAIResponse';
import { createPromptByType } from '@/utils/promptUtils';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';

interface ItemInteractionsOptions {
    type: 'knowledge' | 'interview';
    generateAnswer: (question: string) => Promise<string>;
    savedItems: SavedItem[];
}

/**
 * Custom hook to manage interactions with items, including generating and saving answers.
 *
 * @param {Object} options - Configuration options for the hook.
 * @param {'knowledge' | 'interview'} options.type - The type of items being interacted with.
 * @param {Function} options.generateAnswer - Function to generate an answer for a given question.
 * @param {SavedItem[]} options.savedItems - List of saved items to check for existing answers.
 *
 * @returns {Object} - An object containing state and handlers for item interactions.
 * @returns {SharedItem | null} return.selectedItem - The currently selected item.
 * @returns {Function} return.setSelectedItem - Setter for the selected item.
 * @returns {boolean} return.isSavedAnswer - Indicates if the selected item has a saved answer.
 * @returns {Function} return.setIsSavedAnswer - Setter for the saved answer status.
 * @returns {SavedItem | null} return.existingSavedItem - The saved item if it exists.
 * @returns {Function} return.setExistingSavedItem - Setter for the existing saved item.
 * @returns {Function} return.handleItemClick - Handler for selecting an item.
 * @returns {Function} return.handleRegenerateAnswer - Handler for regenerating an answer.
 * @returns {unknown} return.error - Error state from generating answers.
 */

export function useItemInteractions({
    type,
    generateAnswer,
    savedItems
}: ItemInteractionsOptions) {
    // Get settings from useSettings hook
    const { settings } = useSettings();
    const { t } = useTranslation();

    // State declarations
    const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
    const [isSavedAnswer, setIsSavedAnswer] = useState(false);
    const [existingSavedItem, setExistingSavedItem] = useState<SavedItem | null>(null);

    // Get user language from settings with fallback to Vietnamese
    const getUserLanguage = useCallback(() => {
        // Priority order:
        // 1. settings.appPreferences.language (regular structure)
        // 2. settings.language (simple structure)
        // 3. Default to 'vi' if not found
        return (settings?.appPreferences?.language || settings?.language || 'vi') as 'vi' | 'en';
    }, [settings]);

    // Function to create prompt options based on item data
    const createPromptOptions = useCallback((item: SharedItem | any): PromptOptions => {
        const language = getUserLanguage();
        const defaultRole = t('prompts.defaults.role');

        return {
            language,
            topic: item.category || item.topic,
            level: (item.level === 'beginner' || item.level === 'intermediate' || item.level === 'advanced')
                ? item.level
                : 'intermediate',
            role: type === 'interview' ? (item.role || defaultRole) : undefined,
            includeCodeExamples: true
        };
    }, [getUserLanguage, type, t]);

    // Success handler for AI response
    const handleSuccess = useCallback((content: string) => {
        if (selectedItem) {
            setSelectedItem(prev => prev ? ({ ...prev, answer: content }) : null);
        }
    }, [selectedItem]);

    // Error handler for AI response
    const handleError = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const {
        handleGenerateAnswer,
        error
    } = useAIResponse({
        generateAnswer,
        onSuccess: handleSuccess,
        onError: handleError
    });

    // Function to fetch item data
    const fetchItemData = useCallback(async (item: any, existingSaved: SavedItem | null) => {
        if (existingSaved?.answer) {
            console.info('Using saved answer from previous session');
            setIsSavedAnswer(true);
            setSelectedItem(prev => prev ? { ...prev, answer: existingSaved.answer } : null);
        } else {
            setIsSavedAnswer(false);
            try {
                console.info('Generating new answer');
                const questionContent = item.question;
                const promptType = type === 'knowledge' ? PromptType.KNOWLEDGE : PromptType.INTERVIEW;
                const promptOptions = createPromptOptions(item);

                console.log(`Using language: ${promptOptions.language} from user settings`);

                const enhancedPrompt = createPromptByType(questionContent, promptType, promptOptions);
                const answer = await handleGenerateAnswer(enhancedPrompt);
                setSelectedItem(prev => prev ? { ...prev, answer } : null);
            } catch (error) {
                console.error('Failed to generate answer:', error);
                setSelectedItem(null);
            }
        }
    }, [handleGenerateAnswer, type, createPromptOptions]);

    // Handle item click
    const handleItemClick = useCallback(async (item: SharedItem | SharedCategoryShuffled | any) => {
        const actualItem = item as any;
        setSelectedItem(actualItem);
        const questionContent = actualItem.question;
        const existingSaved = savedItems.find(savedItem =>
            savedItem.question === questionContent
        );
        setExistingSavedItem(existingSaved || null);
        if (existingSaved && existingSaved.id === selectedItem?.id) {
            setIsSavedAnswer(true);
        }
        await fetchItemData(actualItem, existingSaved || null);
    }, [savedItems, fetchItemData, selectedItem?.id]);

    // Handle regenerate answer
    const handleRegenerateAnswer = useCallback(async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const questionContent = selectedItem.question;
            const promptType = type === 'knowledge' ? PromptType.KNOWLEDGE : PromptType.INTERVIEW;
            const promptOptions = createPromptOptions(selectedItem);

            const enhancedPrompt = createPromptByType(questionContent, promptType, promptOptions);
            const answer = await generateAnswer(enhancedPrompt);
            setSelectedItem(prev => prev ? ({ ...prev, answer }) : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    }, [selectedItem, generateAnswer, type, createPromptOptions]);

    return {
        selectedItem,
        setSelectedItem,
        isSavedAnswer,
        setIsSavedAnswer,
        existingSavedItem,
        setExistingSavedItem,
        handleItemClick,
        handleRegenerateAnswer,
        error
    };
}