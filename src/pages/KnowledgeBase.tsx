import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest, fetchDataSuccess } from '@/store/interview/slice';
import type { RootState } from '@/store/types';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout } from '@/layouts';
import { useAuth } from '@/hooks/useAuth';
import { useSavedItems } from '@/hooks/useSavedItems';
import SettingsButton from '@/components/ui/SettingsButton';
import type { KnowledgeItem, ChatHistory, ExpandedCategories } from '@/types/knowledge';
import { ApiKeyService, useApiKeys } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";
import { ItemTypeSaved, SavedItem, SharedCategoryShuffled, SharedItem } from "@/types/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import { saveData } from '@/utils/supabaseStorage';
import { fetchKnowledgeDataFromSupabase, generateId } from '@/utils/supabaseUtils';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar';
import KnowledgeContent from '@/components/knowledge/KnowledgeContent';
import { AIModel } from "@/services/aiServices";

export default function KnowledgeBase() {
    // Track renders for debugging
    const renderCountRef = useRef(0);
    renderCountRef.current++;

    const { user, isGoogleUser } = useAuth();
    const dispatch = useDispatch();
    const { knowledge } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistory>({});
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems(ItemTypeSaved.KnowledgeAnswers);
    const { getApiKey } = useApiKeys();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<SharedCategoryShuffled[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavedAnswer, setIsSavedAnswer] = useState(false);
    const [existingSavedItem, setExistingSavedItem] = useState<SavedItem | null>(null);

    // Track if initial data load has happened
    const dataLoadedRef = useRef(false);
    // Track user ID to detect actual user changes
    const userIdRef = useRef<string | null>(null);

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer,
        setAnswer
    } = useChat({ type: 'knowledge' }, user);

    // Memoize API keys to prevent recreation
    const apiKey = useMemo(() => getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY), [getApiKey]);
    const spreadsheetId = useMemo(() => getApiKey(ApiKeyService.SPREADSHEET_ID), [getApiKey]);
    const sheetName = useMemo(() => getApiKey(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE), [getApiKey]);

    // Memoize isGoogle check to maintain stable reference
    const isGoogle = useMemo(() => isGoogleUser(), [isGoogleUser]);

    // Memoize onSuccess callback
    const handleSuccess = useCallback((content: string) => {
        if (selectedItem) {
            setSelectedItem(prev => prev ? ({ ...prev, answer: content }) : null);
            if (user) {
                saveData(ItemTypeSaved.KnowledgeAnswers, {
                    user_id: user.id,
                    question: selectedItem.content,
                    answer: content,
                    category: selectedItem.category,
                    id: generateId(),
                    created_at: new Date().toISOString(),
                    model: selectedItem.model ?? AIModel.GPT35_0125
                });
            }
        }
    }, [selectedItem, user]);

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

    // CONSOLIDATED DATA LOADING EFFECT
    useEffect(() => {
        // Skip if no user
        if (!user) return;

        // Only run if user has changed or this is first load
        if (user.id !== userIdRef.current || !dataLoadedRef.current) {
            userIdRef.current = user.id;
            loadData();
        }
    }, [apiKey, dispatch, user]);

    // Update expanded categories when knowledge changes
    useEffect(() => {
        if (!knowledge || knowledge.length === 0) return;

        setExpandedCategories(knowledge.reduce((acc, kCategory, index) => {
            acc[index] = kCategory.category.length > 0;
            return acc;
        }, {} as ExpandedCategories));

        if (isLoading) setIsLoading(false);
    }, [knowledge, isLoading]);

    // Save chat history to localStorage when it changes
    useEffect(() => {
        if (!user || Object.keys(chatHistory).length === 0) return;

        localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(chatHistory));
    }, [chatHistory, user]);


    const loadData = async () => {
        setIsLoading(true);

        try {
            // Always load from Google Sheets first (for all users)
            if (apiKey && spreadsheetId && sheetName) {
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }

            // For Google users, fetch answers from Supabase and merge with knowledge data
            if (isGoogle) {
                const answers = await fetchKnowledgeDataFromSupabase(user?.id ?? generateId());

                if (answers && answers.length > 0 && knowledge && knowledge.length > 0) {

                    // Create a map of question -> answer for quick lookup
                    const answersMap = new Map();
                    answers.forEach(item => {
                        if (item.question && item.answer) {
                            answersMap.set(item.question, item.answer);
                        }
                    });

                    // Clone and update knowledge data with answers
                    const updatedKnowledge = knowledge.map(category => ({
                        ...category,
                        items: category.items.map(item => {
                            const answer = answersMap.get(item.answer);
                            if (answer) {
                                return { ...item, answer };
                            }
                            return item;
                        })
                    }));

                    // Update Redux store with merged data
                    dispatch(fetchDataSuccess({ knowledge: updatedKnowledge }));
                }
            }

            // Load chat history from localStorage
            const savedHistory = localStorage.getItem(`chat_history_${user?.id}`);
            if (savedHistory) {
                setChatHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
            dataLoadedRef.current = true;
        }
    };

    const handleApiKeySubmit = useCallback(async (apiKey: string, spreadsheetId: string) => {
        if (!user) return;

        setIsLoading(true);
        await dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
        setIsLoading(false);
    }, [dispatch, user]);

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

    const convertToSharedItem = useCallback((item: KnowledgeItem | null): SharedItem => {
        return {
            question: item?.content || '',
            category: item?.category || '',
            answer: item?.answer || ''
        };
    }, []);

    // Convert fetchData to a useCallback that takes a knowledgeItem and potentially existing saved item
    const fetchData = useCallback(async (knowledgeItem: KnowledgeItem, existingSaved: SavedItem | null) => {
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
                const answer = await handleGenerateAnswer(knowledgeItem.content);
                setSelectedItem(prev => prev ? { ...prev, answer } : null);
            } catch (error) {
                console.error('Failed to generate answer:', error);
                setSelectedItem(null);
            }
        }
    }, [handleGenerateAnswer]);

    const handleItemClick = useCallback(async (item: SharedItem | SharedCategoryShuffled | KnowledgeItem) => {
        const knowledgeItem = item as KnowledgeItem;

        // First set the selected item (to display immediately even without an answer)
        setSelectedItem(knowledgeItem);

        // Check if this item already has an answer in savedItems
        const existingSaved = savedItems.find(savedItem =>
            savedItem.question === knowledgeItem.content
        );

        // Update state for use in other components
        setExistingSavedItem(existingSaved || null);

        // Now fetch data with the found saved item
        await fetchData(knowledgeItem, existingSaved || null);

    }, [savedItems, fetchData]);

    const handleRegenerateAnswer = useCallback(async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const answer = await generateAnswer(selectedItem.content);
            setSelectedItem(prev => prev ? ({ ...prev, answer }) : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    }, [selectedItem, generateAnswer]);

    const handleShuffleQuestions = useCallback(() => {
        const allQuestions = knowledge
            .filter(kCategory => selectedCategories.includes(kCategory.category))
            .flatMap(kCategory =>
                kCategory.items.map((item: unknown) => ({
                    ...(item as SharedItem),
                    category: kCategory.category
                }))
            );

        const shuffled = [...allQuestions]
            .sort(() => Math.random() - 0.5)
            .map((knowledgeItem, index) => ({
                ...knowledgeItem,
                question: knowledgeItem.question,
                orderNumber: index + 1
            }));
        setShuffledQuestions(shuffled);
        setSelectedItem(null);
        setAnswer("");
    }, [knowledge, selectedCategories, setAnswer]);

    const handleCategorySelect = useCallback((category: string) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(category);
            if (isSelected) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    }, []);

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    // Create the shared item for the content component
    const sharedQuestion = selectedItem ? convertToSharedItem(selectedItem) : null;

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <KnowledgeSidebar
                            knowledge={knowledge}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={sharedQuestion}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterItems}
                            setSearchQuery={setSearchQuery}
                            shuffleQuestions={handleShuffleQuestions}
                            shuffledQuestions={shuffledQuestions}
                            selectedCategories={selectedCategories}
                            handleCategorySelect={handleCategorySelect}
                            isTagsExpanded={isTagsExpanded}
                            setIsTagsExpanded={setIsTagsExpanded}
                            isLoading={isLoading}
                        />
                    }
                    content={
                        <KnowledgeContent
                            selectedQuestion={sharedQuestion}
                            user={user}
                            saveItem={saveItem}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                            handleRegenerateAnswer={handleRegenerateAnswer}
                            loading={loading}
                            error={error}
                            savedItems={savedItems}
                            addFollowUpQuestion={addFollowUpQuestion}
                            generateAnswer={generateAnswer}
                            setAnswer={setAnswer}
                            isSavedAnswer={isSavedAnswer}
                            existingSavedItem={existingSavedItem}
                            typeSavedItem={ItemTypeSaved.KnowledgeAnswers}
                        />
                    }
                />
                <SettingsButton onSubmit={handleApiKeySubmit} sheetName={ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}