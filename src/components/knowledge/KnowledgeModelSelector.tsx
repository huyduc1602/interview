import { ModelSelector } from "@/components/ui/model-selector";
import { KnowledgeItem } from "@/types/knowledge";

interface KnowledgeModelSelectorProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    handleRegenerateAnswer: () => void;
    loading: boolean;
    selectedItem: KnowledgeItem | null; // Replace with proper type
}

export default function KnowledgeModelSelector({
    selectedModel,
    setSelectedModel,
    handleRegenerateAnswer,
    loading,
    selectedItem,
}: KnowledgeModelSelectorProps) {

    return (
        <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onRegenerate={handleRegenerateAnswer}
            loading={loading}
            disabled={!selectedItem}
            type="knowledge"
        />
    );
}