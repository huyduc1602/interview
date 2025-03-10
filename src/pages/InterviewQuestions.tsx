import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest, clearCachedAnswers } from '@/store/interview/slice';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout, CategoryHeader } from '@/layouts';
import { SearchInput, HighlightText, LoginForm } from '@/components/ui';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Shuffle, Tag, X, BookmarkPlus, Settings } from "lucide-react";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";
import { useTranslation } from 'react-i18next';
import { ModelSelector } from '@/components/ui/model-selector';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { useAuth } from '@/hooks/useAuth';
import { useSavedItems } from '@/hooks/useSavedItems';
import ApiKeyForm from '@/components/ApiKeyForm';
import SettingsButton from '@/components/ui/SettingsButton';
import type { InterviewQuestion, ExpandedCategories, InterviewCategory } from '@/types/interview';
import { RootState } from "@/store/types";
import { KnowledgeCategory } from "@/types/knowledge";
import { useApiKeys } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";

export default function InterviewQuestions() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { questions } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [shuffledQuestions, setShuffledQuestions] = useState<InterviewQuestion[]>([]);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const { user } = useAuth();
    const { saveItem } = useSavedItems();
    const { getApiKey } = useApiKeys();
    const fetchedRef = useRef(false);
    const prevApiKeyRef = useRef('');
    const prevSpreadsheetIdRef = useRef('');
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
            if (selectedQuestion) {
                setSelectedQuestion({ ...selectedQuestion, answer: content });
            }
        },
        onError: () => {
            setSelectedQuestion(null);
        }
    });

    useEffect(() => {
        // Skip if no user
        if (!user) return;

        const apiKey = getApiKey('google_sheet');
        const spreadsheetId = getApiKey('spreadsheet_id');

        // Only fetch if we haven't fetched yet or if keys have changed
        if (
            !fetchedRef.current ||
            apiKey !== prevApiKeyRef.current ||
            spreadsheetId !== prevSpreadsheetIdRef.current
        ) {
            // Save current values for comparison on next render
            prevApiKeyRef.current = apiKey;
            prevSpreadsheetIdRef.current = spreadsheetId;
            fetchedRef.current = true;

            if (apiKey && spreadsheetId) {
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
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    };

    const filterQuestions = (items: InterviewQuestion[], query: string): InterviewQuestion[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleQuestionClick = async (question: InterviewQuestion, category?: string) => {
        setSelectedQuestion({
            ...question,
            category: category || question.category || ''
        });
        try {
            await handleGenerateAnswer(question.question);
        } catch (error) {
            console.error('Failed to generate answer:', error);
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

    const shuffleQuestions = () => {
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

        setShuffledQuestions(shuffled);
        setSelectedQuestion(null);
        setAnswer("");
    };

    const handleRegenerateAnswer = async () => {
        if (!selectedQuestion) return;
        await generateAnswer(selectedQuestion.question);
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
            disabled={!selectedQuestion}
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

    const renderSidebar = () => (
        <>
            <div className="sticky top-0 bg-white z-10 pb-4 pr-6 pl-6">
                <div className="space-y-4 mb-4">
                    <h2 className="text-xl font-semibold">{t('interviewQuestions.title')}</h2>
                    <div className="flex items-center justify-between">
                        <Tooltip content={t('interviewQuestions.tooltips.search')}>
                            <div>
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('interviewQuestions.searchPlaceholder')}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip content={t('interviewQuestions.tooltips.shuffle')}>
                            <span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={shuffleQuestions}
                                    disabled={selectedCategories.length === 0}
                                    className="ml-2"
                                >
                                    <Shuffle className="h-4 w-4" />
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                    {renderCategoryTags()}
                </div>
            </div>

            <div className="space-y-4">
                {shuffledQuestions.length > 0 ? (
                    <div className="space-y-2">
                        {shuffledQuestions.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionClick(item)}
                                className={cn(
                                    "w-full text-left px-4 py-2 rounded text-sm",
                                    selectedQuestion?.question === item.question
                                        ? "bg-purple-100 text-purple-900"
                                        : "hover:bg-gray-100"
                                )}
                            >
                                <div className="flex items-start gap-2">
                                    <span className="font-medium text-gray-500">
                                        {item.orderNumber}.
                                    </span>
                                    {searchQuery ? (
                                        <HighlightText
                                            text={item.question}
                                            search={searchQuery}
                                        />
                                    ) : (
                                        item.question
                                    )}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {item.category}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {questions.map((category: (KnowledgeCategory | InterviewCategory), categoryIndex: number) => {
                            const items = (category.items as InterviewQuestion[])?.map((item: unknown) => ({
                                ...(item as InterviewQuestion),
                                question: (item as InterviewQuestion).question || (item as InterviewQuestion).question
                            })) || [];
                            const filteredItems = filterQuestions(items, searchQuery);
                            if (filteredItems.length === 0 && searchQuery) return null;

                            return (
                                <div key={categoryIndex} className="space-y-2">
                                    <CategoryHeader
                                        isExpanded={expandedCategories[categoryIndex]}
                                        title={category.category}
                                        itemCount={filteredItems.length}
                                        onClick={() => toggleCategory(categoryIndex)}
                                    />
                                    <div className="ml-6 space-y-1">
                                        {filteredItems.map((item: InterviewQuestion, itemIndex: number) => (
                                            <button
                                                key={itemIndex}
                                                onClick={() => handleQuestionClick(item, category.category)}
                                                className={cn(
                                                    "w-full text-left px-2 py-1 rounded text-sm",
                                                    selectedQuestion?.question === item.question
                                                        ? "bg-purple-100 text-purple-900"
                                                        : "hover:bg-gray-100"
                                                )}
                                            >
                                                {searchQuery ? (
                                                    <HighlightText
                                                        text={item.question}
                                                        search={searchQuery}
                                                    />
                                                ) : (
                                                    item.question
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );

    const renderContent = () => (
        <div className="py-6 overflow-y-auto">
            {selectedQuestion ? (
                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">
                                {selectedQuestion.question}
                            </h1>
                            {user && selectedQuestion.answer && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => saveItem({
                                        type: 'interview',
                                        category: selectedQuestion.category || '',
                                        question: selectedQuestion.question,
                                        answer: selectedQuestion.answer || '',
                                        model: selectedModel
                                    })}
                                >
                                    <BookmarkPlus className="w-4 h-4 mr-2" />
                                    {t('common.save')}
                                </Button>
                            )}
                        </div>
                        {renderModelSelector()}
                    </div>
                    <div className="rounded-lg bg-white shadow">
                        <AIResponseDisplay
                            loading={loading}
                            content={selectedQuestion?.answer || null}
                            error={error}
                            emptyMessage={t('interview.selectQuestion')}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>{t('interviewQuestions.messages.selectFromSidebar')}</p>
                </div>
            )}
        </div>
    );

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={renderSidebar()}
                    content={renderContent()}
                />
                <SettingsButton onSubmit={handleApiKeySubmit} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}