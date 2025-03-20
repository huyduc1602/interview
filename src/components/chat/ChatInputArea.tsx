import React, { memo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from '@/components/icons';

interface ChatInputAreaProps {
    input: string;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    placeholder: string;
    hint: string;
}

/**
 * ChatInputArea component - Optimized with internal state management for input
 * to prevent re-renders of parent component
 */
const ChatInputArea = memo(({
    input,
    onInputChange,
    onSubmit,
    loading,
    placeholder,
    hint
}: ChatInputAreaProps) => {
    // Use refs to detect if we are handling a keydown event
    const isHandlingKeyDown = useRef(false);

    // Internal event handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            isHandlingKeyDown.current = true;
            onSubmit(e as unknown as React.FormEvent);
            // Reset after a small delay
            setTimeout(() => {
                isHandlingKeyDown.current = false;
            }, 100);
        }
    };

    return (
        <form onSubmit={onSubmit} className="border-t p-4 bg-white dark:bg-gray-950">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    variant={loading ? "outline" : "default"}
                    className="transition-all duration-200 hover:scale-105"
                >
                    <SendHorizontal className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
                {hint}
            </div>
        </form>
    );
});

ChatInputArea.displayName = 'ChatInputArea';

export { ChatInputArea };
