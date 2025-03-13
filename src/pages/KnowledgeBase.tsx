import { useSelector } from "react-redux";
import type { RootState } from '@/store/types';
import { useChat } from '@/hooks/useChat';
import { Layout, SidebarLayout } from '@/layouts';
import { useAuth } from '@/hooks/useAuth';
import { useSavedItems } from '@/hooks/useSavedItems';
import SettingsButton from '@/components/ui/settingsButton';
import type { KnowledgeItem } from '@/types/knowledge';
import { ApiKeyService } from '@/hooks/useApiKeys';
import LoginPrompt from "@/components/auth/LoginPrompt";
import { ItemTypeSaved } from "@/types/common";
import { TooltipProvider } from "@/components/ui/tooltip";
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar';
import KnowledgeContent from '@/components/knowledge/KnowledgeContent';
import { useDataManagement } from '@/hooks/useDataManagement';
import { useItemInteractions } from '@/hooks/useItemInteractions';
import { fetchKnowledgeDataFromSupabase } from '@/utils/supabaseUtils';
import { useEffect } from "react";

export default function KnowledgeBase() {
    const { user } = useAuth();
    const { knowledge } = useSelector((state: RootState) => state.interview);
    const { savedItems, saveItem, addFollowUpQuestion } = useSavedItems(ItemTypeSaved.KnowledgeAnswers);

    const {
        loading,
        selectedModel,
        setSelectedModel,
        generateAnswer,
        setAnswer
    } = useChat({ type: 'knowledge' }, user);

    // Use shared data management hook
    const {
        expandedCategories,
        isLoading,
        selectedCategories,
        shuffledQuestions,
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
        dataType: 'knowledge',
        data: knowledge,
        fetchDataFromSupabase: fetchKnowledgeDataFromSupabase
    });

    // Use shared item interactions hook
    const {
        selectedItem,
        setSelectedItem,
        isSavedAnswer,
        setIsSavedAnswer,
        existingSavedItem,
        convertToSharedItem,
        handleItemClick,
        handleRegenerateAnswer,
        error
    } = useItemInteractions({
        type: 'knowledge',
        generateAnswer,
        savedItems,
        contentField: 'content'
    });

    // Erase existingSavedAnswer if needed
    useEffect(() => {
        if (existingSavedItem && existingSavedItem.id === (selectedItem as KnowledgeItem)?.id) {
            setIsSavedAnswer(true);
        }
    }, [existingSavedItem, selectedItem]);

    const handleShuffleQuestionsWithState = () => {
        handleShuffleQuestions(setSelectedItem, setAnswer);
    };

    if (!user) {
        return <LoginPrompt onSuccess={() => window.location.reload()} />;
    }

    // Create the shared item for the content component
    const sharedQuestion = selectedItem ? convertToSharedItem(selectedItem) : null;

    return (
        <TooltipProvider>
            <Layout>
                <SidebarLayout
                    sidebar={
                        <KnowledgeSidebar
                            knowledge={knowledge}
                            expandedCategories={expandedCategories}
                            searchQuery={searchQuery}
                            selectedQuestion={sharedQuestion}
                            toggleCategory={toggleCategory}
                            handleQuestionClick={handleItemClick}
                            filterQuestions={filterItems}
                            setSearchQuery={setSearchQuery}
                            shuffleQuestions={handleShuffleQuestionsWithState}
                            shuffledQuestions={shuffledQuestions}
                            selectedCategories={selectedCategories}
                            handleCategorySelect={handleCategorySelect}
                            isTagsExpanded={isTagsExpanded}
                            setIsTagsExpanded={setIsTagsExpanded}
                            isLoading={isLoading}
                        />
                    }
                    content={
                        <KnowledgeContent
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
                            typeSavedItem={ItemTypeSaved.KnowledgeAnswers}
                        />
                    }
                />
                <SettingsButton
                    onSubmit={handleApiKeySubmit}
                    sheetName={ApiKeyService.GOOGLE_SHEET_KNOWLEDGE_BASE}
                    isLoading={isLoading}
                />
            </Layout>
        </TooltipProvider>
    );
}