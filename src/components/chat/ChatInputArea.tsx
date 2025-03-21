import React, { memo, useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
    // Internal state to handle input value
    // This helps reduce re-renders on the parent component
    const [localInput, setLocalInput] = useState(input);
    const inputTimeout = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation();

    // Update local input when prop changes
    useEffect(() => {
        setLocalInput(input);
    }, [input]);

    // Debounced input change handler
    // This reduces the number of state updates while typing
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalInput(newValue);

        // Clear any pending timeouts
        if (inputTimeout.current) {
            clearTimeout(inputTimeout.current);
        }

        // Debounce the input change to reduce state updates
        inputTimeout.current = setTimeout(() => {
            onInputChange(newValue);
        }, 100);
    };

    // Improved keydown handler that avoids setTimeout for tracking state
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();

            // Ensure we use the current local input value
            if (localInput !== input) {
                onInputChange(localInput);
            }

            // Create a proper form event for submission
            const formEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
            onSubmit(formEvent);
        }
    };

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (inputTimeout.current) {
                clearTimeout(inputTimeout.current);
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure we use the current local input value
        if (localInput !== input) {
            onInputChange(localInput);
        }

        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="border-t p-4 bg-white dark:bg-gray-950">
            <div className="flex gap-2">
                <Input
                    value={localInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder={placeholder}
                    className="flex-1 h-[56px]"
                />
                <Button
                    type="submit"
                    disabled={loading || !localInput.trim()}
                    variant={loading ? "outline" : "default"}
                    className={cn(
                        "px-4 py-2 rounded-lg",
                        "bg-purple-600 text-white",
                        "hover:bg-purple-700",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center gap-2"
                    )}
                >
                    <SendHorizontal className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {t('common.send')}
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
