import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { ModelSelector } from '@/components/ui/modelSelector';
import { SaveDialog } from '@/components/ui/saveDialog';
import { MessageItem } from '@/components/chat/messageItem';
import { SendHorizontal, AlertCircle, Sparkles } from '@/components/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { AIModel, AIModelType, TokenUsage } from '../services/aiServices/types';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

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

  // Update parent component when model changes
  const setSelectedModel = (model: AIModelType) => {
    setModel(model);
    if (onModelChange) {  // Check if callback exists
      onModelChange(model);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const welcomeMessage: Message = {
    role: 'assistant',
    content: `# 👋 ${t('chat.welcome.greeting')}\n\n${t('chat.welcome.capabilities')}`
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
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
  };

  const handleSave = (message: Message, index: number) => {
    // Don't allow saving error messages or welcome message
    if (message.role === 'error' || index === 0) return;
    setSelectedMessage(message);
    setIsSaveDialogOpen(true);
  };

  const handleRetry = async () => {
    if (!messages.length) return;
    const lastUserMessage = [...messages].reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove last error message if exists
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
      await handleSubmit({
        preventDefault: () => { },
      } as React.FormEvent);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl h-[calc(100vh-4rem)] flex flex-col">
        <div className="border-b p-4 bg-white/80 backdrop-blur-sm dark:bg-gray-950/80">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              {t('chat.header.title')}
            </h1>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={(model: string) => setSelectedModel(model as AIModel)}
              onRegenerate={handleRetry}
              onClearCache={() => {
                setMessages([welcomeMessage]);
                setError(null);
              }}
              loading={loading}
              disabled={loading}
              type="chat"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {messages.map((message, index) => (
            <MessageItem
              key={index}
              message={message}
              onSave={() => handleSave(message, index)}
              loading={loading && index === messages.length - 1}
              usage={index === messages.length - 1 && usage ? usage : undefined}
              showSave={index !== 0} // Hide save button for welcome message
            >
              <AIResponseDisplay
                loading={loading && index === messages.length - 1}
                content={message.content}
                error={error}
              />
            </MessageItem>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4 bg-white dark:bg-gray-950">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.input.placeholder')}
              disabled={loading}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              variant={loading ? "outline" : "default"}
              className="transition-all duration-200 hover:scale-105"
              title={t('chat.actions.send')}
            >
              <SendHorizontal className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {t('chat.input.hint')}
          </div>
        </form>
      </div>

      <SaveDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        message={selectedMessage}
      />
    </Layout>
  );
}

export default ChatPage;