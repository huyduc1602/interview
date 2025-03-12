import SharedContent from '@/components/share/SharedContent';
import { ModelSelector } from "@/components/ui/model-selector";
import { clearCachedAnswers } from '@/store/interview/slice';
import { SharedItem, SharedCategoryShuffled, User, SavedItem, FollowUpQuestion } from '@/types/common';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';
import { AIModelType } from '@/services/aiServices';

interface KnowledgeContentProps {
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    user: User | null;
    saveItem: (item: unknown) => void;
    selectedModel: string;
    setSelectedModel: (model: AIModelType) => void;
    handleRegenerateAnswer: () => void;
    loading: boolean;
    error: string | null;
    savedItems: SavedItem[];
    addFollowUpQuestion: (item: FollowUpQuestion) => void;
    generateAnswer: (prompt: string) => Promise<string>;
    setAnswer: Dispatch<SetStateAction<string | null>>;
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
    setAnswer
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
        />
    );
}