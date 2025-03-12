import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { saveData } from '@/utils/supabaseStorage';
import { supabase } from '@/supabaseClient';
import { debounce } from 'lodash';
import type { FollowUpQuestion, ItemTypeSaved, SavedItem } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';

export function useSavedItems(type: ItemTypeSaved) {
  const { user, isGoogleUser } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Store user ID in a ref to avoid unnecessary effect triggers
  const userIdRef = useRef<string | null>(null);

  // Create a stable debounce function outside of useCallback
  const stableDebouncedLoad = useRef(
    debounce(async (userId: string, isGoogle: boolean, itemType: string) => {
      if (isGoogle) {
        const { data, error } = await supabase
          .from(itemType)
          .select('*')
          .eq('user_id', userId);

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

  // Save item
  const saveItem = async (item: Omit<SavedItem, 'id' | 'timestamp'>) => {
    if (!user) return;

    // Check if an item with the same question already exists
    const existingItemIndex = savedItems.findIndex(
      savedItem => savedItem.question === item.question &&
        savedItem.user_id === user.id
    );

    if (existingItemIndex !== -1) {
      // Item already exists - update it
      const existingItem = savedItems[existingItemIndex];

      const updatedItem: SavedItem = {
        ...existingItem,
        ...item,
        answer: item.answer,
        model: item.model,
        created_at: new Date().toISOString()
      };

      setSavedItems(prev => {
        const updated = [...prev];
        updated[existingItemIndex] = updatedItem;

        if (isGoogleUser()) {
          // Update in Supabase
          supabase
            .from(type)
            .update({
              answer: item.answer,
              model: item.model,
              created_at: updatedItem.created_at,
              category: item.category || existingItem.category
            })
            .eq('id', existingItem.id)
            .eq('user_id', user.id)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating item in Supabase:', error);
              }
            });
        } else {
          // Update in localStorage
          localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
        }

        return updated;
      });

      return existingItem.id; // Return the ID of the updated item
    } else {
      // Item doesn't exist - create a new one
      const newItem: SavedItem = {
        ...item,
        id: generateId(),
        user_id: user.id, // Explicitly add user_id to the item
        created_at: new Date().toISOString(),
        category: item.category || '',
        question: item.question,
        answer: item.answer,
        model: item.model
      };

      setSavedItems(prev => {
        const updated = [...prev, newItem];

        if (isGoogleUser()) {
          // Save to Supabase
          saveData(type, newItem);
        } else {
          // Save to localStorage
          localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
        }

        return updated;
      });

      return newItem.id; // Return the ID of the new item
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
            saveData(type, { ...updatedItem, user_id: user.id });
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
        const { error, data } = await supabase
          .from(type)
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting item from Supabase:', error);
          return; // Don't update local state if the remote delete failed
        }

        console.info('Successfully deleted from Supabase:', data);
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