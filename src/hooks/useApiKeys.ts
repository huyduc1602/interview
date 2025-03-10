import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

declare global {
  interface Window {
    __ENV?: Record<string, string>;
  }
}

export function useApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const savedKeys = localStorage.getItem(`api_keys_${user.id}`);
      if (savedKeys) {
        try {
          const decodedKeys = JSON.parse(atob(savedKeys));
          setApiKeys(decodedKeys);
        } catch (error) {
          console.error('Failed to decode API keys from localStorage:', error);
        }
      }
    }
  }, [user]);

  const getApiKey = (service: string) => {
    const key = apiKeys[service];
    if (key) {
      try {
        return atob(key);
      } catch (error) {
        console.error('Failed to decode API key:', error);
        return null;
      }
    }
    return window.__ENV?.[`VITE_${service.toUpperCase()}_API_KEY`] || import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`];
  };

  const saveApiKey = (service: string, key: string) => {
    if (user) {
      const updatedKeys = { ...apiKeys, [service]: btoa(key) };
      setApiKeys(updatedKeys);
      try {
        const encodedKeys = btoa(JSON.stringify(updatedKeys));
        localStorage.setItem(`api_keys_${user.id}`, encodedKeys);
        console.log(`Saved ${service} key:`, key); // Add this line for debugging
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