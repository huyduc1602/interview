import React, { JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Send, X } from 'lucide-react';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import { ItemTypeSaved, SavedItem, SharedCategoryShuffled, SharedItem, User, ChatMessage, FollowUpQuestion } from '@/types/common';
import { cn } from '@/lib/utils';
import { generateId } from '@/utils/supabaseUtils';
import { useSavedItems } from '@/hooks/useSavedItems';
import LoadingDots from '@/components/ui/loadingDots';

interface InterviewQuestionsContentProps {
  selectedQuestion: SharedItem | SharedCategoryShuffled | null;
  user: User | null;
  saveItem: (item: SavedItem) => Promise<string | null>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleRegenerateAnswer: () => Promise<void>;
  loading: boolean;
  error: unknown;
  renderModelSelector?: () => JSX.Element;
  savedItems: SavedItem[];
  addFollowUpQuestion: (item: FollowUpQuestion) => void;
  generateAnswer: (question: string) => Promise<string>;
  setAnswer?: React.Dispatch<React.SetStateAction<string | null>>;
  isSavedAnswer?: boolean;
  setIsSavedAnswer?: React.Dispatch<React.SetStateAction<boolean>>;
  existingSavedItem?: SavedItem | null;
  typeSavedItem?: ItemTypeSaved;
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
  generateAnswer,
  isSavedAnswer = false,
  setIsSavedAnswer,
  existingSavedItem,
  typeSavedItem = ItemTypeSaved.InterviewAnswers
}) => {
  const { t } = useTranslation();
  const [chatInput, setChatInput] = useState('');
  const { deleteItem, chatHistories, saveChatHistoryForItem } = useSavedItems(typeSavedItem);

  // Load chat history for the current question
  useEffect(() => {
    // If there's an existing saved item and we've saved the answer, prepare to display chat history
    if (selectedQuestion && existingSavedItem && isSavedAnswer) {
      console.log('Loading chat history for:', selectedQuestion.question);
    }
  }, [selectedQuestion, existingSavedItem, isSavedAnswer]);

  // Refactored small functions for better maintainability

  // 1. Function to get or create a saved item
  const getOrCreateSavedItem = async (question: SharedItem | SharedCategoryShuffled): Promise<string | null> => {
    if (!user || !question) return null;

    // Check if item exists
    const existingSaved = existingSavedItem || savedItems.find(
      item => item.question === question.question
    );

    // If exists, return its ID
    if (existingSaved) {
      return existingSaved.id;
    }

    // Otherwise create and save new item
    const newItem: SavedItem = {
      id: question.id ?? generateId(),
      user_id: user.id,
      category: question.category || '',
      question: question.question,
      answer: question.answer || '',
      model: selectedModel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save the item and return new ID
    const newId = await saveItem(newItem);

    // Update UI state to show this item is now saved
    if (setIsSavedAnswer) {
      setIsSavedAnswer(true);
    }

    return newId;
  };

  // 2. Function to update chat history with user question
  const updateWithUserQuestion = async (itemId: string, questionText: string, questionContent: string, existingMessages: ChatMessage[]): Promise<ChatMessage[]> => {
    // Add user message
    const updatedMessages: ChatMessage[] = [
      ...existingMessages,
      { role: 'user', content: questionText, timestamp: Date.now() }
    ];

    // Save chat history with user's question
    await saveChatHistoryForItem(itemId, questionContent, updatedMessages);

    return updatedMessages;
  };

  // 3. Function to generate answer and update history
  const generateAndAddAnswer = async (itemId: string, questionText: string, questionContent: string, contextualPrompt: string, messages: ChatMessage[]): Promise<void> => {
    // Generate answer
    const answer = await generateAnswer(contextualPrompt);

    // Create final messages with assistant response
    const finalMessages: ChatMessage[] = [
      ...messages,
      { role: 'assistant', content: answer, timestamp: Date.now() }
    ];

    // Save complete history
    await saveChatHistoryForItem(itemId, questionContent, finalMessages);

    // Also add to follow-up questions (legacy support)
    addFollowUpQuestion({ itemId, question: questionText, answer });
  };

  // 4. Function to handle errors
  const handleChatError = async (error: unknown, itemId: string, questionContent: string, existingMessages: ChatMessage[]): Promise<void> => {
    console.error('Failed to get follow-up answer:', error);

    // Add error message to chat history
    const errorMessages: ChatMessage[] = [
      ...existingMessages,
      {
        role: 'assistant',
        content: t('common.errors.failedToGetAnswer'),
        isError: true,
        timestamp: Date.now()
      }
    ];

    await saveChatHistoryForItem(itemId, questionContent, errorMessages);
  };

  // Main function refactored
  const handleFollowUpQuestion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedQuestion) return;

    const question = chatInput.trim();
    setChatInput('');

    try {
      // Step 1: Get or create saved item
      const itemId = await getOrCreateSavedItem(selectedQuestion);

      if (!itemId) {
        console.error('Failed to get or create saved item');
        return;
      }

      // Step 2: Get existing chat history for this question
      const existingMessages = chatHistories[selectedQuestion.question] || [];

      // Step 3: Update history with user's question
      const updatedMessages = await updateWithUserQuestion(
        itemId,
        question,
        selectedQuestion.question,
        existingMessages
      );

      // Step 4: Create contextual prompt and generate answer
      const contextualQuestion = `Based on the topic "${selectedQuestion.question}" and its explanation, please answer this follow-up question: ${question}`;

      // Step 5: Generate answer and add to history
      await generateAndAddAnswer(
        itemId,
        question,
        selectedQuestion.question,
        contextualQuestion,
        updatedMessages
      );
    } catch (error) {
      // Find saved item ID again (in case of error during process)
      const savedItem = existingSavedItem || savedItems.find(
        item => item.question === selectedQuestion.question
      );

      if (savedItem) {
        const existingMessages = chatHistories[selectedQuestion.question] || [];
        await handleChatError(error, savedItem.id, selectedQuestion.question, existingMessages);
      } else {
        console.error('Error handling follow-up question and no saved item found:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleSaveOrDeleteItem = () => {
    if (isSavedAnswer) {
      if (existingSavedItem) deleteItem(existingSavedItem.id);
    } else {
      if (selectedQuestion) {
        const itemSaved: SavedItem = {
          id: selectedQuestion.id ?? generateId(),
          user_id: user?.id ?? generateId(),
          category: selectedQuestion.category || '',
          question: selectedQuestion.question,
          answer: selectedQuestion.answer || '',
          model: selectedModel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        saveItem(itemSaved);
      }
    }

    if (setIsSavedAnswer) {
      setIsSavedAnswer(!isSavedAnswer);
    }
  };

  // New function to delete a message and its response
  const deleteMessagePair = async (messageIndex: number): Promise<void> => {
    if (!selectedQuestion || !user) return;

    // Find the saved item for this question
    const savedItem = existingSavedItem || savedItems.find(
      item => item.question === selectedQuestion.question
    );

    if (!savedItem) {
      console.error('Cannot delete message: No saved item found');
      return;
    }

    const currentMessages = chatHistories[selectedQuestion.question] || [];

    // Make sure the message at this index is a user message
    if (messageIndex >= currentMessages.length || currentMessages[messageIndex].role !== 'user') {
      console.error('Invalid message index or not a user message');
      return;
    }

    // Create a copy of messages array for modification
    const updatedMessages = [...currentMessages];

    // If this user message is followed by an assistant message, remove both
    if (messageIndex + 1 < updatedMessages.length &&
      updatedMessages[messageIndex + 1].role === 'assistant') {
      // Remove both messages (user message and the assistant response)
      updatedMessages.splice(messageIndex, 2);
    } else {
      // Just remove the user message if there's no assistant response
      updatedMessages.splice(messageIndex, 1);
    }

    // Save updated chat history
    try {
      await saveChatHistoryForItem(savedItem.id, selectedQuestion.question, updatedMessages);
      console.log('Message pair deleted successfully');
    } catch (error) {
      console.error('Failed to delete message pair:', error);
    }
  };

  // Update the renderChatHistory function to include delete buttons
  const renderChatHistory = () => {
    const messages = selectedQuestion && chatHistories[selectedQuestion.question];

    return selectedQuestion?.question && messages && messages.length > 0 && (
      <div className="space-y-4 mb-6 border rounded-lg p-4 bg-gray-50">
        {messages.map((message, index) => (
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
            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
              <span>{message.role === 'user' ? t('common.you') : t('common.assistant')}</span>

              {/* Add delete button for user messages */}
              {message.role === 'user' && (
                <button
                  onClick={() => deleteMessagePair(index)}
                  className="hover:bg-gray-200 p-1 rounded-full transition-colors"
                  title={t('common.delete')}
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              )}
            </div>
            <AIResponseDisplay
              content={message.content}
              loading={false}
              error={message.isError ? message.content : null}
            />
          </div>
        ))}
      </div>
    );
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{selectedQuestion.question}</h1>
            {renderModelSelector && renderModelSelector()}
          </div>

          {loading ? (
            <LoadingDots />
          ) : (
            <>
              <div className="text-right">
                <Button
                  variant={isSavedAnswer ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleSaveOrDeleteItem}
                  className="gap-1"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  {isSavedAnswer
                    ? t('common.remove')
                    : t('common.save')}
                </Button>
              </div>

              <AIResponseDisplay
                content={selectedQuestion.answer || ''}
                loading={loading}
                error={error instanceof Error ? error.message : null}
              />

              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">
                  {t('knowledge.followUp.title')}
                </h2>
                {renderChatHistory()}
                {renderQuestionAsk()}
              </div>
            </>
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