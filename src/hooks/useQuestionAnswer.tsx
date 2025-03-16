/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/common';

export function useQuestionAnswer(selectedQuestion, selectedModel, generateAnswerFn) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    // Tách logic và memo hóa hàm để tránh recreate function
    const handleGenerateAnswer = useCallback(async () => {
        if (!selectedQuestion) return;

        setLoading(true);
        setError(null);

        try {
            const answer = await generateAnswerFn(selectedQuestion, selectedModel);
            // Xử lý kết quả
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err instanceof Error ? err : new Error('Failed to generate answer'));
        }
    }, [selectedQuestion?.id, selectedModel, generateAnswerFn]);

    // useEffect sạch hơn với dependency rõ ràng
    useEffect(() => {
        if (selectedQuestion?.id) {
            handleGenerateAnswer();
        }

        // Clean up function
        return () => {
            // Reset state khi component unmount
        };
    }, [selectedQuestion?.id, handleGenerateAnswer]);

    return { messages, loading, error, setMessages };
}
