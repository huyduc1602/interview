import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { saveData, updateData, deleteData, fetchUserData, saveChatHistory, fetchChatHistory } from '@/utils/supabaseStorage';
import { debounce } from 'lodash';
import type { ItemTypeSaved, SavedItem, ChatMessage } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';
import { FollowUpQuestion } from '../types/common';

export function useSavedItems(type: ItemTypeSaved) {
  const { user, isSocialUser: isSocialUser } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  // Store user ID in a ref to avoid unnecessary effect triggers
  const userIdRef = useRef<string | null>(null);

  // Create a stable debounce function outside of useCallback
  const stableDebouncedLoad = useRef(
    debounce(async (userId: string, isSocialLogin: boolean, itemType: string) => {
      if (isSocialLogin) {
        const { data, error } = await fetchUserData(itemType as ItemTypeSaved, userId);

        if (error) {
          console.error('Error fetching saved items from Supabase:', error);
        } else if (data) {
          setSavedItems(data);

          // Also fetch chat histories for these items
          const chatHistoriesMap: Record<string, ChatMessage[]> = {};
          for (const item of data) {
            const { data: chatData } = await fetchChatHistory(item.id, userId);
            if (chatData && chatData.messages) {
              chatHistoriesMap[item.question] = chatData.messages;
            }
          }
          setChatHistories(chatHistoriesMap);
        }
      } else {
        const saved = localStorage.getItem(`${itemType}_${userId}`);
        if (saved) {
          setSavedItems(JSON.parse(saved));
        }

        // Load chat histories from localStorage
        const savedChatHistories = localStorage.getItem(`chat_histories_${itemType}_${userId}`);
        if (savedChatHistories) {
          setChatHistories(JSON.parse(savedChatHistories));
        }
      }
    }, 500)
  ).current;

  useEffect(() => {
    // Only fetch data if user exists and has changed
    if (user && user.id !== userIdRef.current) {
      userIdRef.current = user.id;

      const isSocialLogin = isSocialUser() == true;
      stableDebouncedLoad(user.id, isSocialLogin, type);
    }
  }, [user, isSocialUser, type, stableDebouncedLoad]);

  // Helper function for finding existing items
  const findExistingItem = useCallback((items: SavedItem[], question: string, userId: string) => {
    const index = items.findIndex(item =>
      item.question === question && item.user_id === userId
    );

    return {
      index,
      item: index !== -1 ? items[index] : null
    };
  }, []);

  // Helper function to update localStorage
  const updateLocalStorage = useCallback((userId: string, itemType: ItemTypeSaved, items: SavedItem[]) => {
    localStorage.setItem(`${itemType}_${userId}`, JSON.stringify(items));
  }, []);

  // Save chat history for an item
  const saveChatHistoryForItem = useCallback(async (
    itemId: string,
    question: string,
    messages: ChatMessage[]
  ) => {
    if (!user) return;

    const isSocialLogin = isSocialUser();

    // Update local state
    setChatHistories(prev => {
      const updated = { ...prev, [question]: messages };

      // Save to localStorage if not Google user
      if (!isSocialLogin) {
        localStorage.setItem(`chat_histories_${type}_${user.id}`, JSON.stringify(updated));
      }

      return updated;
    });

    // Save to Supabase if Google user
    if (isSocialLogin) {
      await saveChatHistory(itemId, user.id, messages);
    }
  }, [user, isSocialUser, type]);

  // Save or update item
  const saveItem = useCallback(async (item: SavedItem) => {
    if (!user) return null;

    // Find existing item if any
    const { index: existingIndex, item: existingItem } = findExistingItem(
      savedItems,
      item.question,
      user.id
    );

    // Determine if user is a Google user
    const isSocialLogin = isSocialUser();

    if (existingItem) {
      // Update existing item
      const updatedItem: SavedItem = {
        ...existingItem,
        ...item,
        answer: item.answer || existingItem.answer,
        model: item.model || existingItem.model,
        updated_at: new Date().toISOString()
      };

      // Update in Supabase if Google user
      if (isSocialLogin) {
        await updateData(type, existingItem.id, user.id, {
          answer: updatedItem.answer,
          model: updatedItem.model,
          updated_at: updatedItem.updated_at,
          category: item.category || existingItem.category
        });
      }

      // Update state
      setSavedItems(prev => {
        const updated = [...prev];
        updated[existingIndex] = updatedItem;

        // Update localStorage if not Google user
        if (!isSocialLogin) {
          updateLocalStorage(user.id, type, updated);
        }

        return updated;
      });

      return existingItem.id;
    } else {
      // Create new item
      const newItem: SavedItem = {
        ...item,
        id: item.id ?? generateId(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: item.category || '',
        question: item.question,
        answer: item.answer,
        model: item.model
      };

      // Save to Supabase if Google user
      if (isSocialLogin) {
        await saveData(type, newItem);
      }

      // Update state
      setSavedItems(prev => {
        const updated = [...prev, newItem];

        // Update localStorage if not Google user
        if (!isSocialLogin) {
          updateLocalStorage(user.id, type, updated);
        }

        return updated;
      });

      return newItem.id;
    }
  }, [savedItems, user, isSocialUser, type, findExistingItem, updateLocalStorage]);

  // Add follow-up question
  const addFollowUpQuestion = useCallback(async ({ itemId, question, answer }: FollowUpQuestion) => {
    if (!user) return;

    const item = savedItems.find(item => item.id === itemId);
    if (!item) return;

    // Get existing messages or initialize empty array
    const existingMessages = chatHistories[item.question] || [];

    // Add new messages
    const updatedMessages: ChatMessage[] = [
      ...existingMessages,
      { role: 'user', content: question, timestamp: Date.now() },
      { role: 'assistant', content: answer, timestamp: Date.now() }
    ];

    // Save chat history
    await saveChatHistoryForItem(itemId, item.question, updatedMessages);

  }, [user, savedItems, chatHistories, saveChatHistoryForItem]);

  // Delete item
  const deleteItem = useCallback(async (itemId: string) => {
    if (!user) return;

    // Find the item to get its question (needed for chat history in local state)
    const item = savedItems.find(item => item.id === itemId);
    if (!item) return;

    try {
      // For Google users, delete from Supabase first
      if (isSocialUser()) {
        const { error } = await deleteData(type, itemId, user.id);

        if (error) {
          console.error('Error deleting item from Supabase:', error);
          return; // Don't update local state if the remote delete failed
        }

        console.info('Successfully deleted from Supabase');
      }

      // Update items state
      setSavedItems(prev => {
        const updated = prev.filter(item => item.id !== itemId);

        // For non-Google users, update localStorage
        if (!isSocialUser()) {
          updateLocalStorage(user.id, type, updated);
        }

        return updated;
      });

      // Also update chat histories state
      setChatHistories(prev => {
        const updated = { ...prev };
        if (item.question in updated) {
          delete updated[item.question];

          // Update localStorage for non-Google users
          if (!isSocialUser()) {
            localStorage.setItem(`chat_histories_${type}_${user.id}`, JSON.stringify(updated));
          }
        }
        return updated;
      });

    } catch (error) {
      console.error('Unexpected error during item deletion:', error);
    }
  }, [user, isSocialUser, type, updateLocalStorage, savedItems]);

  return {
    savedItems,
    saveItem,
    addFollowUpQuestion,
    deleteItem,
    chatHistories,
    saveChatHistoryForItem
  };
}