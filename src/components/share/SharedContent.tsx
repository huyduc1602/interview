import React, { JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Send } from 'lucide-react';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { SavedItem, SharedCategoryShuffled, SharedItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { ChatHistory } from '@/types/knowledge';

interface InterviewQuestionsContentProps {
  selectedQuestion: SharedItem | SharedCategoryShuffled | null;
  user: any;
  saveItem: (item: any) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleRegenerateAnswer: () => void;
  loading: boolean;
  error: string | null;
  renderModelSelector: () => JSX.Element;
  savedItems: SavedItem[];
  addFollowUpQuestion: (itemId: string, question: string, answer: string) => void;
  generateAnswer: (prompt: string) => Promise<string>;
}

const SharedContent: React.FC<InterviewQuestionsContentProps> = ({
  selectedQuestion,
  user,
  saveItem,
  selectedModel,
  loading,
  error,
  renderModelSelector,
  savedItems,
  addFollowUpQuestion,
  generateAnswer
}) => {
  const { t } = useTranslation();
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleFollowUpQuestion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedQuestion) return;

    const question = chatInput.trim();
    setChatInput('');

    try {
      setChatHistory(prev => ({
        ...prev,
        [selectedQuestion.question]: [
          ...(prev[selectedQuestion.question] || []),
          { role: 'user', content: question, timestamp: Date.now() }
        ]
      }));

      const contextualQuestion = `Based on the topic "${selectedQuestion.question}" and its explanation, please answer this follow-up question: ${question}`;
      const answer = await generateAnswer(contextualQuestion);

      setChatHistory(prev => ({
        ...prev,
        [selectedQuestion.question]: [
          ...(prev[selectedQuestion.question] || []),
          { role: 'assistant', content: answer, timestamp: Date.now() }
        ]
      }));

      if (user && selectedQuestion) {
        const savedItem = savedItems.find(
          item => item.question === selectedQuestion.question
        );

        if (savedItem) {
          addFollowUpQuestion(savedItem.id, question, answer);
        }
      }
    } catch (error) {
      console.error('Failed to get follow-up answer:', error);
      setChatHistory(prev => ({
        ...prev,
        [selectedQuestion.question]: [
          ...(prev[selectedQuestion.question] || []),
          {
            role: 'assistant',
            content: t('common.errors.failedToGetAnswer'),
            isError: true,
            timestamp: Date.now()
          }
        ]
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const renderChatHistory = () => {
    return selectedQuestion?.question && chatHistory[selectedQuestion.question]?.length > 0 && (
      <div className="space-y-4 mb-6 border rounded-lg p-4 bg-gray-50">
        {chatHistory[selectedQuestion.question].map((message, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg p-4",
              message.role === 'user'
                ? "bg-white border ml-4"
                : message.isError
                  ? "bg-red-50 mr-4"
                  : "bg-purple-50 mr-4"
            )}
          >
            <div className="text-xs text-gray-500 mb-1">
              {message.role === 'user' ? t('common.you') : t('common.assistant')}
            </div>
            <AIResponseDisplay
              content={message.content}
              loading={false}
              error={message.isError ? message.content : null}
            />
          </div>
        ))}
      </div>
    )
  };

  const renderQuestionAsk = () => {
    return selectedQuestion?.answer && (
      <form onSubmit={handleFollowUpQuestion} className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={handleInputChange}
          placeholder={t('knowledge.followUp.inputPlaceholder')}
          className="flex-1 px-4 py-2 ms-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !chatInput.trim()}
          className={cn(
            "px-4 py-2 rounded-lg",
            "bg-purple-600 text-white",
            "hover:bg-purple-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2"
          )}
        >
          <Send className="w-4 h-4" />
          {t('common.send')}
        </button>
      </form>
    )
  }

  return (
    <div className="py-6 overflow-y-auto">
      {selectedQuestion ? (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">
                {selectedQuestion.question}
              </h1>
              {user && selectedQuestion.answer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    saveItem({
                      type: selectedQuestion.type,
                      category: selectedQuestion.category || '',
                      question: selectedQuestion.question,
                      answer: selectedQuestion.answer || '',
                      model: selectedModel
                    });
                    setIsSaved(true);
                  }}
                  className={isSaved ? 'bg-green-100' : ''}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </Button>
              )}
            </div>
            {renderModelSelector()}
          </div>
          <div className="space-y-6 border-b pb-6">
            <div className="rounded-lg bg-white shadow">
              <AIResponseDisplay
                loading={loading}
                content={selectedQuestion?.answer || null}
                error={error}
                emptyMessage={t('interview.selectQuestion')}
              />
            </div>
          </div>
          {selectedQuestion.answer && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                {t('knowledge.followUp.title')}
              </h2>
              {renderChatHistory()}
              {renderQuestionAsk()}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>{t('interviewQuestions.messages.selectFromSidebar')}</p>
        </div>
      )}
    </div>
  );
};

export default SharedContent;