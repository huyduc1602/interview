import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export enum ApiKeyService {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  MISTRAL = 'mistral',
  OPENCHAT = 'openchat',
  GOOGLE_SHEET_API_KEY = 'googleSheetApiKey',
  SPREADSHEET_ID = 'spreadsheetId',
  GOOGLE_SHEET_KNOWLEDGE_BASE = 'sheetNameKnowledgeBase',
  GOOGLE_SHEET_INTERVIEW_QUESTIONS = 'sheetNameInterviewQuestions'
}

export function useApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (savedKeys) {
        try {
          const decodedKeys = JSON.parse(savedKeys);
          setApiKeys(decodedKeys);
        } catch (error) {
          console.error('Failed to decode API keys from localStorage:', error);
        }
      }
    }
  }, [user]);

  const getApiKey = (service: string) => {
    return apiKeys[service] || '';
  };

  const saveApiKey = (service: string, key: string) => {
    if (user) {
      const updatedKeys = { ...apiKeys, [service]: key };
      setApiKeys(updatedKeys);
      try {
        const encodedKeys = JSON.stringify(updatedKeys);
        localStorage.setItem(`api_keys_${user.id}`, encodedKeys);
      } catch (error) {
        console.error('Failed to encode API keys to localStorage:', error);
      }
    }
  };

  return {
    apiKeys,
    getApiKey,
    saveApiKey
  };
}