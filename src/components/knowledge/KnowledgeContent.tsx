import SharedContent from '@/components/share/SharedContent';
import { ModelSelector } from "@/components/ui/modelSelector";
import { clearCachedAnswers } from '@/store/interview/slice';
import { SharedItem, SharedCategoryShuffled, User, SavedItem, FollowUpQuestion, ItemTypeSaved } from '@/types/common';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';
import { AIModelType } from '@/services/aiServices';

interface KnowledgeContentProps {
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    user: User | null;
    saveItem: (item: SavedItem) => Promise<string | null>;
    selectedModel: string;
    setSelectedModel: (model: AIModelType) => void;
    handleRegenerateAnswer: () => Promise<void>;
    loading: boolean;
    error: string | null;
    savedItems: SavedItem[];
    addFollowUpQuestion: (item: FollowUpQuestion) => void;
    generateAnswer: (prompt: string) => Promise<string>;
    setAnswer: Dispatch<SetStateAction<string | null>>;
    isSavedAnswer: boolean;
    setIsSavedAnswer: Dispatch<SetStateAction<boolean>>;
    existingSavedItem: SavedItem | null;
    typeSavedItem: ItemTypeSaved;
}

export default function KnowledgeContent({
    selectedQuestion,
    user,
    saveItem,
    selectedModel,
    setSelectedModel,
    handleRegenerateAnswer,
    loading,
    error,
    savedItems,
    addFollowUpQuestion,
    generateAnswer,
    setAnswer,
    isSavedAnswer,
    setIsSavedAnswer,
    existingSavedItem,
    typeSavedItem
}: KnowledgeContentProps) {
    const dispatch = useDispatch();

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
            disabled={!selectedQuestion?.question}
            type="knowledge"
        />
    );

    return (
        <SharedContent
            selectedQuestion={selectedQuestion}
            user={user}
            saveItem={saveItem}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleRegenerateAnswer={handleRegenerateAnswer}
            loading={loading}
            error={error}
            renderModelSelector={renderModelSelector}
            savedItems={savedItems}
            addFollowUpQuestion={addFollowUpQuestion}
            generateAnswer={generateAnswer}
            isSavedAnswer={isSavedAnswer}
            setIsSavedAnswer={setIsSavedAnswer}
            existingSavedItem={existingSavedItem}
            typeSavedItem={typeSavedItem}
        />
    );
}