import React, { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BookmarkPlus } from 'lucide-react';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import type { InterviewQuestion } from '@/types/interview';

interface InterviewQuestionsContentProps {
  selectedQuestion: InterviewQuestion | null;
  user: any;
  saveItem: (item: any) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleRegenerateAnswer: () => void;
  loading: boolean;
  error: string | null;
  renderModelSelector: () => JSX.Element;
}

const SharedContent: React.FC<InterviewQuestionsContentProps> = ({
  selectedQuestion,
  user,
  saveItem,
  selectedModel,
  loading,
  error,
  renderModelSelector
}) => {
  const { t } = useTranslation();

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
                  onClick={() => saveItem({
                    type: 'interview',
                    category: selectedQuestion.category || '',
                    question: selectedQuestion.question,
                    answer: selectedQuestion.answer || '',
                    model: selectedModel
                  })}
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </Button>
              )}
            </div>
            {renderModelSelector()}
          </div>
          <div className="rounded-lg bg-white shadow">
            <AIResponseDisplay
              loading={loading}
              content={selectedQuestion?.answer || null}
              error={error}
              emptyMessage={t('interview.selectQuestion')}
            />
          </div>
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