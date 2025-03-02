import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataRequest } from '@/store/interview/slice';
import { useChat } from '@/hooks/useChat';
import { useAIResponse } from '@/hooks/useAIResponse';
import { Layout, SidebarLayout, CategoryHeader } from '@/layouts';
import { SearchInput, HighlightText } from '@/components/ui';
import { cn } from "@/lib/utils";
import { Search, Send } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ModelSelector } from '@/components/ui/model-selector';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';

export default function KnowledgeBase() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { knowledge } = useSelector((state) => state.interview);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState({});

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer
    } = useChat({ type: 'knowledge' });

    const {
        handleGenerateAnswer,
        error
    } = useAIResponse({
        generateAnswer,
        onSuccess: useCallback((content) => {
            if (selectedItem) {
                setSelectedItem(prev => ({ ...prev, answer: content }));
            }
        }, [selectedItem]),
        onError: useCallback(() => {
            setSelectedItem(null);
        }, [])
    });

    useEffect(() => {
        dispatch(fetchDataRequest());
    }, [dispatch]);

    const toggleCategory = (categoryIndex) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryIndex]: !prev[categoryIndex]
        }));
    };

    const filterItems = (items, query) => {
        if (!query) return items;
        return items.filter(item =>
            item.content.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleItemClick = async (item) => {
        // Set selected item with initial empty answer
        setSelectedItem({ ...item, answer: null });

        try {
            const answer = await handleGenerateAnswer(item.content);
            // Update selected item with the generated answer
            setSelectedItem(prev => ({ ...prev, answer }));
        } catch (error) {
            console.error('Failed to generate answer:', error);
            // Reset selected item on error
            setSelectedItem(null);
        }
    };

    const handleRegenerateAnswer = async () => {
        if (!selectedItem) return;
        await generateAnswer(selectedItem.content);
    };

    const handleFollowUpQuestion = async (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !selectedItem) return;

        const question = chatInput.trim();
        setChatInput('');

        try {
            // Add user message to chat history immediately
            setChatHistory(prev => ({
                ...prev,
                [selectedItem.content]: [
                    ...(prev[selectedItem.content] || []),
                    { role: 'user', content: question }
                ]
            }));

            // Generate answer with context
            const contextualQuestion = `Based on the topic "${selectedItem.content}" and its explanation, please answer this follow-up question: ${question}`;
            const answer = await generateAnswer(contextualQuestion);

            // Add AI response to chat history
            setChatHistory(prev => ({
                ...prev,
                [selectedItem.content]: [
                    ...(prev[selectedItem.content] || []),
                    { role: 'assistant', content: answer }
                ]
            }));
        } catch (error) {
            console.error('Failed to get follow-up answer:', error);
            // Add error message to chat history
            setChatHistory(prev => ({
                ...prev,
                [selectedItem.content]: [
                    ...(prev[selectedItem.content] || []),
                    {
                        role: 'assistant',
                        content: t('common.errors.failedToGetAnswer'),
                        isError: true
                    }
                ]
            }));
        }
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
                {knowledge.map((category, categoryIndex) => {
                    const filteredItems = filterItems(category.items || [], searchQuery);
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
                                                selectedItem?.content === item.content
                                                    ? "bg-purple-100 text-purple-900"
                                                    : "hover:bg-gray-100"
                                            )}
                                        >
                                            {searchQuery ? (
                                                <HighlightText
                                                    text={item.content}
                                                    search={searchQuery}
                                                />
                                            ) : (
                                                item.content
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
                    {/* Main Answer Section */}
                    <div className="space-y-6 border-b pb-6">
                        <div className="border-b pb-4">
                            <h1 className="text-2xl font-semibold">
                                {selectedItem.content}
                            </h1>
                            {renderModelSelector()}
                        </div>
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
                            {chatHistory[selectedItem.content]?.length > 0 && (
                                <div className="space-y-4 mb-6 border rounded-lg p-4 bg-gray-50">
                                    {chatHistory[selectedItem.content].map((message, index) => (
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
                                    onChange={(e) => setChatInput(e.target.value)}
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

    return (
        <Layout>
            <SidebarLayout
                sidebar={renderSidebar()}
                content={renderContent()}
            />
        </Layout>
    );
}