import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCachedAnswers, fetchDataRequest } from '@/store/interview/slice';
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
import SharedSidebar from '@/components/share/SharedSidebar';
import SharedContent from '@/components/share/SharedContent';
import { ModelSelector } from "@/components/ui/model-selector";
import { SharedCategoryShuffled, SharedItem } from "@/types/common";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronUp, Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function KnowledgeBase() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { knowledge } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistory>({});
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems();
    const { getApiKey } = useApiKeys();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<SharedCategoryShuffled[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer,
        setAnswer
    } = useChat({ type: 'knowledge' }, user);

    const {
        handleGenerateAnswer,
        error
    } = useAIResponse({
        generateAnswer,
        onSuccess: useCallback((content: string) => {
            if (selectedItem) {
                setSelectedItem(prev => prev ? ({ ...prev, answer: content }) : null);
            }
        }, [selectedItem]),
        onError: useCallback(() => {
            setSelectedItem(null);
        }, [])
    });

    // Add these refs to track fetch status and previous values
    const fetchedRef = useRef(false);
    const prevApiKeyRef = useRef('');
    const prevSpreadsheetIdRef = useRef('');
    const prevSheetNameRef = useRef<string | null>(null);

    useEffect(() => {
        if (!knowledge || knowledge.length === 0) setIsLoading(true); else setIsLoading(false);
        setExpandedCategories(knowledge.reduce((acc, kCategory, index) => {
            acc[index] = kCategory.category.length > 0;
            return acc;
        }, {} as ExpandedCategories));
    }, [knowledge]);

    useEffect(() => {
        // Skip if no user
        if (!user) return;

        const apiKey = getApiKey(ApiKeyService.GOOGLE_SHEET_API_KEY);
        const spreadsheetId = getApiKey(ApiKeyService.SPREADSHEET_ID);
        const sheetName = getApiKey(ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE);

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

    // Load chat history from localStorage on component mount
    useEffect(() => {
        if (user) {
            const savedHistory = localStorage.getItem(`chat_history_${user.id}`);
            if (savedHistory) {
                setChatHistory(JSON.parse(savedHistory));
            }
        }
    }, [user]);

    // Save chat history to localStorage when it changes
    useEffect(() => {
        if (user && Object.keys(chatHistory).length > 0) {
            localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(chatHistory));
        }
    }, [chatHistory, user]);

    const handleApiKeySubmit = async (apiKey: string, spreadsheetId: string) => {
        setIsLoading(true);
        await dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
        setIsLoading(false);
    };

    const toggleCategory = (categoryIndex: number): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    };

    const filterItems = (items: SharedItem[] | SharedCategoryShuffled[], query: string): SharedItem[] | SharedCategoryShuffled[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
    };

    const convertToSharedItem = (item: KnowledgeItem | null): SharedItem => {
       return {
            question: item?.content || '',
            category: item?.category || '',
            answer: item?.answer || ''
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleItemClick = async (item: SharedItem | SharedCategoryShuffled | KnowledgeItem, _category?: string) => {
        const knowledgeItem = item as KnowledgeItem;
        setSelectedItem(knowledgeItem);

        try {
            const answer = await handleGenerateAnswer(knowledgeItem.content);
            setSelectedItem(prev => prev ? { ...prev, answer } : null);
        } catch (error) {
            console.error('Failed to generate answer:', error);
            setSelectedItem(null);
        }
    };

    const handleRegenerateAnswer = async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const answer = await generateAnswer(selectedItem.content);
            setSelectedItem(prev => prev ? { ...prev, answer } : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    };

    const handleShuffleQuestions = () => {
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

    const renderCategoryTags = () => {
        const selectedCount = selectedCategories.length;
        const totalCount = knowledge.length;

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
                    {knowledge.map((category, index) => (
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
                type="knowledge"
            />
        );

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <SharedSidebar
                            questions={knowledge}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={convertToSharedItem(selectedItem)}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterItems}
                            setSearchQuery={setSearchQuery}
                            shuffleQuestions={handleShuffleQuestions}
                            shuffledQuestions={shuffledQuestions}
                            selectedCategories={selectedCategories}
                            handleCategorySelect={handleCategorySelect}
                            renderCategoryTags={renderCategoryTags}
                            type="knowledge"
                            loading={isLoading}
                        />
                    }
                    content={
                        <SharedContent
                            selectedQuestion={convertToSharedItem(selectedItem)}
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
                <SettingsButton onSubmit={handleApiKeySubmit} sheetName={ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}