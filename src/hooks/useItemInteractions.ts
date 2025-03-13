import { useState, useCallback } from 'react';
import { SavedItem, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { useAIResponse } from './useAIResponse';
import { generateId } from '@/utils/supabaseUtils';

interface ItemInteractionsOptions {
    type: 'knowledge' | 'interview';
    generateAnswer: (question: string) => Promise<string>;
    savedItems: SavedItem[];
    contentField: string; // 'content' for knowledge, 'question' for interview
}

export function useItemInteractions({
    type,
    generateAnswer,
    savedItems
}: ItemInteractionsOptions) {
    const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
    const [isSavedAnswer, setIsSavedAnswer] = useState(false);
    const [existingSavedItem, setExistingSavedItem] = useState<SavedItem | null>(null);

    // Memoize onSuccess callback
    const handleSuccess = useCallback((content: string) => {
        if (selectedItem) {
            setSelectedItem(prev => prev ? ({ ...prev, answer: content }) : null);
        }
    }, [selectedItem]);

    // Memoize onError callback
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

    // Convert item to shared format
    const convertToSharedItem = useCallback((item: any | null): SharedItem => {
        if (!item) return {
            id: '',
            question: '',
            category: '',
            answer: ''
        };

        return {
            id: item.id ?? generateId(),
            question: type === 'knowledge' ? item.content : item.question,
            category: item.category || '',
            answer: item.answer || ''
        };
    }, [type]);

    // Fetch data from saved items or generate new answer
    const fetchItemData = useCallback(async (item: any, existingSaved: SavedItem | null) => {
        if (existingSaved?.answer) {
            console.info('Using saved answer from previous session');
            setIsSavedAnswer(true);
            // Use existing answer from savedItems
            setSelectedItem(prev => prev ? { ...prev, answer: existingSaved.answer } : null);
        } else {
            setIsSavedAnswer(false);
            try {
                console.info('Generating new answer');
                // No saved answer found, generate a new one
                const questionContent = type === 'knowledge' ? item.content : item.question;
                const answer = await handleGenerateAnswer(questionContent);
                setSelectedItem(prev => prev ? { ...prev, answer } : null);
            } catch (error) {
                console.error('Failed to generate answer:', error);
                setSelectedItem(null);
            }
        }
    }, [handleGenerateAnswer, type]);

    // Handle item click
    const handleItemClick = useCallback(async (item: SharedItem | SharedCategoryShuffled | any) => {
        // Cast to proper type based on data source
        const actualItem = item as any;

        // First set the selected item (to display immediately even without an answer)
        setSelectedItem(actualItem);

        // Check if this item already has an answer in savedItems
        const questionField = type === 'knowledge' ? 'content' : 'question';
        const questionContent = actualItem[questionField];

        const existingSaved = savedItems.find(savedItem =>
            savedItem.question === questionContent
        );

        // Update state for use in other components
        setExistingSavedItem(existingSaved || null);

        // Handle special case where the item is already selected
        if (existingSaved && existingSaved.id === selectedItem?.id) {
            setIsSavedAnswer(true);
        }

        // Now fetch data with the found saved item
        await fetchItemData(actualItem, existingSaved || null);

    }, [savedItems, fetchItemData, selectedItem?.id, type]);

    const handleRegenerateAnswer = useCallback(async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const questionSend = selectedItem.question
            const answer = await generateAnswer(questionSend);
            setSelectedItem(prev => prev ? ({ ...prev, answer }) : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    }, [selectedItem, generateAnswer, type]);

    return {
        selectedItem,
        setSelectedItem,
        isSavedAnswer,
        setIsSavedAnswer,
        existingSavedItem,
        setExistingSavedItem,
        convertToSharedItem,
        handleItemClick,
        handleRegenerateAnswer,
        error
    };
}