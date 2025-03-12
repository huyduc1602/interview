import SharedContent from '@/components/share/SharedContent';
import { ModelSelector } from "@/components/ui/model-selector";
import { clearCachedAnswers } from '@/store/interview/slice';
import { ItemTypeSaved, SharedItem, SharedCategoryShuffled, SavedItem, User, FollowUpQuestion } from '@/types/common';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';

interface InterviewContentProps {
    selectedQuestion: SharedItem | SharedCategoryShuffled | null;
    user: User | null;
    saveItem: (item: SavedItem) => void;
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    handleRegenerateAnswer: () => Promise<void>;
    loading: boolean;
    error: string | null;
    savedItems: SavedItem[];
     addFollowUpQuestion: (item: FollowUpQuestion) => void;
    generateAnswer: (question: string) => Promise<string>;
    setAnswer: Dispatch<SetStateAction<string | null>>;
    isSavedAnswer?: boolean;
    setIsSavedAnswer: (isSaved: boolean) => void;
    existingSavedItem?: SavedItem | null;
    typeSavedItem?: ItemTypeSaved;
}

export default function InterviewContent({
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
    isSavedAnswer = false,
    setIsSavedAnswer,
    existingSavedItem = null,
    typeSavedItem = ItemTypeSaved.InterviewAnswers,
}: InterviewContentProps) {
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
            disabled={!selectedQuestion}
            type="interview"
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