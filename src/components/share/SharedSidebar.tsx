import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchInput, HighlightText } from '@/components/ui';
import { CategoryHeader } from '@/layouts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import type { ExpandedCategories } from '@/types/interview';
import type { SharedCategory, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/ui/spinner';

interface SharedSidebarProps {
    questions: SharedCategory[];
    expandedCategories: ExpandedCategories;
    searchQuery: string;
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    toggleCategory: (categoryIndex: number) => void;
    handleQuestionClick: (question: SharedItem | SharedCategoryShuffled, category?: string) => void;
    filterQuestions: (items: SharedItem[] | SharedCategoryShuffled[], query: string) => SharedItem[] | SharedCategoryShuffled[];
    setSearchQuery: (query: string) => void;
    shuffleQuestions: () => void;
    shuffledQuestions: SharedCategoryShuffled[];
    selectedCategories: string[];
    handleCategorySelect: (category: string) => void;
    renderCategoryTags: () => JSX.Element;
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
    shuffledQuestions,
    selectedCategories,
    renderCategoryTags,
    loading
}) => {
    const { t } = useTranslation();

    const getItems = (category: SharedCategory) => {
        if (shuffledQuestions.length > 0) {
            return shuffledQuestions as SharedItem[];
        }
        return category.items;
    };

    const renderShuffledQuestions = () => {
        return shuffledQuestions.map((sQuestion) => (
            <button
                key={sQuestion.rowIndex}
                onClick={() => handleQuestionClick(sQuestion, sQuestion.category)}
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
        return questions.map((category, categoryIndex) => {
            const items = getItems(category);
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
                    {expandedCategories[categoryIndex] && (
                        <div className="ml-6 space-y-1">
                            {filteredItems.map((item: SharedItem | SharedCategoryShuffled, itemIndex: number) => (
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
                    )}
                </div>
            );
        });
    };

    return (
        <>
            <div className="sticky top-0 bg-white z-10 pb-4 pr-6 pl-6">
                <div className="space-y-4 mb-4">
                    <h2 className="text-xl font-semibold pt-2">{t('interviewQuestions.title')}</h2>
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
                        <Tooltip content={t('interviewQuestions.tooltips.shuffle')} className="bg-gray-800 text-white">
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
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
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