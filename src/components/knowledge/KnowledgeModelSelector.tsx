import { ModelSelector } from "@/components/ui/model-selector";
import { clearCachedAnswers } from '@/store/interview/slice';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction } from 'react';
import { KnowledgeItem } from "@/types/knowledge";

interface KnowledgeModelSelectorProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    handleRegenerateAnswer: () => void;
    loading: boolean;
    selectedItem: KnowledgeItem | null; // Replace with proper type
    setAnswer: Dispatch<SetStateAction<string | null>>;
}

export default function KnowledgeModelSelector({
    selectedModel,
    setSelectedModel,
    handleRegenerateAnswer,
    loading,
    selectedItem,
    setAnswer
}: KnowledgeModelSelectorProps) {
    const dispatch = useDispatch();

    return (
        <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onRegenerate={handleRegenerateAnswer}
            onClearCache={() => {
                dispatch(clearCachedAnswers());
                setAnswer("");
            }}
            loading={loading}
            disabled={!selectedItem}
            type="knowledge"
        />
    );
}