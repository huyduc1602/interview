import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDataRequest } from '@/store/interview/slice';
import { ResponseAnswer, SharedCategory, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { useAuth } from './useAuth';
import { generateId } from '@/utils/supabaseUtils';
import { ApiKeyService, useApiKeys } from './useApiKeys';

interface DataManagementOptions {
    dataType: 'knowledge' | 'interview';
    data: SharedCategory[];
    fetchDataFromSupabase: (userId: string) => Promise<ResponseAnswer[] | null>;
}

export function useDataManagement({ dataType, data, fetchDataFromSupabase }: DataManagementOptions) {
    const { user, isGoogleUser } = useAuth();
    const dispatch = useDispatch();
    const { getApiKeyByService } = useApiKeys();

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
    // Track page reloads
    const pageLoadIdRef = useRef<string | null>(null);

    // Use a ref to track loading operations
    const loadingOperationsRef = useRef(0);

    const setLoading = useCallback((isLoading: boolean) => {

        if (isLoading) {
            // Increment counter when starting a loading operation
            loadingOperationsRef.current += 1;
            setIsLoading(true);
        } else {
            // Decrement counter when a loading operation completes
            loadingOperationsRef.current = Math.max(0, loadingOperationsRef.current - 1);

            // Only set loading to false when all operations complete
            if (loadingOperationsRef.current === 0) {
                setIsLoading(false);
            }
        }
    }, []);

    // Memoize API keys to prevent recreation
    const apiKey = useMemo(() => getApiKeyByService(ApiKeyService.GOOGLE_SHEET_API_KEY), [getApiKeyByService]);
    const spreadsheetId = useMemo(() => getApiKeyByService(ApiKeyService.SPREADSHEET_ID), [getApiKeyByService]);
    const sheetName = useMemo(() => {
        if (dataType === 'knowledge') {
            return getApiKeyByService(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE);
        }
        return getApiKeyByService(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS);
    }, [dataType, getApiKeyByService]);

    // Memoize isGoogle check to maintain stable reference
    const isGoogle = useMemo(() => isGoogleUser(), [isGoogleUser]);

    // Setup page reload detection 
    useEffect(() => {
        // Generate a unique ID for this page load/session
        const currentLoadId = `page_load_${Date.now()}`;

        // Check if this is a new page load
        const isNewPageLoad = pageLoadIdRef.current !== currentLoadId;

        // Store the current page load ID
        pageLoadIdRef.current = currentLoadId;

        // Persist to sessionStorage to detect page reloads
        const previousLoadId = sessionStorage.getItem('page_load_id');
        sessionStorage.setItem('page_load_id', currentLoadId);

        // If user exists and this is a new page load, force data reload
        if (user && (isNewPageLoad || previousLoadId !== currentLoadId)) {
            console.log('Page reload detected, forcing data reload');
            dataLoadedRef.current = false; // Reset data loaded flag to force reload
        }
    }, [user]); // Only re-run when user changes

    // Main effect for loading data
    useEffect(() => {
        // Skip if no user
        if (!user) return;

        // Load data if:
        // 1. User has changed, OR
        // 2. First load, OR
        // 3. Data not yet loaded
        if (user.id !== userIdRef.current || !dataLoadedRef.current) {
            userIdRef.current = user.id;
            loadData();
        }
    }, [apiKey, dispatch, user, data?.length]); // Added data?.length to dependencies

    // Update expanded categories when data changes
    useEffect(() => {
        if (!data || data.length === 0) return;

        setExpandedCategories(data.reduce((acc, category, index) => {
            acc[index] = category.items?.length > 0 || category.category?.length > 0;
            return acc;
        }, {} as { [key: number]: boolean }));
    }, [data]);

    const loadData = async () => {
        // Reset any stuck loading operations
        if (loadingOperationsRef.current > 0) {
            console.warn(`Resetting ${loadingOperationsRef.current} stuck loading operations`);
            loadingOperationsRef.current = 0;
        }

        // Start fresh
        setLoading(true); // Operation #1
        console.log(`Loading ${dataType} data...`);

        try {
            // Create a tracking ID for this specific operation
            const operationId = Date.now().toString();
            console.log(`Started operation #${operationId}`);

            // First loading operation: Redux data fetch
            if (apiKey && spreadsheetId && sheetName) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        const timeoutId = setTimeout(() => {
                            reject(new Error("Redux operation timed out after 10 seconds"));
                        }, 10000); // 10 second timeout

                        dispatch(fetchDataRequest({
                            apiKey,
                            spreadsheetId,
                            user,
                            onComplete: () => {
                                clearTimeout(timeoutId);
                                resolve();
                            }
                        }));
                    });
                } catch (reduxError) {
                    console.error(`Redux operation #${operationId} failed:`, reduxError);
                    throw reduxError; // Rethrow to be caught by outer try/catch
                }
            }

            // Second loading operation: Supabase (only if needed)
            if (isGoogle && data?.length > 0) {
                try {
                    await fetchDataFromSupabase(user?.id ?? generateId());
                    // Process answers...
                    console.log(`Completed Supabase operation #${operationId}`);
                } catch (supabaseError) {
                    console.error(`Supabase operation #${operationId} failed:`, supabaseError);
                    // We don't rethrow here since this is optional data
                }
            }

            console.log(`${dataType} data loaded successfully for operation #${operationId}`);
        } catch (error) {
            console.error(`Error loading ${dataType} data:`, error);
        } finally {
            dataLoadedRef.current = true;
            setLoading(false); // Decrement operation #1

            // Add safety check to fix any imbalance
            setTimeout(() => {
                if (loadingOperationsRef.current > 0) {
                    console.warn(`Detected ${loadingOperationsRef.current} stuck operations after loadData, resetting`);
                    loadingOperationsRef.current = 0;
                    setIsLoading(false);
                }
            }, 100);
        }
    };

    // Force reload data function that can be called from outside
    const forceReloadData = useCallback(() => {
        dataLoadedRef.current = false;
        loadData();
    }, []);

    const toggleCategory = useCallback((categoryIndex: number): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    }, []);

    const filterItems = useCallback(
        (
            items: SharedItem[] | SharedCategoryShuffled[],
            query: string,
            categories?: string[]
        ): SharedItem[] | SharedCategoryShuffled[] => {
            let filteredItems = items;

            // First filter by search query if provided
            if (query) {
                filteredItems = items.filter(item => {
                    return item.question?.toLowerCase().includes(query.toLowerCase());
                });
            }

            // Then filter by categories if provided and not empty
            if (categories && categories.length > 0) {
                filteredItems = filteredItems.filter(item =>
                    categories.includes(item.category)
                );
            }

            return filteredItems;
        },
        [dataType] // Add dataType as a dependency
    );

    const handleCategorySelect = useCallback((category: string) => {
        // Toggle the category selection
        setSelectedCategories(prev => {
            const isSelected = prev.includes(category);
            if (isSelected) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });

        // Auto-expand the selected category
        if (data) {
            const categoryIndex = data.findIndex(cat => cat.category === category);
            if (categoryIndex !== -1) {
                setExpandedCategories(prev => ({
                    ...prev,
                    [categoryIndex]: true // Expand the category
                }));
            }
        }
    }, [data]);

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

        // Use the consistent loading tracking system
        setLoading(true);

        try {
            // Create a promise that resolves when the dispatch completes
            await new Promise<void>((resolve) => {
                dispatch(fetchDataRequest({
                    apiKey,
                    spreadsheetId,
                    user,
                    onComplete: resolve
                }));
            });
        } finally {
            // Use the consistent loading tracking system
            setLoading(false);
        }
    }, [dispatch, user, setLoading]);

    const resetLoadingState = useCallback(() => {
        console.log("Resetting loading state - was stuck at:", loadingOperationsRef.current);
        loadingOperationsRef.current = 0;
        setIsLoading(false);
    }, []);

    return {
        expandedCategories,
        isLoading,
        selectedCategories,
        shuffledQuestions,
        setShuffledQuestions,
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
        loadData,
        forceReloadData, // Expose method to force data reload
        resetLoadingState,
        loadingOperationsCount: loadingOperationsRef.current,
    };
}