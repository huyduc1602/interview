import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest, fetchDataSuccess } from '@/store/interview/slice';
import type { RootState } from '@/store/types';
import { useAuth } from '@/hooks/useAuth';
import { fetchInterviewQuestionDataFromSupabase } from '@/utils/supabaseUtils';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout } from '@/layouts';
import { useSavedItems } from '@/hooks/useSavedItems';
import SettingsButton from '@/components/ui/SettingsButton';
import { InterviewQuestion, ExpandedCategories } from '@/types/interview';
import { ApiKeyService, useApiKeys } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ItemTypeSaved, SavedItem, SharedCategoryShuffled, SharedItem } from "@/types/common";
import { saveDataSupabase } from '@/utils/supabaseStorage';
import type { KnowledgeItem } from '@/types/knowledge';
import InterviewSidebar from '@/components/interview/InterviewSidebar';
import InterviewContent from '@/components/interview/InterviewContent';
import { generateId } from '@/utils/supabaseUtils';
import { AIModel } from "@/services/aiServices";

export default function InterviewQuestions() {
    // Track renders for debugging
    const renderCountRef = useRef(0);
    renderCountRef.current++;

    const { user, isGoogleUser } = useAuth();
    const dispatch = useDispatch();
    const { questions } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<InterviewQuestion | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<SharedCategoryShuffled[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems(ItemTypeSaved.InterviewAnswers);
    const { getApiKey } = useApiKeys();
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
    } = useChat({ type: 'interview' }, user);

    // Memoize API keys to prevent recreation
    const apiKey = useMemo(() => getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY), [getApiKey]);
    const spreadsheetId = useMemo(() => getApiKey(ApiKeyService.SPREADSHEET_ID), [getApiKey]);
    const sheetName = useMemo(() => getApiKey(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS), [getApiKey]);

    // Memoize isGoogle check to maintain stable reference
    const isGoogle = useMemo(() => isGoogleUser(), [isGoogleUser]);

    // Memoize onSuccess callback
    const handleSuccess = useCallback((content: string) => {
        if (selectedItem) {
            setSelectedItem(prev => prev ? ({ ...prev, answer: content }) : null);
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

    // Update expanded categories when questions changes
    useEffect(() => {
        if (!questions || questions.length === 0) return;

        setExpandedCategories(questions.reduce((acc, category, index) => {
            acc[index] = category.items.length > 0;
            return acc;
        }, {} as ExpandedCategories));

        if (isLoading) setIsLoading(false);
    }, [questions, isLoading]);

    const loadData = async () => {
        setIsLoading(true);

        try {
            // Always load from Google Sheets first (for all users)
            if (apiKey && spreadsheetId && sheetName) {
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }

            // For Google users, fetch answers from Supabase and merge with question data
            if (isGoogle) {
                const answers = await fetchInterviewQuestionDataFromSupabase(user?.id ?? generateId());

                if (answers && answers.length > 0 && questions && questions.length > 0) {
                    // Create a map of question -> answer for quick lookup
                    const answersMap = new Map();
                    answers.forEach(item => {
                        if (item.question && item.answer) {
                            answersMap.set(item.question, item.answer);
                        }
                    });

                    // Clone and update question data with answers
                    const updatedQuestions = questions.map(category => ({
                        ...category,
                        items: category.items.map(item => {
                            const answer = answersMap.get(item.question);
                            if (answer) {
                                return { ...item, answer };
                            }
                            return item;
                        })
                    }));

                    // Update Redux store with merged data
                    dispatch(fetchDataSuccess({ questions: updatedQuestions }));
                }
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

    const toggleCategory = useCallback((categoryIndex: number) => {
        setExpandedCategories(prev => {
            const newExpandedCategories: ExpandedCategories = {};
            Object.keys(prev).forEach(key => {
                newExpandedCategories[parseInt(key)] = false;
            });
            newExpandedCategories[categoryIndex] = !prev[categoryIndex];
            return newExpandedCategories;
        });
    }, []);

    const filterQuestions = useCallback((items: SharedItem[] | SharedCategoryShuffled[], query: string): SharedItem[] | SharedCategoryShuffled[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
    }, []);

    // Convert fetchData to a useCallback that takes an interviewQuestion and potentially existing saved item
    const fetchData = useCallback(async (interviewQuestion: InterviewQuestion, existingSaved: SavedItem | null) => {
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
                const answer = await handleGenerateAnswer(interviewQuestion.question);
                setSelectedItem(prev => prev ? { ...prev, answer } : null);
            } catch (error) {
                console.error('Failed to generate answer:', error);
                setSelectedItem(null);
            }
        }
    }, [handleGenerateAnswer]);

    const handleItemClick = useCallback(async (item: SharedItem | SharedCategoryShuffled | KnowledgeItem) => {
        const questionItem = item as InterviewQuestion;

        // First set the selected item (to display immediately even without an answer)
        setSelectedItem(questionItem);

        // Check if this item already has an answer in savedItems
        const existingSaved = savedItems.find(savedItem =>
            savedItem.question === questionItem.question
        );

        // Update state for use in other components
        setExistingSavedItem(existingSaved || null);
        if (existingSaved && existingSaved.id == selectedItem?.id) {
            setIsSavedAnswer(true);
        }

        // Now fetch data with the found saved item
        await fetchData(questionItem, existingSaved || null);

    }, [savedItems, fetchData]);

    const handleRegenerateAnswer = useCallback(async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const answer = await generateAnswer(selectedItem.question);
            setSelectedItem(prev => prev ? ({ ...prev, answer }) : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    }, [selectedItem, generateAnswer]);

    const handleShuffleQuestions = useCallback(() => {
        const allQuestions = questions
            .filter(category => selectedCategories.includes(category.category))
            .flatMap(category =>
                category.items.map((item: unknown) => ({
                    ...(item as InterviewQuestion),
                    category: category.category
                }))
            );

        const shuffled = [...allQuestions]
            .sort(() => Math.random() - 0.5)
            .map((question, index) => ({
                ...question,
                id: question.id ?? generateId(),
                question: question.question,
                orderNumber: index + 1
            }));

        setShuffledQuestions(shuffled);
        setSelectedItem(null);
        setAnswer("");
    }, [questions, selectedCategories, setAnswer]);

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

    // Convert InterviewQuestion to SharedItem
    const sharedQuestion: SharedItem | null = selectedItem ? {
        id: selectedItem.id,
        question: selectedItem.question,
        category: selectedItem.category,
        answer: selectedItem.answer || null
    } as SharedItem : null;

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <InterviewSidebar
                            questions={questions}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={sharedQuestion}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterQuestions}
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
                        <InterviewContent
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
                            setIsSavedAnswer={setIsSavedAnswer}
                            existingSavedItem={existingSavedItem}
                            typeSavedItem={ItemTypeSaved.InterviewAnswers}
                        />
                    }
                />
                <SettingsButton onSubmit={handleApiKeySubmit} sheetName={ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}