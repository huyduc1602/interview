import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataRequest, fetchDataSuccess } from '@/store/interview/slice';
import { ResponseAnswer, SharedCategory, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { useAuth } from './useAuth';
import { useApiKeys } from './useApiKeys';
import { ApiKeyService } from './useApiKeys';
import { generateId } from '@/utils/supabaseUtils';

interface DataManagementOptions {
    dataType: 'knowledge' | 'interview';
    data: SharedCategory[];
    fetchDataFromSupabase: (userId: string) => Promise<ResponseAnswer[] | null>;
}

export function useDataManagement({ dataType, data, fetchDataFromSupabase }: DataManagementOptions) {
    const { user, isGoogleUser } = useAuth();
    const dispatch = useDispatch();
    const { getApiKey } = useApiKeys();

    const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<SharedCategoryShuffled[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);

    // Track if initial data load has happened
    const dataLoadedRef = useRef(false);
    // Track user ID to detect actual user changes
    const userIdRef = useRef<string | null>(null);

    // Memoize API keys to prevent recreation
    const apiKey = useMemo(() => getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY), [getApiKey]);
    const spreadsheetId = useMemo(() => getApiKey(ApiKeyService.SPREADSHEET_ID), [getApiKey]);
    const sheetName = useMemo(() => {
        if (dataType === 'knowledge') {
            return getApiKey(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE);
        }
        return getApiKey(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS);
    }, [dataType, getApiKey]);

    // Memoize isGoogle check to maintain stable reference
    const isGoogle = useMemo(() => isGoogleUser(), [isGoogleUser]);

    useEffect(() => {
        // Skip if no user
        if (!user) return;

        // Only run if user has changed or this is first load
        if (user.id !== userIdRef.current || !dataLoadedRef.current) {
            userIdRef.current = user.id;
            console.log('useDataManagement.ts - [loadData()]')
            loadData();
        }
    }, [apiKey, dispatch, user]);

    // Update expanded categories when data changes
    useEffect(() => {
        if (!data || data.length === 0) return;

        setExpandedCategories(data.reduce((acc, category, index) => {
            acc[index] = category.items?.length > 0 || category.category?.length > 0;
            return acc;
        }, {} as { [key: number]: boolean }));

        if (isLoading) setIsLoading(false);
    }, [data, isLoading]);

    const loadData = async () => {
        setIsLoading(true);

        try {
            // Always load from Google Sheets first (for all users)
            if (apiKey && spreadsheetId && sheetName) {
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }

            // For Google users, fetch answers from Supabase and merge with data
            if (isGoogle && data?.length > 0) {
                const answers = await fetchDataFromSupabase(user?.id ?? generateId());

                if (answers && answers.length > 0) {
                    // Create a map of question -> answer for quick lookup
                    const answersMap = new Map();
                    answers.forEach(item => {
                        if (item.question && item.answer) {
                            const key = dataType === 'knowledge' ? item.question : item.question;
                            answersMap.set(key, item.answer);
                        }
                    });

                    // Clone and update data with answers
                    const field = dataType === 'knowledge' ? 'knowledge' : 'questions';
                    const contentField = dataType === 'knowledge' ? 'content' : 'question';

                    const updatedData = data.map(category => ({
                        ...category,
                        items: category.items.map((item: any) => {
                            const key = item[contentField];
                            const answer = answersMap.get(key);
                            if (answer) {
                                return { ...item, answer };
                            }
                            return item;
                        })
                    }));

                    // Update Redux store with merged data
                    dispatch(fetchDataSuccess({ [field]: updatedData }));
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
            dataLoadedRef.current = true;
        }
    };

    const toggleCategory = useCallback((categoryIndex: number): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    }, []);

    const filterItems = useCallback((items: SharedItem[] | SharedCategoryShuffled[], query: string): SharedItem[] | SharedCategoryShuffled[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
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

    const handleShuffleQuestions = useCallback((setSelectedItem: (item: any) => void, setAnswer: (answer: string) => void) => {
        // Adapt to both knowledge and interview data structures
        const allItems = data
            .filter(category => selectedCategories.includes(category.category))
            .flatMap(category =>
                category.items.map((item: any) => ({
                    ...item,
                    category: category.category,
                    question: dataType === 'knowledge' ? item.content : item.question
                }))
            );

        const shuffled = [...allItems]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({
                ...item,
                id: item.id ?? generateId(),
                orderNumber: index + 1
            }));

        setShuffledQuestions(shuffled);
        setSelectedItem(null);
        setAnswer("");
    }, [data, selectedCategories]);

    const handleApiKeySubmit = useCallback(async (apiKey: string, spreadsheetId: string) => {
        if (!user) return;

        setIsLoading(true);
        await dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
        setIsLoading(false);
    }, [dispatch, user]);

    return {
        expandedCategories,
        isLoading,
        selectedCategories,
        shuffledQuestions,
        searchQuery,
        isTagsExpanded,
        isGoogle,
        apiKey,
        spreadsheetId,
        sheetName,
        setSearchQuery,
        setIsTagsExpanded,
        toggleCategory,
        filterItems,
        handleCategorySelect,
        handleShuffleQuestions,
        handleApiKeySubmit,
        loadData
    };
}