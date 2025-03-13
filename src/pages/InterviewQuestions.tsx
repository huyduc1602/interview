import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from '@/store/types';
import { useChat } from '@/hooks/useChat';
import { Layout, SidebarLayout } from '@/layouts';
import { useAuth } from '@/hooks/useAuth';
import { useSavedItems } from '@/hooks/useSavedItems';
import SettingsButton from '@/components/ui/settingsButton';
import { ApiKeyService } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";
import { ItemTypeSaved } from "@/types/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fetchInterviewQuestionDataFromSupabase } from '@/utils/supabaseUtils';
import InterviewSidebar from '@/components/interview/InterviewSidebar';
import InterviewContent from '@/components/interview/InterviewContent';
import { useDataManagement } from '@/hooks/useDataManagement';
import { useItemInteractions } from '@/hooks/useItemInteractions';

export default function InterviewQuestions() {
    const { user } = useAuth();
    const { questions } = useSelector((state: RootState) => state.interview);
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems(ItemTypeSaved.InterviewAnswers);

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer,
        setAnswer
    } = useChat({ type: 'interview' }, user);

    // Use shared data management hook
    const {
        expandedCategories,
        isLoading,
        selectedCategories,
        shuffledQuestions,
        setShuffledQuestions,
        searchQuery,
        isTagsExpanded,
        setSearchQuery,
        setIsTagsExpanded,
        toggleCategory,
        filterItems,
        handleCategorySelect,
        handleShuffleQuestions,
        handleApiKeySubmit,
    } = useDataManagement({
        dataType: 'interview',
        data: questions,
        fetchDataFromSupabase: fetchInterviewQuestionDataFromSupabase
    });

    // Use shared item interactions hook
    const {
        selectedItem,
        setSelectedItem,
        isSavedAnswer,
        setIsSavedAnswer,
        existingSavedItem,
        handleItemClick,
        handleRegenerateAnswer,
        error
    } = useItemInteractions({
        type: 'interview',
        generateAnswer,
        savedItems,
    });

    // Check for existing saved item
    useEffect(() => {
        if (existingSavedItem && existingSavedItem.id === selectedItem?.id) {
            setIsSavedAnswer(true);
        }
    }, [existingSavedItem, selectedItem]);

    const handleShuffleQuestionsWithState = () => {
        handleShuffleQuestions(setSelectedItem, setAnswer);
    };

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    // Convert to shared item format
    const sharedQuestion = selectedItem;

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <InterviewSidebar
                            questions={questions}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={sharedQuestion}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterItems}
                            setSearchQuery={setSearchQuery}
                            shuffleQuestions={handleShuffleQuestionsWithState}
                            shuffledQuestions={shuffledQuestions}
                            setShuffledQuestions={setShuffledQuestions}
                            selectedCategories={selectedCategories}
                            handleCategorySelect={handleCategorySelect}
                            isTagsExpanded={isTagsExpanded}
                            setIsTagsExpanded={setIsTagsExpanded}
                            isLoading={isLoading}
                        />
                    }
                    content={
                        <InterviewContent
                            selectedQuestion={sharedQuestion}
                            user={user}
                            saveItem={saveItem}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                            handleRegenerateAnswer={handleRegenerateAnswer}
                            loading={loading}
                            error={error}
                            savedItems={savedItems}
                            addFollowUpQuestion={addFollowUpQuestion}
                            generateAnswer={generateAnswer}
                            setAnswer={setAnswer}
                            isSavedAnswer={isSavedAnswer}
                            setIsSavedAnswer={setIsSavedAnswer}
                            existingSavedItem={existingSavedItem}
                            typeSavedItem={ItemTypeSaved.InterviewAnswers}
                        />
                    }
                />
                <SettingsButton onSubmit={handleApiKeySubmit} sheetName={ApiKeyService.GOOGLE_SHEET_INTERVIEW_QUESTIONS} isLoading={isLoading} />
            </Layout>
        </TooltipProvider>
    );
}