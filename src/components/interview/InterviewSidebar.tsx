import SharedSidebar from '@/components/share/SharedSidebar';
import CategoryTags from '@/components/categoryTags';
import { SharedItem, SharedCategoryShuffled, SharedCategory } from '@/types/common';
import { ExpandedCategories } from '@/types/common';
import { Dispatch, SetStateAction } from 'react';

interface InterviewSidebarProps {
    questions: SharedCategory[];
    expandedCategories: ExpandedCategories;
    searchQuery: string;
    selectedQuestion: SharedItem | null;
    toggleCategory: (categoryIndex: number) => void;
    handleQuestionClick: (item: SharedItem | SharedCategoryShuffled) => Promise<void>;
    filterQuestions: (items: SharedItem[] | SharedCategoryShuffled[], query: string) => SharedItem[] | SharedCategoryShuffled[];
    setSearchQuery: (query: string) => void;
    shuffleQuestions: () => void;
    shuffledQuestions: SharedCategoryShuffled[];
    setShuffledQuestions: Dispatch<SetStateAction<SharedCategoryShuffled[]>>;
    selectedCategories: string[];
    handleCategorySelect: (category: string) => void;
    isTagsExpanded: boolean;
    setIsTagsExpanded: (expanded: boolean) => void;
    isLoading: boolean;
}

export default function InterviewSidebar({
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
    handleCategorySelect,
    isTagsExpanded,
    setIsTagsExpanded,
    isLoading
}: InterviewSidebarProps) {
    const renderCategoryTags = () => (
        <CategoryTags
            selectedCategories={selectedCategories}
            isTagsExpanded={isTagsExpanded}
            setIsTagsExpanded={setIsTagsExpanded}
            handleCategorySelect={handleCategorySelect}
            categoryItem={questions}
        />
    );

    return (
        <SharedSidebar
            questions={questions}
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
            type="interview"
            loading={isLoading}
        />
    );
}