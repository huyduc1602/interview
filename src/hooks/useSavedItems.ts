import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { saveDataSupabase, updateDataSupabase, deleteDataSupabase, fetchUserDataSupabase } from '@/utils/supabaseStorage';
import { debounce } from 'lodash';
import type { FollowUpQuestion, ItemTypeSaved, SavedItem } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';

export function useSavedItems(type: ItemTypeSaved) {
  const { user, isGoogleUser } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const userIdRef = useRef<string | null>(null);

  // Create a stable debounce function outside of useCallback
  const stableDebouncedLoad = useRef(
    debounce(async (userId: string, isGoogle: boolean, itemType: string) => {
      if (isGoogle) {
        const { data, error } = await fetchUserDataSupabase(itemType, userId);

        if (error) {
          console.error('Error fetching saved items from Supabase:', error);
        } else if (data) {
          setSavedItems(data);
        }
      } else {
        const saved = localStorage.getItem(`${itemType}_${userId}`);
        if (saved) {
          setSavedItems(JSON.parse(saved));
        }
      }
    }, 500)
  ).current;

  useEffect(() => {
    // Only fetch data if user exists and has changed
    if (user && user.id !== userIdRef.current) {
      userIdRef.current = user.id;

      const isGoogle = isGoogleUser() == true;
      stableDebouncedLoad(user.id, isGoogle, type);
    }
  }, [user, isGoogleUser, type, stableDebouncedLoad]);

  // Helper function to find existing item
  const findExistingItem = (items: SavedItem[], newItem: SavedItem, userId: string) => {
    const index = items.findIndex(item =>
      item.question === newItem.question && item.user_id === userId
    );

    return {
      index,
      item: index !== -1 ? items[index] : null
    };
  };

  // Helper function to update an existing item
  const updateExistingItem = async (
    existingItem: SavedItem,
    updates: Partial<SavedItem>,
    userId: string,
    tableType: ItemTypeSaved,
    isGoogle: boolean
  ): Promise<SavedItem> => {
    const updatedItem: SavedItem = {
      ...existingItem,
      ...updates,
      answer: updates.answer ?? existingItem.answer,
      model: updates.model ?? existingItem.model,
      created_at: new Date().toISOString()
    };

    // Update in Supabase if Google user
    if (isGoogle) {
      const updateFields = {
        answer: updatedItem.answer,
        model: updatedItem.model,
        created_at: updatedItem.created_at,
        category: updates.category || existingItem.category
      };
      const { error } = await updateDataSupabase(tableType, existingItem.id, userId, updateFields);
      if (error) {
        console.error('Error updating item in Supabase:', error);
      }
    }

    return updatedItem;
  };

  // Helper function to create a new item
  const createNewItem = async (
    item: SavedItem,
    userId: string,
    tableType: ItemTypeSaved,
    isGoogle: boolean
  ): Promise<SavedItem> => {
    const newItem: SavedItem = {
      ...item,
      id: item.id ?? generateId(),
      user_id: userId,
      created_at: new Date().toISOString(),
      category: item.category || '',
      question: item.question,
      answer: item.answer,
      model: item.model
    };

    // Save to Supabase if Google user
    if (isGoogle) {
      await saveDataSupabase(tableType, newItem);
    }

    return newItem;
  };

  // Helper function to update localStorage if needed
  const updateLocalStorage = (
    userId: string,
    tableType: ItemTypeSaved,
    items: SavedItem[]
  ) => {
    localStorage.setItem(`${tableType}_${userId}`, JSON.stringify(items));
  };

  // Main saveItem function refactored
  const saveItem = async (item: SavedItem) => {
    if (!user) return;

    // Find existing item if any
    const { index: existingIndex, item: existingItem } = findExistingItem(
      savedItems,
      item,
      user.id
    );

    // Determine if user is a Google user
    const isGoogle = isGoogleUser();

    if (existingItem) {
      // Update existing item
      const updatedItem = await updateExistingItem(
        existingItem,
        item,
        user.id,
        type,
        isGoogle
      );

      // Update state
      setSavedItems(prev => {
        const updated = [...prev];
        updated[existingIndex] = updatedItem;

        // Update localStorage if not Google user
        if (!isGoogle) {
          updateLocalStorage(user.id, type, updated);
        }

        return updated;
      });

      return existingItem.id;
    } else {
      // Create new item
      const newItem = await createNewItem(item, user.id, type, isGoogle);

      // Update state
      setSavedItems(prev => {
        const updated = [...prev, newItem];

        // Update localStorage if not Google user
        if (!isGoogle) {
          updateLocalStorage(user.id, type, updated);
        }

        return updated;
      });

      return newItem.id;
    }
  };

  // Add follow-up question
  const addFollowUpQuestion = async ({ itemId, question, answer }: FollowUpQuestion) => {
    if (!user) return;

    setSavedItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            followUpQuestions: [
              ...(item.followUpQuestions || []),
              { question, answer, timestamp: Date.now() }
            ]
          };

          if (isGoogleUser()) {
            // Use the new updateData function
            updateDataSupabase(type, item.id, user.id, {
              followUpQuestions: updatedItem.followUpQuestions
            });
          }

          return updatedItem;
        }
        return item;
      });

      if (!isGoogleUser()) {
        localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
      }

      return updated;
    });
  };

  // Delete item
  const deleteItem = async (itemId: string) => {
    if (!user) return;

    try {
      // For Google users, delete from Supabase first
      if (isGoogleUser()) {
        const { error } = await deleteDataSupabase(type, itemId, user.id);

        if (error) {
          console.error('Error deleting item from Supabase:', error);
          return; // Don't update local state if the remote delete failed
        }

        console.info('Successfully deleted from Supabase');
      }

      // Update local state after successful remote delete (or for local storage users)
      setSavedItems(prev => {
        const updated = prev.filter(item => item.id !== itemId);

        // For non-Google users, update localStorage
        if (!isGoogleUser()) {
          localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
        }

        return updated;
      });
    } catch (error) {
      console.error('Unexpected error during item deletion:', error);
    }
  };

  return {
    savedItems,
    saveItem,
    addFollowUpQuestion,
    deleteItem
  };
}