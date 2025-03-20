import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { Layout } from '@/layouts';
import { useTranslation } from 'react-i18next';
import { SaveDialog } from '@/components/ui/saveDialog';
import { AIModel, AIModelType, TokenUsage } from '../services/aiServices/types';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { debounce } from 'lodash';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInputArea } from '@/components/chat/ChatInputArea';
import { MessageList } from '@/components/chat/MessageList';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

interface ChatPageProps {
  onModelChange?: (model: AIModelType) => void;
  tokenUsage?: TokenUsage;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onModelChange }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  // Simplify to just one input state
  const [input, setInput] = useState('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const {
    loading,
    selectedModel: selectedModelString,
    setSelectedModel: setModel,
    generateAnswer,
    usage
  } = useChat({ type: 'chat' }, user);

  const selectedModel = selectedModelString as AIModel;

  // Model updater
  const setSelectedModel = useCallback((model: AIModelType) => {
    setModel(model);
    if (onModelChange) {
      onModelChange(model);
    }
  }, [setModel, onModelChange]);

  // Scroll handler
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Welcome message
  const welcomeMessage: Message = useMemo(() => ({
    role: 'assistant',
    content: `# 👋 ${t('chat.welcome.greeting')}\n\n${t('chat.welcome.capabilities')}`
  }), [t]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [messages.length, welcomeMessage]);

  // Handle direct input changes
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };

    // Update messages first, then reset input
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError(null);

    try {
      const response = await generateAnswer(input);

      if (!response) {
        throw new Error(t('chat.errors.noResponse'));
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        role: 'error',
        content: err instanceof Error ? err.message : t('chat.errors.unknown')
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(errorMessage.content);
    }
  }, [input, loading, generateAnswer, t]);

  const handleSave = useCallback((message: Message, index: number) => {
    if (message.role === 'error' || index === 0) return;
    setSelectedMessage(message);
    setIsSaveDialogOpen(true);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!messages.length) return;
    const lastUserMessage = [...messages].reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
      const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
      await handleSubmit(fakeEvent);
    }
  }, [messages, handleSubmit]);

  const handleClearCache = useCallback(() => {
    setMessages([welcomeMessage]);
    setError(null);
  }, [welcomeMessage]);

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
        <ChatHeader
          title={t('chat.header.title')}
          selectedModel={selectedModel}
          onModelChange={(model: string) => setSelectedModel(model as AIModel)}
          onRegenerate={handleRetry}
          onClearCache={handleClearCache}
          loading={loading}
          t={t}
        />

        <MessageList
          messages={messages}
          loading={loading}
          usage={usage}
          onSave={handleSave}
          error={error}
          messagesEndRef={messagesEndRef}
        />

        <ChatInputArea
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
          placeholder={t('chat.input.placeholder') || 'Type a message...'}
          hint={t('chat.input.hint')}
        />
      </div>

      <SaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        message={selectedMessage}
      />
    </Layout>
  );
};

export default memo(ChatPage);