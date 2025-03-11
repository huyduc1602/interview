import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UseAIResponseProps {
  generateAnswer: (prompt: string) => Promise<string>;
  onSuccess?: (content: string) => void;
  onError?: (error: Error) => void;
}

export function useAIResponse({ generateAnswer, onSuccess, onError }: UseAIResponseProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnswer = async (prompt: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateAnswer(prompt);

      if (!response) {
        throw new Error(t('chat.errors.noResponse'));
      }

      onSuccess?.(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('chat.errors.unknown');
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    handleGenerateAnswer
  };
}