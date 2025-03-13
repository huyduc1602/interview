import SharedSidebar from '@/components/share/SharedSidebar';
import CategoryTags from '@/components/categoryTags';
import { SharedCategory, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { ExpandedCategories } from '@/types/common';
import { Dispatch, SetStateAction } from 'react';

interface KnowledgeSidebarProps {
    knowledge: SharedCategory[];
    expandedCategories: ExpandedCategories;
    searchQuery: string;
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    toggleCategory: (categoryIndex: number) => void;
    handleQuestionClick: (item: SharedItem | SharedCategoryShuffled) => void;
    filterQuestions: (items: SharedItem[] | SharedCategoryShuffled[], query: string) => SharedItem[] | SharedCategoryShuffled[];
    setSearchQuery: (query: string) => void;
    shuffleQuestions: () => void;
    setShuffledQuestions: Dispatch<SetStateAction<SharedCategoryShuffled[]>>;
    shuffledQuestions: SharedCategoryShuffled[];
    selectedCategories: string[];
    handleCategorySelect: (category: string) => void;
    isTagsExpanded: boolean;
    setIsTagsExpanded: (expanded: boolean) => void;
    isLoading: boolean;
}

export default function KnowledgeSidebar({
    knowledge,
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
    handleCategorySelect,
    isTagsExpanded,
    setIsTagsExpanded,
    isLoading
}: KnowledgeSidebarProps) {
    const renderCategoryTags = () => (
        <CategoryTags
            selectedCategories={selectedCategories}
            isTagsExpanded={isTagsExpanded}
            setIsTagsExpanded={setIsTagsExpanded}
            handleCategorySelect={handleCategorySelect}
            categoryItem={knowledge}
        />
    );

    return (
        <SharedSidebar
            questions={knowledge}
            expandedCategories={expandedCategories}
            searchQuery={searchQuery}
            selectedQuestion={selectedQuestion}
            toggleCategory={toggleCategory}
            handleQuestionClick={handleQuestionClick}
            filterQuestions={filterQuestions}
            setSearchQuery={setSearchQuery}
            shuffleQuestions={shuffleQuestions}
            setShuffledQuestions={setShuffledQuestions}
            shuffledQuestions={shuffledQuestions}
            selectedCategories={selectedCategories}
            handleCategorySelect={handleCategorySelect}
            renderCategoryTags={renderCategoryTags}
            type="knowledge"
            loading={isLoading}
        />
    );
}