import { useState, useCallback } from 'react';

interface KnowledgeCategory {
    category: string[];
}

interface UseCategoryManagerReturn {
    expandedCategories: Record<number, boolean>;
    selectedCategories: string[];
    isTagsExpanded: boolean;
    setIsTagsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    toggleCategory: (categoryIndex: number) => void;
    handleCategorySelect: (category: string) => void;
    initializeExpandedCategories: () => void;
}

export function useCategoryManager(knowledge: KnowledgeCategory[]): UseCategoryManagerReturn {
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState<boolean>(false);

    const toggleCategory = useCallback((categoryIndex: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    }, []);

    const handleCategorySelect = useCallback((category: string) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(category);
            if (isSelected) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    }, []);

    // Initialize expanded categories when knowledge changes
    const initializeExpandedCategories = useCallback(() => {
        if (!knowledge || knowledge.length === 0) return;

        setExpandedCategories(knowledge.reduce((acc, kCategory, index) => {
            acc[index] = kCategory.category.length > 0;
            return acc;
        }, {} as Record<number, boolean>));
    }, [knowledge]);

    return {
        expandedCategories,
        selectedCategories,
        isTagsExpanded,
        setIsTagsExpanded,
        toggleCategory,
        handleCategorySelect,
        initializeExpandedCategories
    };
}