import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { saveData } from '@/utils/supabaseStorage';
import { supabase } from '@/supabaseClient';
import { debounce } from 'lodash';
import type { FollowUpQuestion, ItemTypeSaved, SavedItem } from '@/types/common';

export function useSavedItems(type: ItemTypeSaved) {
  const { user, isGoogleUser } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Store user ID in a ref to avoid unnecessary effect triggers
  const userIdRef = useRef<number | null>(null);

  // Create a stable debounce function outside of useCallback
  const stableDebouncedLoad = useRef(
    debounce(async (userId: number, isGoogle: boolean, itemType: string) => {
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

    const newItem: SavedItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      created_at: Date.now(),
      category: item.category || '',
      question: item.question,
      answer: item.answer,
      model: item.model
    };

    setSavedItems(prev => {
      const updated = [...prev, newItem];
      if (isGoogleUser()) {
        saveData(type, { ...newItem, user_id: user.id });
      } else {
        localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Add follow-up question
  const addFollowUpQuestion = async ({itemId, question, answer}: FollowUpQuestion) => {
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

    setSavedItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      if (isGoogleUser()) {
        supabase
          .from(type)
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);
      } else {
        localStorage.setItem(`${type}_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return {
    savedItems,
    saveItem,
    addFollowUpQuestion,
    deleteItem
  };
}