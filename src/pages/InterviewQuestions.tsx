import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCachedAnswers, fetchDataRequest, fetchDataSuccess } from '@/store/interview/slice';
import type { RootState } from '@/store/types';
import { useAuth } from '@/hooks/useAuth';
import { fetchInterviewQuestionDataFromSupabase } from '@/utils/supabaseUtils';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout } from '@/layouts';
import { useTranslation } from 'react-i18next';
import { useSavedItems } from '@/hooks/useSavedItems';
import SettingsButton from '@/components/ui/SettingsButton';
import type { InterviewQuestion, ExpandedCategories } from '@/types/interview';
import type { SharedCategoryShuffled, SharedItem } from '@/types/common';
import { ApiKeyService, useApiKeys } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";
import SharedSidebar from '@/components/share/SharedSidebar';
import SharedContent from '@/components/share/SharedContent';
import { ModelSelector } from "@/components/ui/model-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronUp, Tag, X } from "lucide-react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { saveData } from '@/utils/supabaseStorage'; // Import saveData function
import type { KnowledgeItem } from '@/types/knowledge';
import { ItemTypeSaved } from '../types/common';

export default function InterviewQuestions() {
    const { user, isGoogleUser } = useAuth();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { questions } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<SharedItem | SharedCategoryShuffled | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<SharedCategoryShuffled[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems(ItemTypeSaved.InterviewAnswers);
    const { getApiKey } = useApiKeys();
    const fetchedRef = useRef(false);
    const prevApiKeyRef = useRef('');
    const prevSpreadsheetIdRef = useRef('');
    const prevSheetNameRef = useRef<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer,
        setAnswer
    } = useChat({ type: 'interview' }, user);

    const {
        handleGenerateAnswer,
        error
    } = useAIResponse({
        generateAnswer,
        onSuccess: (content) => {
            if (selectedItem) {
                setSelectedItem({ ...selectedItem, answer: content });
                saveData(ItemTypeSaved.InterviewAnswers, { user_id: user?.id, question: selectedItem.question, answer: content });
            }
        },
        onError: () => {
            setSelectedItem(null);
        }
    });

    useEffect(() => {
        const fetchKnowledgeData = async () => {
            if (user && isGoogleUser()) {
                const data = await fetchInterviewQuestionDataFromSupabase(user.id);
                if (data) {
                    // Assuming the knowledge data structure matches the expected format
                    dispatch(fetchDataSuccess({ questions: data }));
                }
            } else {
                fetchNonGoogleUserData();
            }
        };

        fetchKnowledgeData();
    }, [user, isGoogleUser, dispatch]);

    // Function to fetch data for non-Google users
    const fetchNonGoogleUserData = async () => {
        const apiKey = getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY);
        const spreadsheetId = getApiKey(ApiKeyService.SPREADSHEET_ID);
        const sheetName = getApiKey(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS);

        // Only fetch if we haven't fetched yet or if keys have changed
        if (
            !fetchedRef.current ||
            apiKey !== prevApiKeyRef.current ||
            spreadsheetId !== prevSpreadsheetIdRef.current ||
            sheetName !== prevSheetNameRef.current
        ) {
            // Save current values for comparison on next render
            prevApiKeyRef.current = apiKey;
            prevSpreadsheetIdRef.current = spreadsheetId;
            prevSheetNameRef.current = sheetName;
            fetchedRef.current = true;

            if (apiKey && spreadsheetId && sheetName) {
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }
        }
    };

    useEffect(() => {
        if (!questions || questions.length === 0) {
            setIsLoading(true);
            return;
        } else setIsLoading(false);
        setExpandedCategories(questions.reduce((acc, category, index) => {
            acc[index] = category.items.length > 0;
            return acc;
        }, {} as ExpandedCategories));
    }, [questions]);

    useEffect(() => {
        // Skip if no user
        if (!user) return;

        const apiKey = getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY);
        const spreadsheetId = getApiKey(ApiKeyService.SPREADSHEET_ID);
        const sheetName = getApiKey(ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS);

        // Only fetch if we haven't fetched yet or if keys have changed
        if (
            !fetchedRef.current ||
            apiKey !== prevApiKeyRef.current ||
            spreadsheetId !== prevSpreadsheetIdRef.current ||
            sheetName !== prevSheetNameRef.current
        ) {
            // Save current values for comparison on next render
            prevApiKeyRef.current = apiKey;
            prevSpreadsheetIdRef.current = spreadsheetId;
            prevSheetNameRef.current = sheetName;
            fetchedRef.current = true;

            if (apiKey && spreadsheetId && sheetName) {
                dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
            }
        }
    }, [dispatch, getApiKey, user]);

    const handleApiKeySubmit = async (apiKey: string, spreadsheetId: string) => {
        setIsLoading(true);
        await dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
        setIsLoading(false);
    };

    const toggleCategory = (categoryIndex: number) => {
        setExpandedCategories(prev => {
            const newExpandedCategories: ExpandedCategories = {};
            Object.keys(prev).forEach(key => {
                newExpandedCategories[parseInt(key)] = false;
            });
            newExpandedCategories[categoryIndex] = !prev[categoryIndex];
            return newExpandedCategories;
        });
    };

    const filterQuestions = (items: SharedItem[] | SharedCategoryShuffled[], query: string): SharedItem[] | SharedCategoryShuffled[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleItemClick = async (item: SharedItem | SharedCategoryShuffled | KnowledgeItem) => {
        const questionItem = item as SharedItem | SharedCategoryShuffled;
        setSelectedItem({ ...questionItem, answer: null });

        try {
            const answer = await handleGenerateAnswer(questionItem.question);
            setSelectedItem(prev => prev ? { ...prev, answer } : null);
        } catch (error) {
            console.error('Failed to generate answer:', error);
            setSelectedItem(null);
        }
    };

    const handleCategorySelect = (category: string) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(category);
            if (isSelected) {
                return prev.filter(c => c !== category);
            }
            return [...prev, category];
        });
    };

    const handleShuffleQuestions = () => {
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
                question: question.question,
                orderNumber: index + 1
            }));
        console.log(shuffled);
        setShuffledQuestions(shuffled);
        setSelectedItem(null);
        setAnswer("");
    };

    const handleRegenerateAnswer = async () => {
        if (!selectedItem) return;
        await generateAnswer(selectedItem.question);
    };

    const renderModelSelector = () => (
        <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onRegenerate={handleRegenerateAnswer}
            onClearCache={() => {
                dispatch(clearCachedAnswers());
                setAnswer("");
            }}
            loading={loading}
            disabled={!selectedItem}
            type="questions"
        />
    );

    const renderCategoryTags = () => {
        const selectedCount = selectedCategories.length;
        const totalCount = questions.length;

        if (!isTagsExpanded) {
            return (
                <div className="flex items-center gap-2">
                    {selectedCategories.slice(0, 2).map((category, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category} ×
                        </Badge>
                    ))}
                    {selectedCount > 2 && (
                        <Badge variant="outline">
                            +{selectedCount - 2} {t('interviewQuestions.categories.more')}
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setIsTagsExpanded(true)}
                    >
                        <Tag className="h-4 w-4 mr-2" />
                        {t('interviewQuestions.categories.selectCount', { selected: selectedCount, total: totalCount })}
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        {t('interviewQuestions.categories.select')} ({selectedCount}/{totalCount})
                    </span>
                    <Tooltip content={t('interviewQuestions.tooltips.collapse')}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTagsExpanded(false)}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                    {questions.map((category, index) => (
                        <Badge
                            key={index}
                            variant={selectedCategories.includes(category.category) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer transition-colors",
                                selectedCategories.includes(category.category)
                                    ? "hover:bg-primary/80"
                                    : "hover:bg-gray-100"
                            )}
                            onClick={() => handleCategorySelect(category.category)}
                        >
                            {category.category}
                            {selectedCategories.includes(category.category) && (
                                <X className="h-3 w-3 ml-1 inline-block" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>
        );
    };

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <SharedSidebar
                            questions={questions}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={selectedItem}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterQuestions}
                            setSearchQuery={setSearchQuery}
                            shuffleQuestions={handleShuffleQuestions}
                            shuffledQuestions={shuffledQuestions}
                            selectedCategories={selectedCategories}
                            handleCategorySelect={handleCategorySelect}
                            renderCategoryTags={renderCategoryTags}
                            type="interview"
                            loading={isLoading}
                        />
                    }
                    content={
                        <SharedContent
                            selectedQuestion={selectedItem}
                            user={user}
                            saveItem={saveItem}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                            handleRegenerateAnswer={handleRegenerateAnswer}
                            loading={loading}
                            error={error}
                            renderModelSelector={renderModelSelector}
                            savedItems={savedItems}
                            addFollowUpQuestion={addFollowUpQuestion}
                            generateAnswer={generateAnswer}
                        />
                    }
                />
                <SettingsButton onSubmit={handleApiKeySubmit} sheetName={ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}