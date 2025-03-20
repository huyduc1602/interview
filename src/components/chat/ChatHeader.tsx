import { memo } from 'react';
import { ModelSelector } from '@/components/ui/modelSelector';
import { Sparkles } from '@/components/icons';
import { AIModel } from '@/services/aiServices/types';

interface ChatHeaderProps {
    title: string;
    selectedModel: AIModel;
    onModelChange: (model: string) => void;
    onRegenerate: () => void;
    onClearCache: () => void;
    loading: boolean;
    t: (key: string) => string;
}

/**
 * ChatHeader component - Displays the chat title and model selector
 * Memoized to prevent unnecessary re-renders
 */
const ChatHeader = memo(({
    title,
    selectedModel,
    onModelChange,
    onRegenerate,
    onClearCache,
    loading
}: ChatHeaderProps) => (
    <div className="border-b p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
            <h1 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                {title}
            </h1>
            <ModelSelector
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                onRegenerate={onRegenerate}
                onClearCache={onClearCache}
                loading={loading}
                disabled={loading}
                type="chat"
            />
        </div>
    </div>
));

ChatHeader.displayName = 'ChatHeader';

export { ChatHeader };
