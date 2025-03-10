import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest } from '@/store/interview/slice';
import type { RootState } from '@/store/types';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout, CategoryHeader } from '@/layouts';
import { SearchInput, HighlightText } from '@/components/ui';
import { cn } from "@/lib/utils";
import { Search, Send } from "lucide-react";
import { ModelSelector } from '@/components/ui/model-selector';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { useAuth } from '@/hooks/useAuth';
import { useSavedItems } from '@/hooks/useSavedItems';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from 'react-i18next';
import type { KnowledgeItem, ChatHistory, ExpandedCategories } from '@/types/knowledge';
import ApiKeyForm from '@/components/ApiKeyForm';
import { useApiKeys } from '@/hooks/useApiKeys';

type KnowledgeBaseProps = object

// eslint-disable-next-line no-empty-pattern
export default function KnowledgeBase({ }: KnowledgeBaseProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { questions } = useSelector((state: RootState) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatHistory>({});
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems();
    const { getApiKey } = useApiKeys();

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer
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

    useEffect(() => {
        setExpandedCategories(questions.reduce((acc, category, index) => {
            acc[index] = category.items.length > 0;
            return acc;
        }, {} as ExpandedCategories));
    }, [questions]);

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

    const handleApiKeySubmit = (apiKey: string, spreadsheetId: string) => {
        dispatch(fetchDataRequest({ apiKey, spreadsheetId, user }));
    };

    const toggleCategory = (categoryIndex: number): void => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    };

    const filterItems = (items: KnowledgeItem[], query: string): KnowledgeItem[] => {
        if (!query) return items;
        return items.filter(item =>
            item.question.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleItemClick = async (item: KnowledgeItem): Promise<void> => {
        setSelectedItem({ ...item, answer: null });

        try {
            const answer = await handleGenerateAnswer(item.question);
            setSelectedItem(prev => prev ? { ...prev, answer } : null);
        } catch (error) {
            console.error('Failed to generate answer:', error);
            setSelectedItem(null);
        }
    };

    const handleRegenerateAnswer = async (): Promise<void> => {
        if (!selectedItem) return;

        try {
            const answer = await generateAnswer(selectedItem.question);
            setSelectedItem(prev => prev ? { ...prev, answer } : null);
        } catch (error) {
            console.error('Failed to regenerate answer:', error);
        }
    };

    const handleFollowUpQuestion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!chatInput.trim() || !selectedItem) return;

        const question = chatInput.trim();
        setChatInput('');

        try {
            setChatHistory(prev => ({
                ...prev,
                [selectedItem.question]: [
                    ...(prev[selectedItem.question] || []),
                    { role: 'user', content: question, timestamp: Date.now() }
                ]
            }));

            const contextualQuestion = `Based on the topic "${selectedItem.question}" and its explanation, please answer this follow-up question: ${question}`;
            const answer = await generateAnswer(contextualQuestion);

            setChatHistory(prev => ({
                ...prev,
                [selectedItem.question]: [
                    ...(prev[selectedItem.question] || []),
                    { role: 'assistant', content: answer, timestamp: Date.now() }
                ]
            }));

            if (user && selectedItem) {
                const savedItem = savedItems.find(
                    item => item.question === selectedItem.question
                );

                if (savedItem) {
                    addFollowUpQuestion(savedItem.id, question, answer);
                }
            }
        } catch (error) {
            console.error('Failed to get follow-up answer:', error);
            setChatHistory(prev => ({
                ...prev,
                [selectedItem.question]: [
                    ...(prev[selectedItem.question] || []),
                    {
                        role: 'assistant',
                        content: t('common.errors.failedToGetAnswer'),
                        isError: true,
                        timestamp: Date.now()
                    }
                ]
            }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatInput(e.target.value);
    };

    const handleSaveItem = (item: KnowledgeItem, model: string) => {
        if (!item.answer) return;

        saveItem({
            type: 'knowledge',
            category: item.category || '',
            question: item.question,
            answer: item.answer,
            model: model
        });
    };

    const renderModelSelector = () => (
        <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onRegenerate={handleRegenerateAnswer}
            loading={loading}
            disabled={!selectedItem}
            type="knowledge"
        />
    );

    const renderSidebar = () => (
        <>
            <div className="sticky top-0 bg-white z-10 pb-4 pr-6 pl-6">
                <div className="space-y-2 mb-4">
                    <h2 className="text-xl font-semibold">
                        {t('knowledgeBase.title')}
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <SearchInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('knowledgeBase.searchPlaceholder')}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((category, categoryIndex) => {
                    const filteredItems = filterItems((category.items as KnowledgeItem[] || []) as KnowledgeItem[], searchQuery);
                    console.log('filteredItems', filteredItems)
                    if (filteredItems.length === 0 && searchQuery) return null;
                    return (
                        <div key={categoryIndex} className="space-y-2">
                            <CategoryHeader
                                isExpanded={expandedCategories[categoryIndex]}
                                title={category.category}
                                itemCount={filteredItems.length}
                                onClick={() => toggleCategory(categoryIndex)}
                            />
                            {expandedCategories[categoryIndex] && (
                                <div className="ml-6 space-y-1">
                                    {filteredItems.map((item, itemIndex) => (
                                        <button
                                            key={itemIndex}
                                            onClick={() => handleItemClick(item)}
                                            className={cn(
                                                "w-full text-left px-2 py-1 rounded text-sm",
                                                selectedItem?.question === item.question
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
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );

    const renderContent = () => (
        <div className="py-6 overflow-y-auto">
            {selectedItem ? (
                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">
                                {selectedItem.question}
                            </h1>
                            {user && selectedItem.answer && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSaveItem(selectedItem, selectedModel)}
                                >
                                    <BookmarkPlus className="w-4 h-4 mr-2" />
                                    {t('common.save')}
                                </Button>
                            )}
                        </div>
                        {renderModelSelector()}
                    </div>
                    <div className="space-y-6 border-b pb-6">
                        <div className="rounded-lg bg-white shadow">
                            <AIResponseDisplay
                                loading={loading}
                                content={selectedItem?.answer}
                                error={error}
                                emptyMessage={loading ? undefined : t('knowledge.selectTopic')}
                            />
                        </div>
                    </div>

                    {/* Follow-up Questions Section */}
                    {selectedItem.answer && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                {t('knowledge.followUp.title')}
                            </h2>

                            {/* Item-specific Chat History */}
                            {chatHistory[selectedItem.question]?.length > 0 && (
                                <div className="space-y-4 mb-6 border rounded-lg p-4 bg-gray-50">
                                    {chatHistory[selectedItem.question].map((message, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "rounded-lg p-4",
                                                message.role === 'user'
                                                    ? "bg-white border ml-4"
                                                    : message.isError
                                                        ? "bg-red-50 mr-4"
                                                        : "bg-purple-50 mr-4"
                                            )}
                                        >
                                            <div className="text-xs text-gray-500 mb-1">
                                                {message.role === 'user' ? t('common.you') : t('common.assistant')}
                                            </div>
                                            <AIResponseDisplay
                                                content={message.content}
                                                loading={false}
                                                error={message.isError ? message.content : null}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Question Input */}
                            <form onSubmit={handleFollowUpQuestion} className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={handleInputChange}
                                    placeholder={t('knowledge.followUp.inputPlaceholder')}
                                    className="flex-1 px-4 py-2 ms-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !chatInput.trim()}
                                    className={cn(
                                        "px-4 py-2 rounded-lg",
                                        "bg-purple-600 text-white",
                                        "hover:bg-purple-700",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        "flex items-center gap-2"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                    {t('common.send')}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>{t('knowledgeBase.messages.selectFromSidebar')}</p>
                </div>
            )}
        </div>
    );

    if (!user) {
        return (
            <Layout>
                <div className="max-w-md mx-auto mt-10 p-6">
                    <h1 className="text-2xl font-bold mb-6">Login to Save Your Chat History</h1>
                    <LoginForm />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SidebarLayout
                sidebar={renderSidebar()}
                content={renderContent()}
            />
            <ApiKeyForm onSubmit={handleApiKeySubmit} />
        </Layout>
    );
}