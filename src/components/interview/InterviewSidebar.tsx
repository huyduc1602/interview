import SharedSidebar from '@/components/share/SharedSidebar';
import CategoryTags from '@/components/categoryTags';
import { SharedItem, SharedCategoryShuffled, SharedCategory } from '@/types/common';
import { ExpandedCategories } from '@/types/interview';
import { KnowledgeItem } from '@/types/knowledge';

interface InterviewSidebarProps {
    questions: SharedCategory[];
    expandedCategories: ExpandedCategories;
    searchQuery: string;
    selectedQuestion: SharedItem | null;
    toggleCategory: (categoryIndex: number) => void;
    handleQuestionClick: (item: SharedItem | SharedCategoryShuffled | KnowledgeItem) => Promise<void>;
    filterQuestions: (items: SharedItem[] | SharedCategoryShuffled[], query: string) => SharedItem[] | SharedCategoryShuffled[];
    setSearchQuery: (query: string) => void;
    shuffleQuestions: () => void;
    shuffledQuestions: SharedCategoryShuffled[];
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
            knowledge={questions}
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
            shuffledQuestions={shuffledQuestions}
            selectedCategories={selectedCategories}
            handleCategorySelect={handleCategorySelect}
            renderCategoryTags={renderCategoryTags}
            type="interview"
            loading={isLoading}
        />
    );
}