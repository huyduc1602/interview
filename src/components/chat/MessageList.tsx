import React, { memo } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from '@/components/icons';
import { MessageItem } from '@/components/chat/messageItem';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { TokenUsage } from '@/services/aiServices/types';

interface Message {
    role: 'user' | 'assistant' | 'error';
    content: string;
}

interface MessageListProps {
    messages: Message[];
    loading: boolean;
    usage?: TokenUsage;
    onSave: (message: Message, index: number) => void;
    error: string | null;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

/**
 * MessageList component - Displays the list of messages in the chat
 * Memoized to prevent re-rendering when input changes
 */
const MessageList = memo(({
    messages,
    loading,
    usage,
    onSave,
    error,
    messagesEndRef
}: MessageListProps) => {
    // Memoize the message items
    const messageItems = React.useMemo(() => {
        return messages.map((message, index) => (
            <MessageItem
                key={index}
                message={message}
                onSave={() => onSave(message, index)}
                loading={loading && index === messages.length - 1}
                usage={index === messages.length - 1 && usage ? usage : undefined}
                showSave={index !== 0}
            >
                <AIResponseDisplay
                    loading={loading && index === messages.length - 1}
                    content={message.content}
                    error={error}
                />
            </MessageItem>
        ));
    }, [messages, loading, usage, error, onSave]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {messageItems}
            <div ref={messagesEndRef} />
        </div>
    );
});

MessageList.displayName = 'MessageList';

export { MessageList };
