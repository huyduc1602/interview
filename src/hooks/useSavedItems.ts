import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { SavedItem } from '@/types/common';

export function useSavedItems() {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load saved items from localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`saved_items_${user.id}`);
      if (saved) {
        setSavedItems(JSON.parse(saved));
      }
    }
  }, [user]);

  // Save item
  const saveItem = (item: Omit<SavedItem, 'id' | 'timestamp'>) => {
    if (!user) return;

    const newItem: SavedItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type: item.type,
      category: item.category || '',
      question: item.question,
      answer: item.answer,
      model: item.model
    };

    setSavedItems(prev => {
      const updated = [...prev, newItem];
      localStorage.setItem(`saved_items_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Add follow-up question
  const addFollowUpQuestion = (itemId: string, question: string, answer: string) => {
    if (!user) return;

    setSavedItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            followUpQuestions: [
              ...(item.followUpQuestions || []),
              { question, answer, timestamp: Date.now() }
            ]
          };
        }
        return item;
      });
      localStorage.setItem(`saved_items_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    if (!user) return;

    setSavedItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      localStorage.setItem(`saved_items_${user.id}`, JSON.stringify(updated));
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