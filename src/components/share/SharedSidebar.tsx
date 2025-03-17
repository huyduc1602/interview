import React, { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput, HighlightText } from '@/components/ui';
import { CategoryHeader } from '@/layouts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import type { ExpandedCategories } from '@/types/common';
import type { SharedCategory, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { Badge } from '@/components/ui/badge';
import ShimmerSidebar from '@/components/ui/shimmer/ShimmerSidebar';

interface SharedSidebarProps {
    questions: SharedCategory[];
    expandedCategories: ExpandedCategories;
    searchQuery: string;
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    toggleCategory: (categoryIndex: number) => void;
    handleQuestionClick: (question: SharedItem | SharedCategoryShuffled, category?: string) => void | Promise<void>;
    filterQuestions: (
        items: SharedItem[] | SharedCategoryShuffled[],
        query: string,
        category?: string[]
    ) => SharedItem[] | SharedCategoryShuffled[];
    setSearchQuery: (query: string) => void;
    shuffleQuestions: () => void;
    setShuffledQuestions: Dispatch<SetStateAction<SharedCategoryShuffled[]>>;
    shuffledQuestions: SharedCategoryShuffled[];
    selectedCategories: string[];
    handleCategorySelect: (category: string) => void;
    renderCategoryTags: () => JSX.Element;
    type: "knowledge" | "interview";
    loading: boolean;
}

const SharedSidebar: React.FC<SharedSidebarProps> = ({
    questions,
    expandedCategories,
    searchQuery,
    selectedQuestion,
    toggleCategory,
    handleQuestionClick,
    filterQuestions,
    setSearchQuery,
    shuffleQuestions,
    setShuffledQuestions,
    shuffledQuestions,
    selectedCategories,
    renderCategoryTags,
    type,
    loading,
}) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (type == 'knowledge') {
            setTitle(t('knowledgeBase.title'));
        } else {
            setTitle(t('interviewQuestions.title'));
        }
    }, [type]);

    const getItems = (category: SharedCategory) => {
        if (shuffledQuestions.length > 0) {
            return shuffledQuestions as SharedItem[];
        }
        return category.items;
    };

    const toggleShuffleMode = () => {
        if (shuffledQuestions.length > 0) {
            // If we're already in shuffle mode, clear the shuffled questions
            setShuffledQuestions([]);
        } else {
            // If we're not in shuffle mode, shuffle the questions
            shuffleQuestions();
        }
    };

    const renderShuffledQuestions = () => {
        return shuffledQuestions.map((sQuestion) => (
            <button
                key={sQuestion.rowIndex}
                onClick={() => handleQuestionClick(sQuestion)}
                className={cn(
                    "w-full text-left px-2 py-1 rounded text-sm",
                    selectedQuestion?.question === sQuestion.question
                        ? "bg-purple-100 text-purple-900"
                        : "hover:bg-gray-100"
                )}
            >
                {searchQuery ? (
                    <HighlightText text={sQuestion.question} search={searchQuery} />
                ) : (
                    sQuestion.question
                )}
                <Badge className="mt-2 block bg-gray-200 max-w-fit">{sQuestion.category}</Badge>
            </button>
        ));
    };

    const renderQuestions = () => {
        return questions?.map((category, categoryIndex) => {
            if (!expandedCategories[categoryIndex] && !selectedCategories.includes(category.category)) return null;

            const items = getItems(category);
            const filteredItems = filterQuestions(
                items, searchQuery, selectedCategories.length > 0 ? selectedCategories : undefined
            ) as SharedItem[] | SharedCategoryShuffled[];

            // Skip empty categories after filtering
            if (filteredItems.length === 0 && searchQuery) return null;

            // Don't show categories that have no items and aren't selected
            if (filteredItems.length === 0 &&
                !selectedCategories.includes(category.category)) return null;

            return (
                <div key={categoryIndex} className="space-y-2 min-w-min">
                    <CategoryHeader
                        isExpanded={expandedCategories[categoryIndex]}
                        title={category.category}
                        itemCount={filteredItems.length}
                        onClick={() => toggleCategory(categoryIndex)}
                    />
                    {expandedCategories[categoryIndex] && (
                        <div className="ml-6 space-y-1">
                            {filteredItems.map((item: SharedItem | SharedCategoryShuffled, itemIndex: number) => (
                                <button
                                    key={itemIndex}
                                    onClick={() => handleQuestionClick(item, category.category)}
                                    className={cn(
                                        "fill-available text-left px-2 py-1 rounded text-sm border-2 border-dotted border-sky-500",
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
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <div className={cn("sticky top-0 z-10 pb-4 px-4 bg-white dark:bg-gray-900 w-100")}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={cn("text-xl font-semibold pt-2")}>{title}</h2>
                </div>
                <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between">
                        <Tooltip content={t('interviewQuestions.tooltips.search')} className="bg-gray-800 text-white">
                            <div>
                                <SearchInput
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('interviewQuestions.searchPlaceholder')}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip
                            content={
                                shuffledQuestions.length > 0
                                    ? t('interviewQuestions.tooltips.unShuffle')
                                    : t('interviewQuestions.tooltips.shuffle')
                            }
                            className="bg-gray-800 text-white"
                        >
                            <span>
                                <Button
                                    size="sm"
                                    variant={shuffledQuestions.length > 0 ? "default" : "outline"}
                                    onClick={toggleShuffleMode}
                                    disabled={selectedCategories.length === 0 && shuffledQuestions.length === 0}
                                    className="ml-2"
                                >
                                    <Shuffle className={`h-4 w-4 ${shuffledQuestions.length > 0 ? "text-gray-400" : "text-gray-800"}`} />
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                    {renderCategoryTags()}
                </div>
            </div>

            <div className={cn("space-y-4")}>
                {loading ? (
                    <ShimmerSidebar type={type} />
                ) : (
                    <>
                        {shuffledQuestions.length > 0 && renderShuffledQuestions()}
                        {shuffledQuestions.length === 0 && renderQuestions()}
                    </>
                )}
            </div>
        </>
    );
};

export default SharedSidebar;