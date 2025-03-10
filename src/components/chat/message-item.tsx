import React from 'react';
import { MarkdownContent } from '@/components/ui/markdownContent';
import { Button } from '@/components/ui/button';
import { Save, AlertCircle, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export interface MessageItemProps {
  message: Message;
  onSave: () => void;
  loading?: boolean;
  showSave?: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  children?: React.ReactNode;
}

export function MessageItem({
  message,
  onSave,
  loading,
  showSave = true,
  usage
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  if (loading) {
    return (
      <div className="group border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-4xl mx-auto py-6">
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group relative border-b border-gray-200 dark:border-gray-800",
      isUser ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
    )}>
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex gap-6 items-start">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0">
            {isUser ? (
              <div className="bg-gray-300 dark:bg-gray-600 w-full h-full rounded-sm flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className="bg-green-600 w-full h-full rounded-sm flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4 overflow-hidden">
            {isError ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span>{message.content}</span>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownContent content={message.content} />
              </div>
            )}
          </div>

          {/* Actions */}
          {!isUser && !isError && showSave && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="h-8 w-8"
                title="Save to questions"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {usage && !isUser && (
          <div className="text-xs text-muted-foreground mt-4 space-x-4">
            <span>Tokens: {usage.total_tokens}</span>
            <span>Prompt: {usage.prompt_tokens}</span>
            <span>Completion: {usage.completion_tokens}</span>
          </div>
        )}
      </div>
    </div>
  );
}