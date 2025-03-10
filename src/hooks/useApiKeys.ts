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
        setApiKeys(JSON.parse(savedKeys));
      }
    }
  }, [user]);

  const getApiKey = (service: string) => {
    return apiKeys[service] || window.__ENV?.[`VITE_${service.toUpperCase()}_API_KEY`] || import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`];
  };

  const saveApiKey = (service: string, key: string) => {
    if (user) {
      const updatedKeys = { ...apiKeys, [service]: key };
      setApiKeys(updatedKeys);
      localStorage.setItem(`api_keys_${user.id}`, JSON.stringify(updatedKeys));
    }
  };

  return {
    apiKeys,
    getApiKey,
    saveApiKey
  };
}